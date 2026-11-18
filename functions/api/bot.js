import { json, botSecret, tgApi, readUser } from "../../lib/tg.js";
import { PROD_ORIGIN, DEFAULT_HOUR, TEXTS, reminderText, openButton, statsText } from "../../lib/remind.js";

/* Telegram webhook: commands /start /time /stats /test /stop. */
export async function onRequestPost({ request, env }) {
  if (!env.BOT_TOKEN) return json({ error: "disabled" }, 503);
  if (request.headers.get("x-telegram-bot-api-secret-token") !== (await botSecret(env.BOT_TOKEN))) return json({ error: "forbidden" }, 403);
  const upd = await request.json().catch(() => null);
  const m = upd && upd.message;
  if (!m || !m.chat || m.chat.type !== "private" || !m.from) return json({ ok: true });

  const id = m.from.id, kv = env.REMIND;
  const text = String(m.text || "").trim();
  const [rawCmd, arg] = text.split(/\s+/);
  const cmd = (rawCmd || "").split("@")[0].toLowerCase();
  const u = kv ? await readUser(kv, id) : {};
  let reply, save = false;

  if (cmd === "/start") {
    u.started = true; u.on = true; u.name = m.from.first_name || u.name || "";
    if (u.hour == null || u.hour < 0) u.hour = DEFAULT_HOUR;
    save = true;
    reply = `Привет${u.name ? ", " + u.name : ""}! Я Манго — фрукт, который следит за твоим английским.\n\n` +
      `Если в какой-то день ты не позанимаешься, в ${u.hour}:00 я напишу. С юмором. Иногда чёрным.\n\n` +
      `Время меняется в приложении (настройки) или командой /time 20. Выключить — /stop. Пример напоминания — /test.`;
  } else if (cmd === "/stop") {
    u.on = false; save = true;
    reply = "Ладно. Я замолкаю. Но я всё вижу.\n\nВключить обратно — /start.";
  } else if (cmd === "/time") {
    const h = /^\d{1,2}(:00)?$/.test(arg || "") ? parseInt(arg, 10) : NaN;
    if (h >= 0 && h <= 23) {
      u.hour = h; u.on = true; save = true;
      reply = `Договорились: в ${h}:00 по твоему времени — если ты к этому часу ещё не позанималась.`;
    } else reply = "Напиши час числом от 0 до 23, например: /time 19";
  } else if (cmd === "/stats") {
    reply = statsText(u);
  } else if (cmd === "/test") {
    const kinds = Object.keys(TEXTS), seed = Math.floor(Math.random() * 1000);
    reply = "Вот так я пишу, когда ты пропускаешь:\n\n" + reminderText(kinds[seed % kinds.length], { n: 7, d: 3, seed: Math.floor(seed / kinds.length) });
  } else {
    reply = "Я фрукт, свободный текст не понимаю. Зато в приложении есть ИИ — он болтливее. Команды: /stats /time /test /stop";
  }

  if (save && kv) await kv.put("u:" + id, JSON.stringify(u));
  if (save && !kv) reply += "\n\n(Напоминания ещё не подключены на сервере, но скоро будут.)";
  await tgApi(env, "sendMessage", { chat_id: m.chat.id, text: reply, reply_markup: openButton(PROD_ORIGIN) });
  return json({ ok: true });
}
