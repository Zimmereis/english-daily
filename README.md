# English Daily — Telegram Mini App

Приложение для изучения английского: карточки слов, грамматика, фразы, диалоги и разговор с ИИ (Claude). Хостинг — Cloudflare Pages (бесплатный тариф).

```
public/             — само приложение: index.html + шрифты (генерируется сборкой)
functions/api/chat.js — разговор с ИИ через Claude API
functions/api/tts.js  — озвучка нейросетевым голосом (Google Text-to-Speech, по желанию)
lib/tg.js           — проверка подписи Telegram, белый список, лимиты
lib/texts.js        — фразы приложения и сценарии ИИ (генерируется сборкой)
src/                — исходники: content.js (слова, уроки, диалоги), app.html (интерфейс), tg.js (слой Telegram), build.py
```

## Запуск (один раз)

### 1. Cloudflare Pages
1. dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git**.
2. Подключи GitHub и выбери репозиторий `english-daily`.
3. Настройки сборки:
   - Framework preset: **None**
   - Build command: *оставь пустым*
   - Build output directory: `public`
4. **Save and Deploy**. Получишь адрес вида `https://english-daily.pages.dev`.

Папку `functions/` Cloudflare подхватывает сам — отдельно ничего включать не нужно.

### 2. Бот в Telegram
1. Напиши @BotFather → `/newbot` → придумай имя и username. Он пришлёт **токен** — никому его не отправляй.
2. `/mybots` → твой бот → **Bot Settings → Menu Button → Configure menu button** → отправь адрес из Cloudflare → название кнопки, например «Учить».
3. По желанию: `/newapp` — даст прямую ссылку вида `t.me/твой_бот/app`.

### 3. Ключи
Cloudflare → проект → **Settings → Variables and Secrets → Add** (тип **Secret** для ключей):

| Переменная | Значение | Обязательно |
|---|---|---|
| `BOT_TOKEN` | токен от @BotFather | да, для ИИ |
| `ANTHROPIC_API_KEY` | ключ из console.anthropic.com → API Keys | да, для ИИ |
| `ALLOWED_USERS` | твой Telegram ID (узнать у @userinfobot). Несколько — через запятую | очень желательно |
| `GOOGLE_TTS_KEY` | ключ Google Cloud с включённым Text-to-Speech API | нет, для озвучки на Android |
| `CLAUDE_MODEL` | другая модель, по умолчанию `claude-haiku-5-5` | нет |

Переменные добавляй для окружения **Production**. После этого: **Deployments → последний деплой → … → Retry deployment**, иначе ключи не подхватятся.

Без `ALLOWED_USERS` ИИ сможет пользоваться любой, кто найдёт бота, и платить будешь ты. В Anthropic Console поставь месячный лимит расходов: **Settings → Limits**.

### 4. Озвучка (по желанию)
На iPhone и в Telegram на компьютере работает встроенный голос устройства. В Telegram на Android встроенного голоса обычно нет, и кнопки звука прячутся. Чтобы звук был везде:
1. console.cloud.google.com → создай проект → **APIs & Services → Library → Cloud Text-to-Speech API → Enable** (нужна карта, но есть бесплатный месячный лимит; все фразы приложения — около 13 тысяч символов, озвучка кэшируется).
2. **Credentials → Create credentials → API key** → в настройках ключа ограничь его только Text-to-Speech API.
3. Добавь ключ в Cloudflare как `GOOGLE_TTS_KEY` и перезапусти деплой.

## Если ИИ не отвечает
- Пишет «Разговор с ИИ закрыт для этого аккаунта» — добавь показанный ID в `ALLOWED_USERS`.
- Просто «Не получилось получить ответ» — открой **Deployments → последний деплой → Functions → Real-time logs** и отправь сообщение ещё раз: там будет ответ Claude API. Частые причины: неверный ключ, нет денег на балансе Console. Если в логе `unsupported_country_region_territory`, включи **Settings → Runtime → Placement → Smart**: тогда сервер будет обращаться к Claude не из ближайшего к тебе дата-центра.

## Обновления
Любой коммит в ветку `main` Cloudflare публикует сам примерно за минуту. Новая версия откроется при следующем запуске приложения — бота и ссылку менять не нужно.

После правок в `src/` запусти `python3 src/build.py` (нужен Node.js) — он пересоберёт `public/index.html` и `lib/texts.js`. Эти два файла руками не правим.
