import { json, botSecret, tgApi } from "../../lib/tg.js";
import { PROD_ORIGIN } from "../../lib/remind.js";

/* Open once after adding BOT_TOKEN: points the bot at this site, sets its commands and the «Учить» button.
   Safe to call by anyone: it can only point the bot at the production address. */
export async function onRequestGet({ request, env }) {
  if (!env.BOT_TOKEN) return json({ error: "Добавь BOT_TOKEN в настройки Cloudflare и перезапусти деплой." }, 503);
  if (new URL(request.url).origin !== PROD_ORIGIN) return json({ error: "Открой эту ссылку на основном адресе: " + PROD_ORIGIN + "/api/setup" }, 400);
  const me = await tgApi(env, "getMe", {});
  if (!me.ok) return json({ error: "Telegram не принял BOT_TOKEN — проверь токен.", detail: me.description }, 400);
  const hook = await tgApi(env, "setWebhook", {
    url: PROD_ORIGIN + "/api/bot", secret_token: await botSecret(env.BOT_TOKEN),
    allowed_updates: ["message", "pre_checkout_query"], drop_pending_updates: true,
  });
  const cmds = await tgApi(env, "setMyCommands", { commands: [
    { command: "start", description: "Включить напоминания" },
    { command: "stats", description: "Моя серия и опыт" },
    { command: "time", description: "Час напоминания, например /time 19" },
    { command: "test", description: "Пример напоминания" },
    { command: "stop", description: "Выключить напоминания" },
    { command: "terms", description: "Условия и оплата" },
    { command: "paysupport", description: "Помощь с оплатой" },
  ] });
  const menu = await tgApi(env, "setChatMenuButton", { menu_button: { type: "web_app", text: "Учить", web_app: { url: PROD_ORIGIN + "/" } } });
  const desc = await tgApi(env, "setMyDescription", { description: "English Daily: карточки слов, грамматика, диалоги и разговор с ИИ. А ещё Манго — фрукт, который напомнит позаниматься. С юмором." });
  return json({
    bot: "@" + me.result.username,
    webhook: hook.ok, commands: cmds.ok, menu_button: menu.ok, description: desc.ok,
    reminders_storage: !!env.REMIND, ai_chat: !!env.ANTHROPIC_API_KEY, stars_payments: !!env.REMIND, allowed_users: env.ALLOWED_USERS ? "задан — им ИИ бесплатно без лимита, первый из списка — админ" : "не задан — некому писать в /paysupport",
  });
}
