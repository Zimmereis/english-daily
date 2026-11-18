import { checkInitData, isAllowed, rateLimited, json } from "../../lib/tg.js";
import { ROLES, MANGO_PROMPT, MANGO_STYLE, MANGO_MOODS } from "../../lib/texts.js";
import { isVip, readAi, writeAi, quota, canChat, spend } from "../../lib/stars.js";

const system = (role, spicy) => MANGO_PROMPT.replace("{style}", spicy ? MANGO_STYLE.spicy : MANGO_STYLE.mild).replace("{role}", role);

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

export const onRequestGet = ({ env }) => json({ enabled: enabled(env), paid: !!env.REMIND });

export async function onRequestPost({ request, env }) {
  if (!enabled(env)) return json({ error: "disabled" }, 503);
  const body = await request.json().catch(() => ({}));
  const user = await checkInitData(body.initData, env.BOT_TOKEN);
  if (!user) return json({ error: "not_telegram" }, 401);
  // ALLOWED_USERS chat free without limits. Everyone else: free messages per day, then Telegram Stars.
  // Without the KV store there is no billing, so only ALLOWED_USERS (or everyone, if it's empty) may chat.
  const vip = isVip(env, user.id), kv = env.REMIND;
  let ai = null;
  if (!vip) {
    if (!kv) { if (!isAllowed(env, user.id)) return json({ error: "not_allowed", userId: user.id }, 403); }
    else {
      ai = await readAi(kv, user.id);
      const q = quota(ai);
      if (!canChat(q)) return json({ error: "payment_required", quota: q }, 402);
    }
  }
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
        max_tokens: 800,
        system: system(role, body.spicy === true),
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
  let q = vip ? quota({}, Date.now(), true) : null;
  if (ai) { spend(ai); await writeAi(kv, user.id, ai); q = quota(ai); }
  const mood = (m) => (MANGO_MOODS.includes(m) ? m : "smug");
  const twist = out.twist && s(out.twist.reply) ? { mood: mood(out.twist.mood), reply: s(out.twist.reply), reply_ru: s(out.twist.reply_ru) } : null;
  return json({ mood: mood(out.mood), reply: s(out.reply), reply_ru: s(out.reply_ru), twist, correction: s(out.correction), better: s(out.better), hint: s(out.hint), quota: q });
}
