import { json, botSecret, tgApi, readUser } from "../../lib/tg.js";
import { PROD_ORIGIN, DEFAULT_HOUR, TEXTS, reminderText, openButton, statsText } from "../../lib/remind.js";
import { PRODUCTS, readAi, writeAi, applyPayment, revokePayment, quota, isVip, adminId } from "../../lib/stars.js";

/* Telegram webhook: commands /start /time /stats /test /stop, Telegram Stars payments, /paysupport /terms. */
export async function onRequestPost({ request, env }) {
  if (!env.BOT_TOKEN) return json({ error: "disabled" }, 503);
  if (request.headers.get("x-telegram-bot-api-secret-token") !== (await botSecret(env.BOT_TOKEN))) return json({ error: "forbidden" }, 403);
  const upd = await request.json().catch(() => null);
  if (upd && upd.pre_checkout_query) return preCheckout(env, upd.pre_checkout_query);
  const m = upd && upd.message;
  if (!m || !m.chat || m.chat.type !== "private" || !m.from) return json({ ok: true });
  if (m.successful_payment) return paid(env, m);

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
    if (kv) reply += "\n" + aiLine(quota(await readAi(kv, id), Date.now(), isVip(env, id)));
  } else if (cmd === "/terms") {
    reply = "Условия English Daily:\n\n• Карточки, уроки, фразы и диалоги — бесплатно.\n• Разговор с ИИ: несколько сообщений в день бесплатно, дальше — пакеты сообщений или месячный безлимит за Telegram Stars.\n• Пакеты не сгорают. Подписка продлевается каждые 30 дней, отменить её можно в настройках Telegram.\n• Если что-то не так с оплатой — /paysupport, разберёмся и при необходимости вернём звёзды.";
  } else if (cmd === "/paysupport") {
    const note = text.slice(rawCmd.length).trim();
    const admin = adminId(env);
    if (!note) reply = "Опиши проблему одним сообщением прямо после команды, например:\n/paysupport оплатила 100 сообщений, а они не начислились";
    else if (!admin) reply = "Поддержка пока не настроена. Попробуй позже.";
    else {
      const a = kv ? await readAi(kv, id) : {};
      const last = (a.payments || []).slice(-3).map((p) => `${p.product} ${p.stars}⭐ ${p.id}`).join("\n") || "нет";
      await tgApi(env, "sendMessage", { chat_id: admin, text: `Обращение по оплате от ${m.from.first_name || ""} (id ${id}):\n${note}\n\nПоследние платежи:\n${last}\n\nВернуть: /refund ${id} <id платежа>` });
      reply = "Передал разработчице. Ответ придёт сюда же. Если нужно вернуть звёзды — вернём.";
    }
  } else if (cmd === "/refund" && String(id) === String(adminId(env))) {
    const [, who, charge] = text.split(/\s+/);
    const a = kv && who ? await readAi(kv, who) : null;
    const pay = a && charge ? revokePayment(a, charge) : null;
    if (!pay) reply = "Формат: /refund <id пользователя> <id платежа>. Платёж не найден или уже возвращён.";
    else {
      const r = await tgApi(env, "refundStarPayment", { user_id: Number(who), telegram_payment_charge_id: charge });
      if (r.ok) { await writeAi(kv, who, a); reply = `Вернула ${pay.stars}⭐ пользователю ${who}.`; await tgApi(env, "sendMessage", { chat_id: who, text: `Звёзды за «${(PRODUCTS[pay.product] || {}).title || pay.product}» вернули. Без обид — Манго 🥭` }); }
      else reply = "Telegram не дал вернуть: " + (r.description || "ошибка");
    }
  } else if (cmd === "/test") {
    const kinds = Object.keys(TEXTS), seed = Math.floor(Math.random() * 1000);
    reply = "Вот так я пишу, когда ты пропускаешь:\n\n" + reminderText(kinds[seed % kinds.length], { n: 7, d: 3, seed: Math.floor(seed / kinds.length) });
  } else {
    reply = "Я фрукт, свободный текст не понимаю. Зато в приложении есть ИИ — он болтливее. Команды: /stats /time /test /stop /terms /paysupport";
  }

  if (save && kv) await kv.put("u:" + id, JSON.stringify(u));
  if (save && !kv) reply += "\n\n(Напоминания ещё не подключены на сервере, но скоро будут.)";
  await tgApi(env, "sendMessage", { chat_id: m.chat.id, text: reply, reply_markup: openButton(PROD_ORIGIN) });
  return json({ ok: true });
}

const aiLine = (q) => q.unlimited ? (q.vip ? "ИИ: безлимит" : `ИИ: безлимит до ${new Date(q.subUntil).toLocaleDateString("ru-RU")}`)
  : `ИИ: ${q.freeLeft} бесплатных сегодня${q.credits ? `, ещё ${q.credits} купленных` : ""}`;

/* Telegram asks to confirm every Stars payment within 10 seconds. */
async function preCheckout(env, q) {
  let ok = false, error_message = "Этот товар больше не продаётся. Обнови приложение.";
  try {
    const p = JSON.parse(q.invoice_payload || "{}"), product = PRODUCTS[p.p];
    ok = !!product && q.currency === "XTR" && q.total_amount === product.stars && String(p.u) === String(q.from.id) && !!env.REMIND;
    if (!env.REMIND) error_message = "Оплата временно недоступна. Попробуй позже.";
  } catch {}
  await tgApi(env, "answerPreCheckoutQuery", ok ? { pre_checkout_query_id: q.id, ok: true } : { pre_checkout_query_id: q.id, ok: false, error_message });
  return json({ ok: true });
}

const THANKS = {
  p100: "Спасибо за звёзды! +100 сообщений с ИИ. Болтай на здоровье — я пока помолчу.",
  p500: "+500 сообщений с ИИ. Это серьёзно. Я горжусь тобой и немного боюсь.",
  sub: "Безлимит на месяц включён. Теперь ИИ твой. Не обижай его.",
};

async function paid(env, m) {
  const sp = m.successful_payment, id = m.from.id;
  let p = {};
  try { p = JSON.parse(sp.invoice_payload || "{}"); } catch {}
  const a = await readAi(env.REMIND, id);
  const applied = applyPayment(a, { product: p.p, chargeId: sp.telegram_payment_charge_id, stars: sp.total_amount, expiresAt: sp.subscription_expiration_date }, Date.now());
  if (applied) await writeAi(env.REMIND, id, a);
  const text = applied ? `${THANKS[p.p] || "Оплата прошла, спасибо!"}\n\n${aiLine(quota(a))}\n\n— Манго 🥭` : "Этот платёж уже учтён.";
  await tgApi(env, "sendMessage", { chat_id: m.chat.id, text, reply_markup: openButton(PROD_ORIGIN, "Вернуться к разговору") });
  return json({ ok: true });
}
