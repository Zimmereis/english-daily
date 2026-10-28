import { checkInitData, isAllowed, rateLimited } from "./_lib.js";

/* Same order as SCENARIOS in the app (the app sends the index). */
const ROLES = [
  "You are a friendly waiter at a small cafe in a Thai tourist town. The learner is a customer. Start by greeting them and offering the menu.",
  "You are a shop assistant in a clothes shop. The learner is a customer. Start by greeting them and asking if they need help.",
  "You are a friendly local on the street. The learner is lost and will ask you for directions. Start by asking if they need help.",
  "You are a taxi driver. The learner is your passenger. Start by asking where they want to go.",
  "You are a friendly traveller the learner just met at a cafe. Start by saying hello and introducing yourself.",
  "You are a friendly English conversation partner. Start by asking the learner how their day is going.",
];

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
  if (out[out.length - 1].role !== "user") return null; // the learner must speak last
  return out;
}

function parseJson(text) {
  try { return JSON.parse(text); } catch {}
  const a = text.indexOf("{"), b = text.lastIndexOf("}");
  if (a >= 0 && b > a) { try { return JSON.parse(text.slice(a, b + 1)); } catch {} }
  return null;
}

export default async function handler(req, res) {
  const enabled = !!(process.env.ANTHROPIC_API_KEY && process.env.BOT_TOKEN);
  if (req.method === "GET") return res.status(200).json({ enabled });
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  if (!enabled) return res.status(503).json({ error: "disabled" });

  const body = typeof req.body === "string" ? parseJson(req.body) || {} : req.body || {};
  const user = checkInitData(body.initData, process.env.BOT_TOKEN);
  if (!user) return res.status(401).json({ error: "not_telegram" });
  if (!isAllowed(user.id)) return res.status(403).json({ error: "not_allowed", userId: user.id });
  if (rateLimited("chat:" + user.id, 20, 60_000)) return res.status(429).json({ error: "rate_limited" });

  const role = ROLES[Number(body.scenario)];
  if (!role) return res.status(400).json({ error: "bad_scenario" });
  const messages = cleanTurns(body.turns);
  if (!messages) return res.status(400).json({ error: "bad_turns" });

  let r;
  try {
    r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL || "claude-haiku-5-5",
        max_tokens: 700,
        system: system(role),
        messages,
      }),
    });
  } catch {
    return res.status(502).json({ error: "upstream" });
  }
  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    console.error("Anthropic API error", r.status, detail.slice(0, 500));
    return res.status(r.status === 429 || r.status === 529 ? 503 : 502).json({ error: r.status === 429 || r.status === 529 ? "busy" : "upstream" });
  }
  const data = await r.json();
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
  const out = parseJson(text);
  if (!out || !out.reply) return res.status(502).json({ error: "bad_reply" });
  const s = (v) => String(v || "").trim();
  return res.status(200).json({
    reply: s(out.reply), reply_ru: s(out.reply_ru), correction: s(out.correction), better: s(out.better), hint: s(out.hint),
  });
}
