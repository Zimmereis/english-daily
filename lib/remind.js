/* Reminder logic and texts for the Telegram bot. Mango (Манго) is the app's mascot. */

export const PROD_ORIGIN = "https://english-daily-7f3.pages.dev";
export const DEFAULT_HOUR = 19;
export const DEFAULT_TZ = -180; // getTimezoneOffset() of Moscow; replaced by the app's real value on first visit
const MAX_NAGS = 12; // stop after this many unanswered reminders in a row

function plural(n, a, b, c) {
  n = Math.abs(n) % 100; const n1 = n % 10;
  if (n > 10 && n < 20) return c; if (n1 > 1 && n1 < 5) return b; if (n1 === 1) return a; return c;
}
const days = (n) => `${n} ${plural(n, "день", "дня", "дней")}`;

/* {n} = streak in days, {d} = days missed */
export const TEXTS = {
  risk: [
    "Серия {n} висит на волоске. Я держу этот волосок зубами. У манго нет зубов. Поторопись.",
    "{n} подряд — и всё это сгорит сегодня в полночь. Я уже купил спички. Шучу. Наверное.",
    "Огонёк твоей серии ({n}) еле мерцает. Я дую на него изо всех сил, но я фрукт, у меня нет лёгких.",
    "Звонила твоя серия ({n}). Говорит, чувствует себя брошенной. Я сказал, что ты занята. Я соврал ради тебя, а ты?",
    "Пять минут карточек — и серия {n} живёт. Ноль минут — и я зачитаю над ней прощальную речь. Я её уже написал. Она длинная.",
  ],
  daily: [
    "Английский сам себя не выучит. Я проверял: сидел рядом с учебником три часа. Ничего.",
    "Сегодня ещё ни одного слова. Слова обиделись и сидят в углу. Особенно «actually».",
    "Напоминаю о себе. Я Манго. Я жду. Я медленно темнею.",
    "Пять минут английского — или весь вечер думать, что надо было позаниматься. Выбор за тобой. Я просто фрукт.",
    "Я не говорю, что ты меня бросила. Я просто стою тут один, в вазе, и думаю о смысле жизни.",
  ],
  miss: [
    "{d} без английского. На мне появились пятнышки. Это не веснушки, это гниение.",
    "Твои карточки создали чат «Брошенные» и обсуждают тебя. Слово «tomorrow» особенно ехидничает.",
    "Прошло {d}. Я начал разговаривать с бананом. Он ужасный собеседник. Вернись.",
    "Present Simple спрашивал, где ты. Я ответил ему в Past Simple: «she studied». Давно.",
    "{d} тишины. Мухи вокруг меня начинают что-то подозревать.",
  ],
  gone: [
    "Это Манго. Если ты читаешь это — я ещё не совсем сгнил. Одна карточка, и меня ещё можно спасти.",
    "Мне сказали, ты уехала в отпуск. Без английского. Туда, где все говорят по-английски. Смело.",
    "Я составил завещание: все слова — тебе. Но чтобы вступить в наследство, их придётся выучить.",
    "Говорят, если долго не заниматься английским, он уходит к другим. Видел его вчера с каким-то немцем. Они смеялись.",
    "Прошло {d}. Я перестал считать. Нет, вру, я считаю. {d}.",
  ],
  never: [
    "Ты нажала /start и ни одного слова. Это как купить абонемент в зал и ходить мимо него с пончиком.",
    "Я Манго, и я до сих пор не знаю, как звучит твой английский. Давай хотя бы одну карточку. Мне любопытно, я не осуждаю. Почти.",
    "У меня есть 324 слова, 30 уроков грамматики и ни одной ученицы. Это начинает выглядеть грустно. Для меня.",
  ],
};

/** Decides whether a user gets a reminder at time `now`. Returns {kind, missed, localDay} or null. */
export function due(u, now) {
  if (!u || u.on === false || u.hour == null || u.hour < 0) return null;
  const tz = Number.isInteger(u.tz) ? u.tz : DEFAULT_TZ;
  const local = now - tz * 60000;
  const hour = new Date(local).getUTCHours(), localDay = Math.floor(local / 86400000);
  if (hour !== u.hour || u.lastSent === localDay) return null;
  if ((u.nags || 0) >= MAX_NAGS) return null;
  const missed = u.day == null ? null : localDay - u.day;
  if (missed != null && missed <= 0) return null;          // already studied today
  if (missed == null && localDay % 2) return null;         // never studied: every other day
  if (missed != null && missed >= 7 && missed % 3) return null; // long gone: every third day
  const kind = missed == null ? "never" : missed === 1 ? ((u.streak || 0) >= 2 ? "risk" : "daily") : missed < 7 ? "miss" : "gone";
  return { kind, missed, localDay };
}

export function reminderText(kind, { n = 0, d = 0, seed = 0 } = {}) {
  const pool = TEXTS[kind] || TEXTS.daily;
  const t = pool[Math.abs(seed) % pool.length].replaceAll("{n}", days(n)).replaceAll("{d}", days(d));
  return `${t}\n\n— Мэд Манго 🥭`;
}

export function openButton(origin = PROD_ORIGIN, text = "Открыть English Daily") {
  return { inline_keyboard: [[{ text, web_app: { url: origin + "/" } }]] };
}

export const statsText = (u) => {
  if (!u || u.day == null) return "Пока пусто: ты ещё не занималась в приложении. Открой его кнопкой ниже — я начну считать.";
  return `Серия: ${days(u.streak || 0)}\nОпыт: ${u.xp || 0} XP\nНапоминание: ${u.on === false || u.hour < 0 ? "выключено" : `в ${u.hour}:00, если ты к этому часу ещё не занималась`}`;
};
