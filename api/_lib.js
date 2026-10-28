import crypto from "node:crypto";

/**
 * Checks Telegram Mini App initData (https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app).
 * Returns the Telegram user object when the signature is valid, otherwise null.
 */
export function checkInitData(initData, botToken, maxAgeSec = 7 * 24 * 3600) {
  if (!initData || typeof initData !== "string" || !botToken || initData.length > 4096) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");
  const dataCheckString = [...params.entries()]
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join("\n");
  const secret = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const expected = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");
  const a = Buffer.from(expected, "hex"), b = Buffer.from(hash, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
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
export function isAllowed(userId) {
  const list = (process.env.ALLOWED_USERS || "").split(/[\s,]+/).filter(Boolean);
  return list.length === 0 || list.includes(String(userId));
}

/** Best-effort per-user limit (resets when the serverless instance restarts). */
const hits = new Map();
export function rateLimited(key, max, windowMs) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) { hits.set(key, arr); return true; }
  arr.push(now);
  hits.set(key, arr);
  return false;
}
