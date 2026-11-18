import { checkInitData, rateLimited, json, readUser } from "../../lib/tg.js";
import { DEFAULT_HOUR } from "../../lib/remind.js";

/* The app reports the last day you studied, your time zone and reminder hour, so the bot knows when to nudge. */
export async function onRequestPost({ request, env }) {
  if (!env.REMIND || !env.BOT_TOKEN) return json({ error: "disabled" }, 503);
  const b = await request.json().catch(() => ({}));
  const user = await checkInitData(b.initData, env.BOT_TOKEN, 30 * 24 * 3600);
  if (!user) return json({ error: "not_telegram" }, 401);
  if (rateLimited("seen:" + user.id, 30, 60_000)) return json({ error: "rate_limited" }, 429);

  const num = (v, lo, hi) => (Number.isInteger(v) && v >= lo && v <= hi ? v : null);
  const u = await readUser(env.REMIND, user.id);
  const day = num(b.day, 0, 1e6), tz = num(b.tz, -840, 720), hour = num(b.hour, -1, 23);
  if (day != null && (u.day == null || day > u.day)) { u.day = day; u.nags = 0; }
  if (tz != null) u.tz = tz;
  // The app's setting wins only when it changes, so /stop in the bot is not undone by the next app visit.
  if (hour != null && hour !== u.appHour) { u.appHour = hour; u.hour = hour; u.on = hour >= 0; }
  const streak = num(b.streak, 0, 1e5), xp = num(b.xp, 0, 1e9);
  if (streak != null) u.streak = streak;
  if (xp != null) u.xp = xp;
  if (u.hour == null) u.hour = DEFAULT_HOUR;
  if (u.on == null) u.on = true;
  u.name = user.first_name || u.name || "";
  await env.REMIND.put("u:" + user.id, JSON.stringify(u));
  return json({ ok: true, started: !!u.started });
}
