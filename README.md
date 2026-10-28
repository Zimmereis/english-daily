# English Daily — Telegram Mini App

Приложение для изучения английского: карточки слов, грамматика, фразы, диалоги и разговор с ИИ (Claude).

```
public/index.html   — само приложение (одна страница + шрифты)
api/chat.js         — разговор с ИИ через Claude API
api/tts.js          — озвучка нейросетевым голосом (Google Text-to-Speech, по желанию)
api/_lib.js         — проверка подписи Telegram, белый список, лимиты
api/_texts.js       — список фраз приложения (генерируется сборкой)
```

## Запуск (один раз)

### 1. Vercel
1. Зайди на vercel.com → **Sign up with GitHub**.
2. **Add New → Project** → выбери репозиторий `english-daily` → **Import**.
3. Framework Preset: **Other**. Остальное не трогай → **Deploy**.
4. Получишь адрес вида `https://english-daily-xxxx.vercel.app`.

### 2. Бот в Telegram
1. Напиши @BotFather → `/newbot` → придумай имя и username. Он пришлёт **токен** — его никому не отправляй.
2. `/mybots` → твой бот → **Bot Settings → Menu Button → Configure menu button** → отправь адрес из Vercel → название кнопки, например «Учить».
3. По желанию: `/newapp` — даст прямую ссылку вида `t.me/твой_бот/app`.

### 3. Ключи в Vercel
Vercel → проект → **Settings → Environment Variables**:

| Переменная | Значение | Обязательно |
|---|---|---|
| `BOT_TOKEN` | токен от @BotFather | да, для ИИ |
| `ANTHROPIC_API_KEY` | ключ из console.anthropic.com → API Keys | да, для ИИ |
| `ALLOWED_USERS` | твой Telegram ID (узнать у @userinfobot). Несколько — через запятую | очень желательно |
| `GOOGLE_TTS_KEY` | ключ Google Cloud с включённым Text-to-Speech API | нет, для озвучки на Android |
| `CLAUDE_MODEL` | другая модель, по умолчанию `claude-haiku-5-5` | нет |

После добавления ключей: **Deployments → … → Redeploy**, иначе они не подхватятся.

Без `ALLOWED_USERS` ИИ сможет пользоваться любой, кто найдёт бота, и это будет за твой счёт. В Anthropic Console стоит поставить месячный лимит расходов: **Settings → Limits**.

### 4. Озвучка (по желанию)
На iPhone и в Telegram на компьютере работает встроенный голос устройства. В Telegram на Android встроенного голоса обычно нет, и кнопки звука прячутся. Чтобы звук был везде:
1. console.cloud.google.com → создай проект → **APIs & Services → Library → Cloud Text-to-Speech API → Enable** (понадобится привязать карту, но есть бесплатный месячный лимит; все фразы приложения — около 13 тысяч символов, озвучка кэшируется).
2. **Credentials → Create credentials → API key** → в настройках ключа ограничь его только Text-to-Speech API.
3. Добавь ключ в Vercel как `GOOGLE_TTS_KEY` и сделай Redeploy.

## Обновления
Любой коммит в ветку `main` Vercel публикует сам примерно за минуту. Пользователи получают новую версию при следующем открытии приложения — бота и ссылку менять не нужно.

Контент (слова, уроки, диалоги) лежит в `src/content.js`, интерфейс — в `src/app.html`, слой Telegram — в `src/tg.js`. После правок: `python3 src/build.py` — он пересоберёт `public/index.html` и `api/_texts.js` (руками эти два файла не правим).
