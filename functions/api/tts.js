import { checkInitData, isAllowed, rateLimited, json } from "../../lib/tg.js";
import { TEXTS } from "../../lib/texts.js";

/* Neural voices from Google Cloud Text-to-Speech. Enabled only when GOOGLE_TTS_KEY is set. */
const KNOWN = new Set(TEXTS);

export async function onRequestGet({ request, env, waitUntil }) {
  const key = env.GOOGLE_TTS_KEY;
  if (!key) return json({ error: "disabled" }, 404);
  const url = new URL(request.url);
  const q = url.searchParams;
  if (q.get("probe")) return json({ ok: true });

  const text = String(q.get("t") || "").trim();
  if (!text || text.length > 400) return json({ error: "bad_text" }, 400);
  const voices = { f: env.TTS_VOICE_F || "en-US-Neural2-F", m: env.TTS_VOICE_M || "en-US-Neural2-D" };
  const v = voices[q.get("v")] ? q.get("v") : "f";

  // Phrases from the app are cached for everyone; anything else (AI replies, own words) needs a Telegram login.
  const known = KNOWN.has(text);
  const cache = typeof caches !== "undefined" ? caches.default : null;
  const cacheKey = new Request(`${url.origin}/api/tts?v=${v}&t=${encodeURIComponent(text)}`);
  if (known && cache) {
    const hit = await cache.match(cacheKey);
    if (hit) return hit;
  }
  if (!known) {
    const user = await checkInitData(String(q.get("auth") || ""), env.BOT_TOKEN);
    if (!user || !isAllowed(env, user.id)) return json({ error: "not_allowed" }, 403);
    if (rateLimited("tts:" + user.id, 60, 60_000)) return json({ error: "rate_limited" }, 429);
  }

  let r;
  try {
    r = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize?key=" + encodeURIComponent(key), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: "en-US", name: voices[v] },
        audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 },
      }),
    });
  } catch {
    return json({ error: "upstream" }, 502);
  }
  if (!r.ok) {
    console.error("TTS error", r.status, (await r.text().catch(() => "")).slice(0, 300));
    return json({ error: "upstream" }, 502);
  }
  const { audioContent } = await r.json();
  const bytes = Uint8Array.from(atob(audioContent || ""), (c) => c.charCodeAt(0));
  const res = new Response(bytes, {
    headers: {
      "content-type": "audio/mpeg",
      "cache-control": known ? "public, max-age=31536000, immutable" : "private, max-age=3600",
    },
  });
  if (known && cache) {
    const p = cache.put(cacheKey, res.clone());
    if (waitUntil) waitUntil(p); else await p;
  }
  return res;
}
