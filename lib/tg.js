/* Shared helpers for Cloudflare Pages Functions (Web Crypto, no Node APIs). */
const enc = new TextEncoder();

async function hmac(keyBytes, message) {
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
}
const hex = (bytes) => [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");

function sameString(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Checks Telegram Mini App initData
 * (https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app).
 * Resolves to the Telegram user object when the signature is valid, otherwise null.
 */
export async function checkInitData(initData, botToken, maxAgeSec = 7 * 24 * 3600) {
  if (!initData || typeof initData !== "string" || !botToken || initData.length > 4096) return null;
  const params = new URLSearchParams(initData);
  const hash = (params.get("hash") || "").toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(hash)) return null;
  params.delete("hash");
  const dataCheckString = [...params.entries()].map(([k, v]) => `${k}=${v}`).sort().join("\n");
  const secret = await hmac(enc.encode("WebAppData"), botToken);
  const expected = hex(await hmac(secret, dataCheckString));
  if (!sameString(expected, hash)) return null;
  const authDate = Number(params.get("auth_date") || 0);
  if (!authDate || Date.now() / 1000 - authDate > maxAgeSec) return null;
  try {
    const user = JSON.parse(params.get("user") || "null");
    return user && user.id ? user : null;
  } catch {
    return null;
  }
}

/** ALLOWED_USERS="123,456" limits AI features to these Telegram IDs. Empty = any Telegram user. */
export function isAllowed(env, userId) {
  const list = String(env.ALLOWED_USERS || "").split(/[\s,]+/).filter(Boolean);
  return list.length === 0 || list.includes(String(userId));
}

/** Best-effort per-user limit, kept in the memory of one server instance. */
const hits = new Map();
export function rateLimited(key, max, windowMs) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) { hits.set(key, arr); return true; }
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5000) hits.clear();
  return false;
}

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });
