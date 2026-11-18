import { json, tgApi } from "../../lib/tg.js";
import { PROD_ORIGIN, due, reminderText, openButton } from "../../lib/remind.js";

/* Called every hour by the english-daily-cron worker. Safe to call by anyone: it runs at most once per hour
   and sends each person at most one reminder per day, at their own hour, only if they haven't studied. */
export async function onRequest({ env }) {
  if (!env.REMIND || !env.BOT_TOKEN) return json({ error: "disabled" }, 503);
  const now = Date.now(), stamp = String(Math.floor(now / 3600000));
  if ((await env.REMIND.get("cron:last")) === stamp) return json({ ok: true, skipped: "already ran this hour" });
  await env.REMIND.put("cron:last", stamp);

  let cursor, checked = 0, sent = 0, off = 0;
  do {
    const page = await env.REMIND.list({ prefix: "u:", cursor });
    cursor = page.list_complete ? null : page.cursor;
    for (const k of page.keys) {
      checked++;
      let u;
      try { u = JSON.parse((await env.REMIND.get(k.name)) || "null"); } catch { continue; }
      const r = due(u, now);
      if (!r) continue;
      const id = k.name.slice(2);
      const text = reminderText(r.kind, { n: u.streak || 0, d: r.missed || 0, seed: r.localDay + Number(id) % 97 });
      const res = await tgApi(env, "sendMessage", { chat_id: id, text, reply_markup: openButton(PROD_ORIGIN) });
      if (res.ok) { u.lastSent = r.localDay; u.nags = (u.nags || 0) + 1; sent++; }
      else if (res.error_code === 403) { u.on = false; off++; } // the person blocked the bot or never pressed /start
      else continue;
      await env.REMIND.put(k.name, JSON.stringify(u));
    }
  } while (cursor);
  return json({ ok: true, checked, sent, off });
}
