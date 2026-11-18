import { checkInitData, json } from "../../lib/tg.js";
import { PRODUCTS, FREE_PER_DAY, isVip, readAi, quota } from "../../lib/stars.js";

/* How many AI messages the person has left, and what can be bought. */
export async function onRequestPost({ request, env }) {
  if (!env.BOT_TOKEN) return json({ error: "disabled" }, 503);
  const b = await request.json().catch(() => ({}));
  const user = await checkInitData(b.initData, env.BOT_TOKEN, 30 * 24 * 3600);
  if (!user) return json({ error: "not_telegram" }, 401);
  const vip = isVip(env, user.id);
  const q = vip || !env.REMIND ? quota({}, Date.now(), vip) : quota(await readAi(env.REMIND, user.id));
  const products = Object.entries(PRODUCTS).map(([id, p]) => ({ id, title: p.title, stars: p.stars, messages: p.messages || null, subscription: !!p.subscription }));
  return json({ quota: q, free_per_day: FREE_PER_DAY, paid: !!env.REMIND, products });
}
