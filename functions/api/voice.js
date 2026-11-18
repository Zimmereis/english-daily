import { checkInitData, rateLimited, json } from "../../lib/tg.js";
import { isVip, readAi, quota } from "../../lib/stars.js";

/* Mad Mango's voice via ElevenLabs. Needs ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID.
   Voice costs ElevenLabs credits, so it's for ALLOWED_USERS and subscribers (unlimited plan) only.

   Two steps so the phone can start playing while ElevenLabs is still speaking:
   1. POST {initData, text, mood} checks access and returns a short-lived signed URL;
   2. GET  /api/voice?p=…&s=… streams the audio, so an <audio> element plays it as it arrives. */
const enabled = (env) => !!(env.ELEVENLABS_API_KEY && env.ELEVENLABS_VOICE_ID && env.BOT_TOKEN);
const TTL = 120_000;

/* calmer for sweet moods, wilder for evil ones */
const SETTINGS = {
  angel: { stability: 0.55, style: 0.35 },
  love: { stability: 0.5, style: 0.4 },
  think: { stability: 0.6, style: 0.25 },
  smug: { stability: 0.45, style: 0.55 },
  cry: { stability: 0.3, style: 0.75 },
  shock: { stability: 0.3, style: 0.75 },
  evil: { stability: 0.25, style: 0.85 },
  demon: { stability: 0.2, style: 0.9 },
};

const enc = new TextEncoder();
const b64u = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64u = (s) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
async function sign(env, data) {
  const key = await crypto.subtle.importKey("raw", enc.encode("ed-voice:" + env.BOT_TOKEN), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64u(new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)))).slice(0, 32);
}

export async function onRequestGet({ request, env }) {
  const u = new URL(request.url);
  const p = u.searchParams.get("p"), s = u.searchParams.get("s");
  if (!p) return json({ enabled: enabled(env) });
  if (!enabled(env)) return json({ error: "disabled" }, 503);
  if (!s || s !== (await sign(env, p))) return json({ error: "bad_sig" }, 403);
  let job;
  try { job = JSON.parse(new TextDecoder().decode(fromB64u(p))); } catch { return json({ error: "bad_payload" }, 400); }
  if (!job || typeof job.t !== "string" || !(job.e > Date.now())) return json({ error: "expired" }, 410);
  return speak(env, job.t, job.m);
}

export async function onRequestPost({ request, env }) {
  if (!enabled(env)) return json({ error: "disabled" }, 503);
  const b = await request.json().catch(() => ({}));
  const user = await checkInitData(b.initData, env.BOT_TOKEN, 30 * 24 * 3600);
  if (!user) return json({ error: "not_telegram" }, 401);
  if (!isVip(env, user.id)) {
    const q = env.REMIND ? quota(await readAi(env.REMIND, user.id)) : {};
    if (!q.unlimited) return json({ error: "voice_locked" }, 402);
  }
  if (rateLimited("voice:" + user.id, 30, 60_000)) return json({ error: "rate_limited" }, 429);
  const text = String(b.text || "").trim();
  if (!text || text.length > 400) return json({ error: "bad_text" }, 400);
  const mood = SETTINGS[b.mood] ? b.mood : "";
  const p = b64u(enc.encode(JSON.stringify({ t: text, m: mood, e: Date.now() + TTL })));
  return json({ url: `/api/voice?p=${p}&s=${await sign(env, p)}` });
}

async function speak(env, text, mood) {
  const st = SETTINGS[mood] || { stability: 0.4, style: 0.6 };
  let r;
  try {
    r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(env.ELEVENLABS_VOICE_ID)}/stream?output_format=mp3_44100_64`, {
      method: "POST",
      headers: { "xi-api-key": env.ELEVENLABS_API_KEY, "content-type": "application/json", accept: "audio/mpeg" },
      body: JSON.stringify({
        text,
        model_id: env.ELEVENLABS_MODEL || "eleven_flash_v2_5",
        voice_settings: { stability: st.stability, similarity_boost: 0.8, style: st.style, use_speaker_boost: true },
      }),
    });
  } catch {
    return json({ error: "upstream" }, 502);
  }
  if (!r.ok) {
    console.error("ElevenLabs", r.status, (await r.text().catch(() => "")).slice(0, 300));
    return json({ error: r.status === 401 ? "bad_key" : "upstream" }, 502);
  }
  return new Response(r.body, { headers: { "content-type": "audio/mpeg", "cache-control": "private, max-age=120" } });
}
