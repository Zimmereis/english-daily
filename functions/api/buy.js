import { checkInitData, rateLimited, json, tgApi } from "../../lib/tg.js";
import { PRODUCTS, SUB_SECONDS } from "../../lib/stars.js";

/* Creates a Telegram Stars invoice link; the app opens it with Telegram.WebApp.openInvoice. */
export async function onRequestPost({ request, env }) {
  if (!env.BOT_TOKEN || !env.REMIND) return json({ error: "disabled" }, 503);
  const b = await request.json().catch(() => ({}));
  const user = await checkInitData(b.initData, env.BOT_TOKEN, 30 * 24 * 3600);
  if (!user) return json({ error: "not_telegram" }, 401);
  if (rateLimited("buy:" + user.id, 10, 60_000)) return json({ error: "rate_limited" }, 429);
  const id = String(b.product || ""), p = PRODUCTS[id];
  if (!p) return json({ error: "bad_product" }, 400);
  const r = await tgApi(env, "createInvoiceLink", {
    title: p.title,
    description: p.description,
    payload: JSON.stringify({ u: user.id, p: id }),
    currency: "XTR",
    prices: [{ label: p.title, amount: p.stars }],
    ...(p.subscription ? { subscription_period: SUB_SECONDS } : {}),
  });
  if (!r.ok) { console.error("createInvoiceLink", r.description); return json({ error: "telegram", detail: r.description }, 502); }
  return json({ link: r.result });
}
