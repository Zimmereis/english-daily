/* Telegram Mini App layer: runs after the main app script and patches its globals. */
(function(){
  const tg = window.Telegram && window.Telegram.WebApp;
  const inTG = !!(tg && tg.initData);
  const ver = v => { try { return tg && tg.isVersionAtLeast(v); } catch(e) { return false; } };

  /* ---------- look & feel ---------- */
  function applyTheme(){
    if(!inTG) return;
    document.documentElement.setAttribute("data-theme", tg.colorScheme === "dark" ? "dark" : "light");
    const cs = getComputedStyle(document.documentElement);
    const bg = cs.getPropertyValue("--bg").trim(), surface = cs.getPropertyValue("--surface").trim();
    try { if(ver("6.1")) { tg.setHeaderColor(bg); tg.setBackgroundColor(bg); } } catch(e) {}
    try { if(ver("7.10")) tg.setBottomBarColor(surface); } catch(e) {}
  }
  if(inTG){
    tg.ready(); tg.expand();
    try { if(ver("7.7")) tg.disableVerticalSwipes(); } catch(e) {}
    applyTheme();
    tg.onEvent("themeChanged", applyTheme);
  }

  /* ---------- back button ---------- */
  function nested(){ return TAB !== "today" || !!SES || !!LES || DLG !== null || !!CH || !!CHPICK || !!SHEET; }
  function syncBack(){
    if(!inTG || !ver("6.1")) return;
    try { nested() ? tg.BackButton.show() : tg.BackButton.hide(); } catch(e) {}
  }
  if(inTG && ver("6.1")){
    tg.BackButton.onClick(() => { window.__back(); syncBack(); });
    new MutationObserver(syncBack).observe(document.body, {childList:true, subtree:true});
    syncBack();
  }

  /* ---------- haptics ---------- */
  const haptic = t => { try { if(inTG && ver("6.1")) tg.HapticFeedback.notificationOccurred(t); } catch(e) {} };
  const _grade = grade;
  grade = function(g){ haptic(g === "good" ? "success" : g === "again" ? "error" : "warning"); _grade(g); };
  const _finishQ = finishQ;
  finishQ = function(ok){ haptic(ok ? "success" : "error"); _finishQ(ok); };

  /* ---------- progress in Telegram cloud (syncs phone and desktop) ---------- */
  const CS = inTG && ver("6.9") ? tg.CloudStorage : null;
  const CHUNK = 4000;
  let cloudTimer = null, cloudBusy = false, cloudAgain = false;
  function cloudSave(){
    if(!CS) return;
    if(cloudBusy){ cloudAgain = true; return; }
    cloudBusy = true;
    const json = JSON.stringify(S);
    const parts = [];
    for(let i = 0; i < json.length; i += CHUNK) parts.push(json.slice(i, i + CHUNK));
    let i = 0;
    const done = () => { cloudBusy = false; if(cloudAgain){ cloudAgain = false; cloudSave(); } };
    const next = () => {
      if(i < parts.length){ const k = "st_" + i, v = parts[i]; i++; CS.setItem(k, v, err => err ? done() : next()); }
      else CS.setItem("st_n", String(parts.length), done);
    };
    next();
  }
  const _save = save;
  save = function(){ _save(); if(CS){ clearTimeout(cloudTimer); cloudTimer = setTimeout(cloudSave, 1500); } };
  function cloudLoad(){
    if(!CS) return;
    CS.getItem("st_n", (err, n) => {
      n = parseInt(n, 10);
      if(err || !n){ if(S.updatedAt) cloudSave(); return; }
      const keys = Array.from({length:n}, (_, i) => "st_" + i);
      CS.getItems(keys, (err2, vals) => {
        if(err2 || !vals) return;
        let rs = null;
        try { rs = JSON.parse(keys.map(k => vals[k] || "").join("")); } catch(e) { return; }
        if(rs && (rs.updatedAt || 0) > (S.updatedAt || 0)){
          S = normalize(rs);
          try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {}
          renderAll();
        } else if((S.updatedAt || 0) > ((rs && rs.updatedAt) || 0)) cloudSave();
      });
    });
  }
  cloudLoad();

  /* ---------- audio: device voice, or neural voice from /api/tts ---------- */
  const _speak = speak, _stop = stopSpeech, _seq = speakSeq;
  let SERVER_TTS = false, audioEl = null;
  const KNOWN = new Set(speakableTexts().map(sayText));
  function speakableTexts(){
    const out = [];
    WORDS_RAW.trim().split("\n").forEach(l => { const p = l.split("|"); out.push(p[1]); if(p[4]) out.push(p[4]); });
    PHRASES.forEach(c => c.items.forEach(s => out.push(s.split("|")[0])));
    LESSONS.forEach(L => { L.e.forEach(s => out.push(s.split("|")[0])); L.q.forEach(q => { const f = exFull(q); if(f) out.push(f); }); });
    DIALOGS.forEach(d => d.l.forEach(x => out.push(x[1])));
    return out;
  }
  function ttsUrl(text, voice){
    const t = sayText(text);
    let u = "/api/tts?v=" + voice + "&t=" + encodeURIComponent(t);
    if(!KNOWN.has(t) && inTG) u += "&auth=" + encodeURIComponent(tg.initData);
    return u;
  }
  function playUrl(text, voice){
    return new Promise(res => {
      try {
        const a = new Audio(ttsUrl(text, voice));
        audioEl = a; a.onended = res; a.onerror = res;
        const p = a.play(); if(p && p.catch) p.catch(res);
      } catch(e) { res(); }
    });
  }
  function webVoiceOK(){
    if(window.AndroidTTS) return true; // Android app shell speaks through the phone's own voice
    try { return !!window.speechSynthesis && speechSynthesis.getVoices().some(v => /^en/i.test(v.lang)); } catch(e) { return false; }
  }
  stopSpeech = function(){ if(audioEl){ try { audioEl.pause(); } catch(e) {} audioEl = null; } _stop(); };
  speak = function(text){ if(SERVER_TTS){ stopSpeech(); playUrl(text, "f"); } else _speak(text); };
  speakSeq = function(items, onLine, onDone){
    if(!SERVER_TTS) return _seq(items, onLine, onDone);
    const my = ++playToken; stopSpeech();
    (async () => {
      for(let i = 0; i < items.length; i++){
        if(my !== playToken) return;
        onLine && onLine(i);
        await playUrl(items[i].text, items[i].pitch > 1 ? "f" : "m");
      }
      if(my === playToken){ onLine && onLine(-1); onDone && onDone(); }
    })();
  };
  fetch("/api/tts?probe=1").then(r => { SERVER_TTS = r.ok; }).catch(() => {}).finally(() => {
    setTimeout(() => { if(!SERVER_TTS && !webVoiceOK()) document.documentElement.classList.add("no-audio"); }, 1500);
  });
    

  /* ---------- AI conversation through our server ---------- */
  if(inTG){
    fetch("/api/chat").then(r => r.ok ? r.json() : null).then(info => {
      if(!info || !info.enabled) return;
      SAMPLE = { json: async function(){
        const body = { initData: tg.initData, scenario: SCENARIOS.indexOf(CH.sc), turns: CH.turns.slice(-20), spicy: !!S.spicy };
        let r, data = null;
        try {
          r = await fetch("/api/chat", { method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify(body) });
          data = await r.json().catch(() => null);
        } catch(e) { throw { ru: "Нет связи с сервером. Проверь интернет и отправь ещё раз." }; }
        if(r.ok && data && data.reply){ if(data.quota) setQuota(data.quota); return data; }
        const code = data && data.error;
        if(code === "payment_required"){ if(data.quota) setQuota(data.quota); throw { pay: true, ru: "Бесплатные сообщения на сегодня закончились. Завтра будут новые — или возьми пакет." }; }
        if(code === "not_allowed") throw { fatal: true, ru: "Разговор с ИИ закрыт для этого аккаунта. Твой Telegram ID: " + data.userId + " — его нужно добавить в ALLOWED_USERS в настройках Cloudflare." };
        if(code === "not_telegram") throw { fatal: true, ru: "Не удалось подтвердить вход через Telegram. Закрой и снова открой приложение." };
        if(code === "rate_limited") throw { ru: "Слишком много сообщений подряд. Подожди минуту." };
        if(code === "busy") throw { ru: "Claude сейчас перегружен. Отправь ещё раз через несколько секунд." };
        throw { ru: "Не получилось получить ответ (" + (code || ("HTTP " + (r && r.status))) + (data && data.stop ? ", " + data.stop : "") + "). Нажми «Отправить» ещё раз." };
      }};
      if(TAB === "today") renderToday();
      if(TAB === "dialogs" && !CH && !CHPICK && DLG === null) renderDialogs();
      if(info.paid) refreshQuota();
    }).catch(() => {});
  }

  /* ---------- Mad Mango's own voice (ElevenLabs) for subscribers; device voice for everyone else ---------- */
  let VOICE_ON = false, voiceAudio = null;
  if(inTG) fetch("/api/voice").then(r => r.ok ? r.json() : null).then(d => { VOICE_ON = !!(d && d.enabled); }).catch(() => {});
  /* mangoPrep starts fetching right away (the audio streams, so it plays as ElevenLabs speaks);
     .play() resolves when the line has been said. Used to prepare the twist while the first line plays. */
  window.mangoPrep = function(text, mood){
    const fallback = () => new Promise(res => { speakMixed(text); setTimeout(res, Math.min(6000, 400 + String(text).length * 60)); });
    if(!VOICE_ON || !AIQ || !AIQ.unlimited) return { play: fallback };
    const audio = post("/api/voice", { text, mood }).then(r => r.ok ? r.json() : Promise.reject()).then(d => {
      const a = new Audio(d.url); a.preload = "auto"; try { a.load(); } catch(e) {} return a;
    });
    audio.catch(() => {});
    return { play: () => audio.then(a => new Promise(res => {
      stopSpeech(); if(voiceAudio && voiceAudio !== a){ try { voiceAudio.pause(); } catch(e) {} }
      voiceAudio = a; a.onended = res; a.onerror = res; const p = a.play(); if(p && p.catch) p.catch(res);
    })).catch(fallback) };
  };
  window.mangoSay = (text, mood) => window.mangoPrep(text, mood).play();

  /* ---------- AI messages left + buying more with Telegram Stars ---------- */
  let AIQ = null, PRODUCTS_LIST = [];
  const post = (url, body) => fetch(url, { method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({ initData: tg.initData, ...body }) });
  function setQuota(q){ AIQ = q; const pill = document.getElementById("aiq"); if(pill) pill.outerHTML = window.aiQuotaPill(); }
  function refreshQuota(){
    return post("/api/quota", {}).then(r => r.ok ? r.json() : null).then(d => {
      if(!d || !d.paid) return;
      window.AI_PAID = true; PRODUCTS_LIST = d.products || []; setQuota(d.quota);
      if(TAB === "dialogs" && CHPICK && !CH) renderDialogs();
    }).catch(() => {});
  }
  window.aiQuotaPill = function(){
    if(!AIQ || !window.AI_PAID) return "";
    const txt = AIQ.unlimited ? (AIQ.vip ? "Безлимит" : "Безлимит до " + new Date(AIQ.subUntil).toLocaleDateString("ru-RU", { day:"numeric", month:"short" }))
      : `${AIQ.freeLeft} бесплатно сегодня${AIQ.credits ? ` · ${AIQ.credits} купленных` : ""}`;
    return `<button class="pill t-mango" id="aiq" data-act="paywall">${ic("starf")}${esc(txt)}</button>`;
  };
  function paywallHtml(out){
    const items = PRODUCTS_LIST.map(p => `<button class="task" data-act="buy" data-p="${esc(p.id)}"><span class="tile t-${p.subscription ? "grape" : "mango"}">${ic(p.subscription ? "spark" : "chat")}</span><span class="tx"><b>${esc(p.title)}</b><small>${p.subscription ? "Продлевается каждые 30 дней, отмена в настройках Telegram" : "Не сгорают"}</small></span><span class="price">${ic("starf")}${p.stars}</span></button>`).join("");
    const now = AIQ && AIQ.unlimited ? `<p class="okmsg">Сейчас у тебя безлимит${AIQ.subUntil ? " до " + new Date(AIQ.subUntil).toLocaleDateString("ru-RU") : ""}.</p>` : "";
    return `<div class="hero">${mascot(out ? "sad" : "happy", 88)}<div class="bubble" style="margin-bottom:14px"><b>${out ? "На сегодня всё бесплатное" : "Разговор с ИИ"}</b><span>${out
        ? "Я бы болтал бесплатно, но ИИ ест электричество. Я — нет, я фрукт. Завтра будет ещё 10 бесплатных — или возьми пакет прямо сейчас."
        : "Каждый день 10 сообщений бесплатно. Хочешь больше — пакет или месячный безлимит за звёзды Telegram."}</span></div></div>
      ${now}<div class="plan">${items || `<p class="sub">Загружаю цены…</p>`}</div>
      <p class="sub" style="font-size:13px">Оплата звёздами Telegram. Условия — /terms, помощь с оплатой — /paysupport в чате с ботом.</p>`;
  }
  window.openPaywall = function(out){ openSheet(paywallHtml(out)); if(!PRODUCTS_LIST.length) refreshQuota().then(() => setSheet(paywallHtml(out))); };
  ACT.paywall = () => window.openPaywall(false);
  ACT.buy = async (el) => {
    if(!ver("6.1")) { queueToast(`<span class="medal on t-coral">${ic("close")}</span><div><b>Обнови Telegram</b><small>Эта версия не умеет платить звёздами</small></div>`); return; }
    el.disabled = true;
    try {
      const d = await post("/api/buy", { product: el.dataset.p }).then(r => r.json());
      if(!d.link) throw 0;
      tg.openInvoice(d.link, (status) => {
        el.disabled = false;
        if(status === "paid"){
          closeSheet(); confetti(); sfx("win");
          queueToast(`<span class="medal on t-mango">${ic("starf")}</span><div><b>Спасибо!</b><small>Сообщения уже начисляются</small></div>`);
          let n = 0; const before = JSON.stringify(AIQ);
          const t = setInterval(async () => { n++; await refreshQuota(); if(JSON.stringify(AIQ) !== before || n >= 8){ clearInterval(t); resumeChat(); } }, 1500);
        } else if(status === "failed") {
          queueToast(`<span class="medal on t-coral">${ic("close")}</span><div><b>Оплата не прошла</b><small>Звёзды не списаны, попробуй ещё раз</small></div>`);
        }
      });
    } catch(e) {
      el.disabled = false;
      queueToast(`<span class="medal on t-coral">${ic("close")}</span><div><b>Не получилось открыть оплату</b><small>Попробуй через минуту</small></div>`);
    }
  };
  /* After paying, answer the message that hit the limit. */
  function resumeChat(){
    if(!CH || CH.busy) return;
    const last = CH.view[CH.view.length - 1];
    if(last && last.me && !last.checked && AIQ && (AIQ.unlimited || AIQ.freeLeft > 0 || AIQ.credits > 0)){ CH.err = ""; askTutor(); }
  }

  /* ---------- reminders: tell the bot when you studied (Telegram only) ---------- */
  if(inTG){
    window.REMIND_OK = true;
    const SEEN_KEY = "ed-seen", WA_KEY = "ed-write-asked";
    let seenTimer = null;
    const lastDay = () => S.days.length ? Math.max(...S.days) : null;
    function seen(){
      const body = { day: lastDay(), tz: new Date().getTimezoneOffset(), hour: S.remind, streak: streak().n, xp: S.xp };
      const sig = JSON.stringify(body);
      let prev = null; try { prev = localStorage.getItem(SEEN_KEY); } catch(e) {}
      if(prev === sig) return;
      fetch("/api/seen", { method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({ ...body, initData: tg.initData }) })
        .then(r => { if(r.ok) try { localStorage.setItem(SEEN_KEY, sig); } catch(e) {} }).catch(() => {});
    }
    /* The bot may write first only after /start or this one-time permission. */
    function askWrite(force){
      if(!ver("6.9") || S.remind < 0) return;
      let asked = null; try { asked = localStorage.getItem(WA_KEY); } catch(e) {}
      if(asked && !force) return;
      try { localStorage.setItem(WA_KEY, "1"); } catch(e) {}
      try { tg.requestWriteAccess(() => {}); } catch(e) {}
    }
    const _saveR = save;
    save = function(){ _saveR(); clearTimeout(seenTimer); seenTimer = setTimeout(seen, 2500); };
    const _set = ACT.set;
    ACT.set = function(el){ _set(el); if(el.dataset.k === "remind" && S.remind >= 0) askWrite(true); };
    setTimeout(seen, 3000);
    setTimeout(() => askWrite(false), 6000);
  }

  /* ---------- offline: cache the app after the first visit (network first, so updates arrive at once) ---------- */
  try {
    if("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("/sw.js").catch(() => {});
  } catch(e) {}
})();
