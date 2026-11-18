/* Paid AI chat with Telegram Stars (currency "XTR").
   Everyone gets FREE_PER_DAY messages a day; after that a pack or a monthly subscription.
   People listed in ALLOWED_USERS chat for free without limits (the first one is the admin). */

export const FREE_PER_DAY = 10;
export const SUB_SECONDS = 30 * 24 * 3600; // Telegram Stars subscriptions renew every 30 days

export const PRODUCTS = {
  p100: { title: "100 сообщений с ИИ", description: "100 реплик в разговоре с ИИ-собеседником English Daily. Не сгорают.", stars: 25, messages: 100 },
  p500: { title: "500 сообщений с ИИ", description: "500 реплик в разговоре с ИИ-собеседником English Daily. Не сгорают.", stars: 100, messages: 500 },
  sub: { title: "Безлимит на месяц", description: "Безлимитный разговор с ИИ-собеседником English Daily. Продлевается каждые 30 дней, отменить можно в настройках Telegram.", stars: 150, subscription: true },
};

const vipList = (env) => String(env.ALLOWED_USERS || "").split(/[\s,]+/).filter(Boolean);
export const isVip = (env, id) => vipList(env).includes(String(id));
export const adminId = (env) => vipList(env)[0] || null;

const utcDay = (now) => Math.floor(now / 86400000);

export async function readAi(kv, id) {
  try { return JSON.parse((await kv.get("ai:" + id)) || "null") || {}; } catch { return {}; }
}
export const writeAi = (kv, id, a) => kv.put("ai:" + id, JSON.stringify(a));

/** What the person can do right now. */
export function quota(a, now = Date.now(), vip = false) {
  if (vip) return { unlimited: true, vip: true };
  const subUntil = a.subUntil || 0;
  if (subUntil > now) return { unlimited: true, subUntil };
  const used = a.freeDay === utcDay(now) ? a.freeUsed || 0 : 0;
  return { freeLeft: Math.max(0, FREE_PER_DAY - used), credits: a.credits || 0 };
}
export const canChat = (q) => q.unlimited || q.freeLeft > 0 || q.credits > 0;

/** Spends one message after a successful AI reply. Mutates and returns the record. */
export function spend(a, now = Date.now()) {
  if ((a.subUntil || 0) > now) return a;
  const d = utcDay(now);
  if (a.freeDay !== d) { a.freeDay = d; a.freeUsed = 0; }
  if ((a.freeUsed || 0) < FREE_PER_DAY) a.freeUsed = (a.freeUsed || 0) + 1;
  else if ((a.credits || 0) > 0) a.credits -= 1;
  return a;
}

/** Applies a successful payment once (idempotent by Telegram's charge id). Returns true if applied. */
export function applyPayment(a, p, now = Date.now()) {
  const product = PRODUCTS[p.product];
  if (!product) return false;
  a.payments = Array.isArray(a.payments) ? a.payments : [];
  if (a.payments.some((x) => x.id === p.chargeId)) return false;
  if (product.subscription) {
    const until = p.expiresAt ? p.expiresAt * 1000 : Math.max(now, a.subUntil || 0) + SUB_SECONDS * 1000;
    a.subUntil = Math.max(a.subUntil || 0, until);
  } else {
    a.credits = (a.credits || 0) + product.messages;
  }
  a.payments.push({ id: p.chargeId, product: p.product, stars: p.stars, at: now });
  a.payments = a.payments.slice(-30);
  return true;
}

/** Undo a payment after a refund. Returns the payment or null. */
export function revokePayment(a, chargeId) {
  const pay = (a.payments || []).find((x) => x.id === chargeId);
  if (!pay || pay.refunded) return null;
  const product = PRODUCTS[pay.product];
  if (product && product.subscription) a.subUntil = 0;
  else if (product) a.credits = Math.max(0, (a.credits || 0) - product.messages);
  pay.refunded = true;
  return pay;
}
