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
  function nested(){ return TAB !== "words" || !!SES || !!LES || DLG !== null || !!CH || !!CHPICK; }
  function syncBack(){
    if(!inTG || !ver("6.1")) return;
    try { nested() ? tg.BackButton.show() : tg.BackButton.hide(); } catch(e) {}
  }
  if(inTG && ver("6.1")){
    tg.BackButton.onClick(() => { window.__back(); syncBack(); });
    new MutationObserver(syncBack).observe(document.querySelector(".app"), {childList:true, subtree:true});
    document.querySelectorAll("nav.tabs button").forEach(b => b.addEventListener("click", syncBack));
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
    LESSONS.forEach(L => { L.e.forEach(s => out.push(s.split("|")[0])); L.q.forEach(q => { if(!Array.isArray(q)) out.push(q.b); }); });
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
  const st = document.createElement("style");
  st.textContent = ".no-audio .speak,.no-audio #playAll,.no-audio .msg-actions [data-say]{display:none!important}";
  document.head.appendChild(st);

  /* ---------- AI conversation through our server ---------- */
  if(inTG){
    fetch("/api/chat").then(r => r.ok ? r.json() : null).then(info => {
      if(!info || !info.enabled) return;
      SAMPLE = { json: async function(){
        const body = { initData: tg.initData, scenario: SCENARIOS.indexOf(CH.sc), turns: CH.turns.slice(-20) };
        let r, data = null;
        try {
          r = await fetch("/api/chat", { method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify(body) });
          data = await r.json().catch(() => null);
        } catch(e) { throw { ru: "Нет связи с сервером. Проверь интернет и отправь ещё раз." }; }
        if(r.ok && data && data.reply) return data;
        const code = data && data.error;
        if(code === "not_allowed") throw { fatal: true, ru: "Разговор с ИИ закрыт для этого аккаунта. Твой Telegram ID: " + data.userId + " — добавь его в ALLOWED_USERS в настройках Vercel." };
        if(code === "not_telegram") throw { fatal: true, ru: "Не удалось подтвердить вход через Telegram. Закрой и снова открой приложение." };
        if(code === "rate_limited") throw { ru: "Слишком много сообщений подряд. Подожди минуту." };
        if(code === "busy") throw { ru: "Claude сейчас перегружен. Отправь ещё раз через несколько секунд." };
        throw { ru: "Не получилось получить ответ. Нажми «Отправить» ещё раз." };
      }};
      if(!CH && !CHPICK && DLG === null) renderDialogs();
    }).catch(() => {});
  }
})();
