import { checkInitData, isAllowed, rateLimited } from "./_lib.js";
import TEXTS from "./_texts.js";

/* Neural voices from Google Cloud Text-to-Speech. Enabled only when GOOGLE_TTS_KEY is set. */
const KNOWN = new Set(TEXTS);
const VOICES = {
  f: process.env.TTS_VOICE_F || "en-US-Neural2-F",
  m: process.env.TTS_VOICE_M || "en-US-Neural2-D",
};

export default async function handler(req, res) {
  const key = process.env.GOOGLE_TTS_KEY;
  if (!key) return res.status(404).json({ error: "disabled" });
  const q = req.query || {};
  if (q.probe) return res.status(200).json({ ok: true });

  const text = String(q.t || "").trim();
  if (!text || text.length > 400) return res.status(400).json({ error: "bad_text" });
  const voice = VOICES[q.v] ? q.v : "f";

  // Texts from the app are cached for everyone; anything else (AI replies, own words) needs a Telegram login.
  const known = KNOWN.has(text);
  if (!known) {
    const user = checkInitData(String(q.auth || ""), process.env.BOT_TOKEN);
    if (!user || !isAllowed(user.id)) return res.status(403).json({ error: "not_allowed" });
    if (rateLimited("tts:" + user.id, 60, 60_000)) return res.status(429).json({ error: "rate_limited" });
  }

  let r;
  try {
    r = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize?key=" + encodeURIComponent(key), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: "en-US", name: VOICES[voice] },
        audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 },
      }),
    });
  } catch {
    return res.status(502).json({ error: "upstream" });
  }
  if (!r.ok) {
    console.error("TTS error", r.status, (await r.text().catch(() => "")).slice(0, 300));
    return res.status(502).json({ error: "upstream" });
  }
  const { audioContent } = await r.json();
  const buf = Buffer.from(audioContent || "", "base64");
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Cache-Control", known ? "public, max-age=86400, s-maxage=31536000, immutable" : "private, max-age=3600");
  return res.status(200).send(buf);
}
