import { checkInitData, isAllowed, rateLimited, json } from "../../lib/tg.js";
import { ROLES } from "../../lib/texts.js";

const system = (role) => `You are an English conversation partner for a Russian-speaking learner at a beginner level (A1-A2, knows basic English).
Scenario: ${role}
Rules:
- Use very simple English: short sentences, common everyday words, 1-2 sentences per reply. Ask one simple question at a time so the conversation keeps going. Stay in your role.
- If the learner writes in Russian or mixes languages, keep the conversation going and show them in "better" how to say it in English.
- Corrections are about the learner's LAST message only. Explain mistakes briefly and kindly in Russian (1-2 sentences). Ignore missing capital letters and final punctuation.
Reply with ONLY a JSON object, no other text:
{"reply": "your reply in English", "reply_ru": "Russian translation of your reply", "correction": "short explanation of mistakes in Russian, or empty string if there were none or there is no learner message yet", "better": "the learner's last message rewritten in correct natural English, or empty string if it was already correct or there is no learner message yet", "hint": "one short example of what the learner could answer next, in simple English"}`;

function cleanTurns(turns) {
  const out = [{ role: "user", content: "(Start the conversation now.)" }];
  if (Array.isArray(turns)) {
    for (const t of turns.slice(-20)) {
      if (!t || (t.role !== "user" && t.role !== "assistant")) continue;
      const content = String(t.content || "").slice(0, 1000).trim();
      if (!content) continue;
      const last = out[out.length - 1];
      if (last.role === t.role) last.content += "\n" + content;
      else out.push({ role: t.role, content });
    }
  }
  return out[out.length - 1].role === "user" ? out : null; // the learner must speak last
}

function parseJson(text) {
  try { return JSON.parse(text); } catch {}
  const a = text.indexOf("{"), b = text.lastIndexOf("}");
  if (a >= 0 && b > a) { try { return JSON.parse(text.slice(a, b + 1)); } catch {} }
  return null;
}

const enabled = (env) => !!(env.ANTHROPIC_API_KEY && env.BOT_TOKEN);

export const onRequestGet = ({ env }) => json({ enabled: enabled(env) });

export async function onRequestPost({ request, env }) {
  if (!enabled(env)) return json({ error: "disabled" }, 503);
  const body = await request.json().catch(() => ({}));
  const user = await checkInitData(body.initData, env.BOT_TOKEN);
  if (!user) return json({ error: "not_telegram" }, 401);
  if (!isAllowed(env, user.id)) return json({ error: "not_allowed", userId: user.id }, 403);
  if (rateLimited("chat:" + user.id, 20, 60_000)) return json({ error: "rate_limited" }, 429);

  const role = ROLES[Number(body.scenario)];
  if (!role) return json({ error: "bad_scenario" }, 400);
  const messages = cleanTurns(body.turns);
  if (!messages) return json({ error: "bad_turns" }, 400);

  let r;
  try {
    r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: env.CLAUDE_MODEL || "claude-haiku-5-5",
        max_tokens: 700,
        system: system(role),
        messages,
      }),
    });
  } catch {
    return json({ error: "upstream" }, 502);
  }
  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    console.error("Anthropic API error", r.status, detail.slice(0, 500));
    const busy = r.status === 429 || r.status === 529;
    return json({ error: busy ? "busy" : "upstream" }, busy ? 503 : 502);
  }
  const data = await r.json();
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
  const out = parseJson(text);
  if (!out || !out.reply) return json({ error: "bad_reply" }, 502);
  const s = (v) => String(v || "").trim();
  return json({ reply: s(out.reply), reply_ru: s(out.reply_ru), correction: s(out.correction), better: s(out.better), hint: s(out.hint) });
}
