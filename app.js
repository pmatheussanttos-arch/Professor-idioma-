/* Meu Professor de Idiomas — app estático, sem servidor, sem login.
   Dados em data.js. Progresso salvo em localStorage (neste aparelho). */
(function () {
  "use strict";

  var D = window.MPI_DATA;
  var KEY = "mpi:v1";
  var PASS = 70;            // % mínimo para concluir uma aula
  var $app = document.getElementById("app");

  /* ============================== Utilitários ============================== */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pad(n) { return String(n).padStart(2, "0"); }
  function dateKey(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function norm(s) { return String(s).trim().toLowerCase(); }
  function $(id) { return document.getElementById(id); }

  var ICON = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    vol: '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
    left: '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
  };

  /* ============================== Estado ============================== */
  var storageOk = true;
  function defaults() {
    return {
      v: 1, lang: "en",
      settings: { enVoice: "en-US", esVoice: "es-ES", slowRate: 0.6 },
      lessons: {},   // id -> {best, tries, done, last}
      seen: {},      // id da aula -> true (aula aberta)
      items: {},     // id do item -> {r, w, t} (acertos, erros, último estudo)
      favs: {},      // id do item -> true
      days: {},      // AAAA-MM-DD -> {pts, n}
      routine: { en: {}, es: {} },
      points: 0,
      hintDismissed: false
    };
  }
  function load() {
    var base = defaults();
    try {
      localStorage.setItem(KEY + ":test", "1");
      localStorage.removeItem(KEY + ":test");
    } catch (e) { storageOk = false; }
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && typeof s === "object") {
          var out = Object.assign(base, s);
          out.settings = Object.assign(defaults().settings, s.settings || {});
          out.routine = Object.assign({ en: {}, es: {} }, s.routine || {});
          return out;
        }
      }
    } catch (e) { /* dados corrompidos: começa do zero */ }
    return base;
  }
  var S = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { storageOk = false; }
  }

  /* ============================== Índices do conteúdo ============================== */
  var ALL = {}, LESSON = {}, BY = { en: { pt: {}, o: {} }, es: { pt: {}, o: {} } };
  Object.keys(D.lessons).forEach(function (lang) {
    D.lessons[lang].forEach(function (l) {
      LESSON[l.id] = l;
      l.items.forEach(function (it) {
        ALL[it.id] = it;
        if (!BY[lang].pt[norm(it.p)]) BY[lang].pt[norm(it.p)] = it;
        if (!BY[lang].o[norm(it.o)]) BY[lang].o[norm(it.o)] = it;
      });
    });
  });
  function itemsOf(lang) {
    return [].concat.apply([], D.lessons[lang].map(function (l) { return l.items; }));
  }
  function levelName(k) { return D.LEVELS.filter(function (l) { return l.key === k; })[0].name; }
  function topicOf(k) { return D.TOPICS.filter(function (t) { return t.key === k; })[0]; }
  function langName(l) { return D.LANGS[l].name; }

  /* ============================== Voz (Web Speech API) ============================== */
  var TTS = { supported: false, voices: [], seq: 0, active: null };
  try { TTS.supported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window; } catch (e) { }
  var NOVELTY = /bubbles|bad news|good news|albert|bahh|bells|boing|cellos|deranged|hysterical|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|kathy|ralph/i;

  function refreshVoices() {
    if (!TTS.supported) return;
    try { TTS.voices = window.speechSynthesis.getVoices() || []; } catch (e) { }
  }
  if (TTS.supported) {
    refreshVoices();
    try {
      if (window.speechSynthesis.addEventListener) window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
      else window.speechSynthesis.onvoiceschanged = refreshVoices;
    } catch (e) { }
  }
  function normTag(t) { return String(t || "").toLowerCase().replace("_", "-"); }
  function canonTag(t) {
    var b = String(t || "").replace("_", "-").split("-");
    return b.length > 1 ? b[0].toLowerCase() + "-" + b[1].toUpperCase() : b[0].toLowerCase();
  }
  function voiceTag(lang) { return S.settings[D.LANGS[lang].voiceKey] || D.LANGS[lang].defaultVoice; }
  function findVoice(tag) {
    var t = normTag(tag), prim = t.split("-")[0];
    function rank(v) {
      return (/enhanced|premium|natural/i.test(v.name) ? 2 : 0) + (v.localService ? 1 : 0);
    }
    var good = TTS.voices.filter(function (v) { return !NOVELTY.test(v.name); });
    var exact = good.filter(function (v) { return normTag(v.lang) === t; });
    var same = good.filter(function (v) { return normTag(v.lang).split("-")[0] === prim; });
    var c = exact.length ? exact : same;
    c.sort(function (a, b) { return rank(b) - rank(a); });
    return c[0] || null;
  }

  var toastTimer = null;
  function toast(msg, ms) {
    var el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, ms || 4200);
  }

  function setPlaying(btn, on) {
    if (!btn) return;
    btn.classList.toggle("playing", !!on);
  }
  function stopAudio() {
    TTS.seq++;
    if (TTS.active) { setPlaying(TTS.active, false); TTS.active = null; }
    if (TTS.supported) { try { window.speechSynthesis.cancel(); } catch (e) { } }
  }

  // Fala um texto. Retorna false quando não é possível falar.
  function speak(text, lang, slow, opts) {
    opts = opts || {};
    if (!TTS.supported) {
      if (!opts.silent) toast("Este navegador não tem voz embutida. No iPhone, abra o app pelo Safari.");
      return false;
    }
    refreshVoices();
    var tag = voiceTag(lang);
    var voice = findVoice(tag);
    if (TTS.voices.length && !voice) {
      if (!opts.silent) toast("Não encontrei uma voz de " + langName(lang) + " neste aparelho. No iPhone: Ajustes > Acessibilidade > Conteúdo Falado > Vozes.", 7000);
      return false;
    }
    var synth = window.speechSynthesis;
    var u = new window.SpeechSynthesisUtterance(text);
    u.lang = canonTag(voice ? voice.lang : tag);
    if (voice) u.voice = voice;
    u.rate = slow ? Number(S.settings.slowRate) || 0.6 : 0.95;
    var mySeq = ++TTS.seq;
    if (TTS.active) setPlaying(TTS.active, false);
    TTS.active = opts.btn || null;
    u.onstart = function () { if (mySeq === TTS.seq) setPlaying(opts.btn, true); };
    u.onend = function () {
      setPlaying(opts.btn, false);
      if (mySeq === TTS.seq) { TTS.active = null; if (opts.onend) opts.onend(); }
    };
    u.onerror = function (ev) {
      setPlaying(opts.btn, false);
      var err = ev && ev.error;
      if (err && err !== "canceled" && err !== "interrupted" && !opts.silent) {
        toast("Não consegui tocar o áudio. Confira o volume e o botão lateral de silêncio do iPhone.", 6000);
      }
    };
    function go() { try { synth.speak(u); } catch (e) { } }
    if (synth.speaking || synth.pending) { synth.cancel(); setTimeout(go, 60); } else { go(); }
    return true;
  }
  function speakItem(it, slow, btn, opts) {
    opts = Object.assign({ btn: btn }, opts || {});
    return speak(it.o, it.lang, slow, opts);
  }

  /* ============================== Progresso ============================== */
  function isDone(id) { return !!(S.lessons[id] && S.lessons[id].done); }
  function doneCount(lang) { return D.lessons[lang].filter(function (l) { return isDone(l.id); }).length; }
  function nextLesson(lang) {
    return D.lessons[lang].filter(function (l) { return !isDone(l.id); })[0] || null;
  }
  function logActivity(pts) {
    var k = dateKey();
    var d = S.days[k] || (S.days[k] = { pts: 0, n: 0 });
    d.pts += pts; d.n += 1;
    S.points += pts;
  }
  function streak() {
    var n = 0, d = new Date();
    if (!S.days[dateKey(d)]) d.setDate(d.getDate() - 1);
    while (S.days[dateKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function studiedItems(lang) {
    var ids = {};
    D.lessons[lang].forEach(function (l) {
      if (S.seen[l.id] || isDone(l.id)) l.items.forEach(function (it) { ids[it.id] = true; });
    });
    Object.keys(S.items).forEach(function (id) { if (ALL[id] && ALL[id].lang === lang) ids[id] = true; });
    return Object.keys(ids).map(function (id) { return ALL[id]; });
  }
  function reviewPool(lang) {
    var ids = {};
    studiedItems(lang).forEach(function (it) { ids[it.id] = it; });
    Object.keys(S.favs).forEach(function (id) { if (ALL[id] && ALL[id].lang === lang) ids[id] = ALL[id]; });
    return Object.keys(ids).map(function (id) { return ids[id]; });
  }
  function weakItems(lang) {
    return itemsOf(lang).filter(function (it) { var s = S.items[it.id]; return s && s.w > 0; });
  }
  function favItems(lang) {
    return Object.keys(S.favs).filter(function (id) { return ALL[id] && ALL[id].lang === lang; }).map(function (id) { return ALL[id]; });
  }
  function weightedPick(items, n) {
    var now = Date.now();
    return items.map(function (it) {
      var st = S.items[it.id];
      var w = st ? st.w : 0, r = st ? st.r : 0;
      var age = st && st.t ? (now - st.t) / 86400000 : 3;
      var score = w * 3 + (st ? w / (w + r + 1) : 1.2) + Math.min(age, 10) / 5 + Math.random() * 1.5 + (S.favs[it.id] ? 0.8 : 0);
      return { it: it, score: score };
    }).sort(function (a, b) { return b.score - a.score; }).slice(0, n).map(function (x) { return x.it; });
  }
  function recordResult(it, ok) {
    var st = S.items[it.id] || (S.items[it.id] = { r: 0, w: 0, t: 0 });
    if (ok) st.r++; else st.w++;
    st.t = Date.now();
  }

  /* ============================== Rotina diária (~15 min) ============================== */
  var STEPS = [
    { key: "review", title: "Aquecimento", desc: "Revise o que você já estudou", min: 3 },
    { key: "learn", title: "Aula nova", desc: "Leia e ouça as frases de hoje", min: 5 },
    { key: "practice", title: "Exercícios", desc: "Pratique o que aprendeu", min: 5 },
    { key: "repeat", title: "Ouvir e repetir", desc: "Fale em voz alta", min: 2 }
  ];
  function pickDailyLesson(lang) {
    var n = nextLesson(lang);
    if (n) return n.id;
    return D.lessons[lang].slice().sort(function (a, b) {
      return ((S.lessons[a.id].best || 0) - (S.lessons[b.id].best || 0)) || (a.index - b.index);
    })[0].id;
  }
  function routine(lang) {
    var k = dateKey();
    if (!S.routine[lang] || !S.routine[lang][k]) {
      var r = { lesson: pickDailyLesson(lang), steps: {} };
      if (reviewPool(lang).length < 4) r.steps.review = "skip";
      S.routine[lang] = {};
      S.routine[lang][k] = r;
      save();
    }
    return S.routine[lang][k];
  }
  function stepUrl(key, r) {
    return {
      review: "#/quiz/review?r=1",
      learn: "#/aula/" + r.lesson + "?r=1",
      practice: "#/quiz/lesson/" + r.lesson + "?r=1",
      repeat: "#/repetir/" + r.lesson + "?r=1"
    }[key];
  }
  function nextStep(lang) {
    var r = routine(lang);
    return STEPS.filter(function (s) { return !r.steps[s.key]; })[0] || null;
  }
  function completeStep(lang, key) {
    var r = routine(lang);
    if (r.steps[key] !== "done") { r.steps[key] = "done"; save(); }
  }

  /* ============================== Motor de exercícios ============================== */
  var Q = null;

  function tokensOf(s) { return s.split(" ").filter(Boolean); }
  function strip(w) { return w.replace(/^[¿¡"“('\s]+|[?!.,;:"”)'\s]+$/g, ""); }
  function blankInfo(it) {
    if (!it.b) return null;
    var toks = tokensOf(it.o);
    var idx = -1;
    for (var i = 0; i < toks.length; i++) { if (norm(strip(toks[i])) === norm(it.b)) { idx = i; break; } }
    if (idx < 0) return null;
    var t = toks[idx], core = strip(t), p = t.indexOf(core);
    return { idx: idx, core: core, pre: t.slice(0, p), post: t.slice(p + core.length), toks: toks };
  }
  function eligibleTypes(it) {
    var n = tokensOf(it.o).length, t = ["mc-pt"];
    if (it.kind === "p" && n >= 3 && blankInfo(it)) t.push("fill");
    if (it.kind === "p" && n >= 3 && n <= 9) t.push("order");
    if (TTS.supported) t.push("listen");
    t.push("mc-tgt");
    return t;
  }
  function distractors(it, n, getter) {
    var lesson = LESSON[it.lesson];
    var seenKeys = {};
    seenKeys[norm(getter(it))] = true;
    var out = [];
    function add(arr) {
      shuffle(arr).forEach(function (c) {
        if (out.length >= n) return;
        var v = getter(c);
        if (v == null || seenKeys[norm(v)]) return;
        seenKeys[norm(v)] = true;
        out.push(v);
      });
    }
    var same = function (c) { return c.id !== it.id && c.kind === it.kind; };
    add(lesson.items.filter(same));
    if (out.length < n) add(D.lessons[it.lang].filter(function (l) { return l.level === lesson.level; }).reduce(function (a, l) { return a.concat(l.items.filter(same)); }, []));
    if (out.length < n) add(itemsOf(it.lang).filter(same));
    if (out.length < n) add(itemsOf(it.lang).filter(function (c) { return c.id !== it.id; }));
    return out;
  }
  function matchCase(word, model) {
    if (!word) return word;
    var up = model.charAt(0) !== model.charAt(0).toLowerCase();
    return (up ? word.charAt(0).toUpperCase() : word.charAt(0).toLowerCase()) + word.slice(1);
  }
  function buildQuestion(it, type) {
    var q = { type: type, item: it, answered: false, chosen: null, ok: null };
    if (type === "mc-pt") {
      q.options = shuffle([it.p].concat(distractors(it, 3, function (c) { return c.p; })));
      q.correct = q.options.indexOf(it.p);
    } else if (type === "mc-tgt" || type === "listen") {
      q.options = shuffle([it.o].concat(distractors(it, 3, function (c) { return c.o; })));
      q.correct = q.options.indexOf(it.o);
    } else if (type === "fill") {
      var bi = blankInfo(it);
      var inSentence = {};
      bi.toks.forEach(function (t) { inSentence[norm(strip(t))] = true; });
      var pool = D.lessons[it.lang].reduce(function (a, l) { return a.concat(l.items); }, [])
        .filter(function (c) { return c.id !== it.id && c.kind === "p" && blankInfo(c); });
      var lessonFirst = pool.filter(function (c) { return c.lesson === it.lesson; });
      var ds = [], seenK = {}; seenK[norm(bi.core)] = true;
      shuffle(lessonFirst).concat(shuffle(pool)).forEach(function (c) {
        if (ds.length >= 3) return;
        var w = blankInfo(c).core, k = norm(w);
        if (seenK[k] || inSentence[k]) return;
        seenK[k] = true; ds.push(matchCase(w, bi.core));
      });
      q.options = shuffle([bi.core].concat(ds));
      q.correct = q.options.indexOf(bi.core);
      q.blank = bi;
    } else if (type === "order") {
      var toks = tokensOf(it.o);
      var bank, tries = 0;
      do { bank = shuffle(toks.map(function (_, i) { return i; })); tries++; }
      while (tries < 6 && bank.every(function (v, i) { return v === i; }));
      q.toks = toks; q.bank = bank; q.sel = [];
    }
    return q;
  }
  function makeQuestions(items, count) {
    var pref = ["mc-pt", "fill", "order", "listen", "mc-tgt"];
    var used = {}, qs = [], i = 0, guard = 0;
    if (!items.length) return qs;
    while (qs.length < count && guard++ < count * 12) {
      var it = items[i % items.length]; i++;
      var el = pref.filter(function (t) { return eligibleTypes(it).indexOf(t) >= 0; });
      var u = used[it.id] || (used[it.id] = {});
      var off = (qs.length + i) % el.length, type = null;
      for (var k = 0; k < el.length; k++) {
        var t = el[(off + k) % el.length];
        if (!u[t]) { type = t; break; }
      }
      if (!type) continue;
      u[type] = true;
      qs.push(buildQuestion(it, type));
    }
    // evita a mesma frase em perguntas seguidas
    qs = shuffle(qs);
    for (var a = 1; a < qs.length; a++) {
      if (qs[a].item.id === qs[a - 1].item.id) {
        for (var b = a + 1; b < qs.length; b++) {
          if (qs[b].item.id !== qs[a - 1].item.id && (b + 1 >= qs.length || qs[b].item.id !== qs[b + 1].item.id)) {
            var tmp = qs[a]; qs[a] = qs[b]; qs[b] = tmp; break;
          }
        }
      }
    }
    return qs;
  }

  function startQuiz(mode, arg, isRoutine) {
    var lang = S.lang, items = [], count = 10, title = "", lessonId = null;
    if (mode === "lesson") {
      var les = LESSON[arg];
      if (!les) return false;
      lang = les.lang; lessonId = les.id; items = les.items; count = Math.min(14, Math.max(10, les.items.length + 3)); title = les.title;
      S.seen[les.id] = true;
    } else if (mode === "review") {
      items = weightedPick(reviewPool(lang), isRoutine ? 6 : 8); count = isRoutine ? 6 : 10; title = "Revisão";
    } else if (mode === "errors") {
      items = weightedPick(weakItems(lang), 8); title = "Revisar meus erros";
    } else if (mode === "favs") {
      items = weightedPick(favItems(lang), 8); title = "Praticar favoritos";
    }
    var qs = makeQuestions(items, count);
    if (!qs.length) { Q = null; return false; }
    Q = { mode: mode, lesson: lessonId, lang: lang, title: title, routine: !!isRoutine, qs: qs, i: 0, correct: 0, points: 0, wrong: [], result: null };
    return true;
  }

  function answerChoice(idx) {
    var q = Q.qs[Q.i];
    if (q.answered) return;
    q.answered = true; q.chosen = idx; q.ok = idx === q.correct;
    finishAnswer(q);
  }
  function checkOrder() {
    var q = Q.qs[Q.i];
    if (q.answered || q.sel.length !== q.toks.length) return;
    q.answered = true;
    q.ok = q.sel.map(function (i) { return q.toks[i]; }).join(" ") === q.toks.join(" ");
    finishAnswer(q);
  }
  function finishAnswer(q) {
    recordResult(q.item, q.ok);
    if (q.ok) { Q.correct++; Q.points += 10; }
    else Q.wrong.push(q.item);
    save();
    renderQuiz(true);
    var fb = $("fb");
    if (fb && fb.scrollIntoView) fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  function nextQuestion() {
    if (Q.i + 1 >= Q.qs.length) { finishQuiz(); return; }
    Q.i++;
    renderQuiz(false);
    window.scrollTo(0, 0);
    var q = Q.qs[Q.i];
    if (q.type === "listen") speakItem(q.item, false, null, { silent: true });
  }
  function finishQuiz() {
    var total = Q.qs.length, pct = Math.round(Q.correct / total * 100), bonus = 0, newly = false;
    if (Q.mode === "lesson") {
      var rec = S.lessons[Q.lesson] || (S.lessons[Q.lesson] = { best: 0, tries: 0, done: false });
      rec.tries++; rec.best = Math.max(rec.best, pct); rec.last = dateKey();
      if (pct >= PASS && !rec.done) { rec.done = true; bonus = 20; newly = true; }
      if (routine(Q.lang).lesson === Q.lesson) { completeStep(Q.lang, "learn"); completeStep(Q.lang, "practice"); }
    } else if (Q.mode === "review") {
      completeStep(Q.lang, "review");
    }
    logActivity(Q.points + bonus);
    Q.result = { pct: pct, total: total, bonus: bonus, newly: newly };
    save();
    renderQuiz(false);
    window.scrollTo(0, 0);
  }

  /* ============================== Componentes de tela ============================== */
  function lt(it) { return 'lang="' + it.lang + '"'; }
  function favBtn(it) {
    return '<button class="btn secondary star" data-act="fav" data-id="' + it.id + '" aria-pressed="' + (!!S.favs[it.id]) + '" aria-label="Favoritar">' + ICON.star + "</button>";
  }
  function audioRow(it) {
    return '<div class="audio-row">' +
      '<button class="btn secondary" data-act="speak" data-id="' + it.id + '">' + ICON.vol + " Ouvir</button>" +
      '<button class="btn secondary" data-act="slow" data-id="' + it.id + '">🐢 Devagar</button>' +
      favBtn(it) + "</div>";
  }
  function pronBlock(it) {
    return '<span class="pron"><small>Como falar (aproximado)</small>' + esc(it.r) + "</span>";
  }
  function phraseCard(it) {
    return '<article class="card phrase-card">' +
      '<div class="orig' + (it.kind === "w" ? " word" : "") + '" ' + lt(it) + ">" + esc(it.o) + "</div>" +
      '<div class="pt">' + esc(it.p) + "</div>" + pronBlock(it) +
      (it.n ? '<div class="note">' + esc(it.n) + "</div>" : "") + audioRow(it) + "</article>";
  }
  function bar(pct) { return '<div class="bar" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + pct + '%"></i></div>'; }
  function backLink(href, label) { return '<a class="back" href="' + href + '">' + ICON.left + " " + label + "</a>"; }
  function lessonLink(l, mode) {
    var t = topicOf(l.topic), rec = S.lessons[l.id], nxt = nextLesson(l.lang);
    var badge = "";
    if (rec && rec.done) badge = '<span class="badge ok">✓ ' + rec.best + "%</span>";
    else if (nxt && nxt.id === l.id) badge = '<span class="badge next">Próxima</span>';
    else if (rec && rec.tries) badge = '<span class="badge warn">' + rec.best + "%</span>";
    var sub = mode === "nivel" ? t.name : levelName(l.level);
    return '<a class="lesson-link' + (nxt && nxt.id === l.id ? " next" : "") + '" href="#/aula/' + l.id + '">' +
      '<span class="ico">' + t.icon + "</span>" +
      '<span class="grow"><b>' + esc(l.title) + "</b><small>" + esc(sub) + " · " + l.items.length + " itens</small></span>" + badge + "</a>";
  }

  /* ============================== Telas ============================== */
  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }
  function isStandalone() {
    return !!(navigator.standalone || (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches));
  }
  var DOW = ["D", "S", "T", "Q", "Q", "S", "S"];
  function weekRow() {
    var cells = [], d = new Date();
    d.setDate(d.getDate() - 6);
    for (var i = 0; i < 7; i++) {
      var k = dateKey(d), on = !!S.days[k], today = i === 6;
      cells.push('<div><div class="d' + (on ? " on" : "") + (today ? " today" : "") + '" title="' + k + '">' + (on ? "✓" : "") + "</div>" + DOW[d.getDay()] + "</div>");
      d.setDate(d.getDate() + 1);
    }
    return '<div class="week">' + cells.join("") + "</div>";
  }

  function viewHome() {
    var lang = S.lang, L = D.LANGS[lang], r = routine(lang), lesson = LESSON[r.lesson];
    var doneN = STEPS.filter(function (s) { return r.steps[s.key]; }).length;
    var realDone = STEPS.filter(function (s) { return r.steps[s.key] === "done"; }).length;
    var pct = Math.round(doneN / STEPS.length * 100);
    var next = nextStep(lang);
    var total = D.lessons[lang].length;
    var cta;
    if (next) {
      cta = '<button class="btn primary big" data-act="routine-go">' + (realDone === 0 ? "Começar a estudar" : "Continuar: " + esc(next.title)) + "</button>";
    } else {
      var nl = nextLesson(lang);
      cta = '<div class="notice" style="margin-bottom:12px"><b>Rotina de hoje concluída! 🎉</b>Voltar amanhã é o que mais ajuda a fixar o idioma.</div>' +
        (nl ? '<a class="btn primary big" href="#/aula/' + nl.id + '">Estudar mais: ' + esc(nl.title) + "</a>" : '<a class="btn primary big" href="#/revisar">Revisar tudo</a>');
    }
    var steps = STEPS.map(function (s, i) {
      var st = r.steps[s.key];
      var desc = st === "skip" ? "Disponível a partir da 2ª aula" : s.desc;
      return '<li><button class="step' + (st === "done" ? " done" : "") + (st === "skip" ? " skip" : "") + '" data-act="step" data-key="' + s.key + '"' + (st === "skip" ? " disabled" : "") + ">" +
        '<span class="dot">' + (st === "done" ? ICON.check : i + 1) + "</span>" +
        '<span><b>' + s.title + "</b><small>" + desc + "</small></span>" +
        '<span class="time">~' + s.min + " min</span></button></li>";
    }).join("");
    var hint = "";
    if (isIOS() && !isStandalone() && !S.hintDismissed) {
      hint = '<div class="notice"><b>Instale no seu iPhone</b>No Safari, toque em Compartilhar (quadrado com seta) &rsaquo; <b style="display:inline">Adicionar à Tela de Início</b>. Depois, estude sempre pelo ícone: o progresso do Safari e o do app instalado são separados.' +
        '<div style="margin-top:8px"><button class="btn sm secondary" data-act="dismiss-hint">Entendi</button></div></div>';
    }
    var warn = storageOk ? "" : '<div class="notice"><b>Progresso não pode ser salvo</b>Seu navegador bloqueou o armazenamento (aba privada?). Abra no Safari normal para guardar seu progresso.</div>';
    return '<div class="stack">' +
      '<section class="card hero">' +
      '<div class="eyebrow">Rotina de hoje · ~15 min</div>' +
      '<h1 class="h1">' + L.flag + " " + L.name + "</h1>" +
      '<p class="sub">Aula de hoje: <b>' + esc(lesson.title) + "</b> · " + levelName(lesson.level) + " · " + topicOf(lesson.topic).name + "</p>" +
      '<div style="margin:16px 0 4px">' + bar(pct) + "</div>" +
      '<p class="sub small" style="margin-bottom:16px">' + doneN + " de " + STEPS.length + " etapas</p>" + cta + "</section>" +
      warn + hint +
      '<section><ul class="steps" style="margin-top:0">' + steps + "</ul></section>" +
      '<section class="grid3">' +
      '<div class="stat"><b>🔥 ' + streak() + "</b><span>dias seguidos</span></div>" +
      '<div class="stat"><b>' + Object.keys(S.days).length + "</b><span>dias de estudo</span></div>" +
      '<div class="stat"><b>' + doneCount(lang) + "/" + total + "</b><span>aulas</span></div></section>" +
      '<section class="card flat"><div class="eyebrow" style="margin-bottom:10px">Últimos 7 dias</div>' + weekRow() + "</section>" +
      "</div>";
  }

  var lessonsView = "nivel";
  function viewLessons() {
    var lang = S.lang, html = "";
    html += '<h1 class="h1">Aulas de ' + langName(lang) + "</h1>" +
      '<p class="sub">' + doneCount(lang) + " de " + D.lessons[lang].length + " aulas concluídas</p>" +
      '<div class="seg three" style="margin-top:14px"><button data-act="lessons-view" data-v="nivel" aria-pressed="' + (lessonsView === "nivel") + '">Por nível</button>' +
      '<button data-act="lessons-view" data-v="situacao" aria-pressed="' + (lessonsView === "situacao") + '">Por situação</button>' +
      '<button data-act="lessons-view" data-v="trabalho" aria-pressed="' + (lessonsView === "trabalho") + '">💼 Trabalho</button></div>';
    if (lessonsView === "nivel") {
      D.LEVELS.forEach(function (lv) {
        var ls = D.lessons[lang].filter(function (l) { return l.level === lv.key; });
        var dn = ls.filter(function (l) { return isDone(l.id); }).length;
        html += '<h2 class="h2">' + lv.name + ' <span class="muted small">· ' + dn + "/" + ls.length + "</span></h2>" +
          '<p class="sub small" style="margin:-6px 2px 4px">' + lv.desc + "</p>" +
          ls.map(function (l) { return lessonLink(l, "nivel"); }).join("");
      });
    } else {
      var work = lessonsView === "trabalho";
      if (work) html += '<p class="sub" style="margin-top:14px">Frases para conseguir emprego, entender as tarefas e conversar com colegas e chefes.</p>';
      D.TOPICS.filter(function (tp) { return !work || tp.work; }).forEach(function (tp) {
        var ls = D.lessons[lang].filter(function (l) { return l.topic === tp.key; });
        html += '<h2 class="h2">' + tp.icon + " " + tp.name + "</h2>" + ls.map(function (l) { return lessonLink(l, "situacao"); }).join("");
      });
    }
    return html;
  }

  var seqPlaying = false;
  function viewLesson(id, isRoutine) {
    var l = LESSON[id];
    if (!l) return viewNotFound();
    if (l.lang !== S.lang) { S.lang = l.lang; save(); }
    if (!S.seen[id]) { S.seen[id] = true; save(); }
    var t = topicOf(l.topic), rec = S.lessons[id];
    var ph = l.items.filter(function (i) { return i.kind === "p"; });
    var wd = l.items.filter(function (i) { return i.kind === "w"; });
    return '<div class="stack">' + backLink("#/aulas", "Aulas") +
      '<div><div class="eyebrow">' + levelName(l.level) + " · " + t.icon + " " + t.name + "</div>" +
      '<h1 class="h1">' + esc(l.title) + "</h1>" +
      '<p class="sub">' + ph.length + " frases · " + wd.length + " palavras · ~5 min" + (rec && rec.done ? " · ✓ concluída (" + rec.best + "%)" : "") + "</p></div>" +
      '<div class="grid2"><button class="btn secondary" data-act="speak-all" data-id="' + id + '">' + ICON.vol + ' <span id="seq-label">Ouvir tudo</span></button>' +
      '<a class="btn secondary" href="#/repetir/' + id + '">🗣️ Repetir</a></div>' +
      '<h2 class="h2" style="margin-bottom:0">Frases</h2>' + ph.map(phraseCard).join("") +
      '<h2 class="h2" style="margin-bottom:0">Palavras</h2>' + wd.map(phraseCard).join("") +
      '<button class="btn primary big" data-act="start-practice" data-id="' + id + '" style="margin-top:20px">' + (isRoutine ? "Ir para os exercícios" : "Praticar esta aula") + "</button>" +
      '<p class="sub small" style="text-align:center">Acerte ' + PASS + '% ou mais para concluir a aula.</p></div>';
  }

  function viewQuiz() {
    if (!Q) return '<div class="empty"><div class="big-emoji">🤔</div><p>Ainda não há conteúdo suficiente para este exercício.</p><a class="btn primary" href="#/">Voltar ao início</a></div>';
    if (Q.result) return viewResult();
    var q = Q.qs[Q.i], it = q.item, L = D.LANGS[Q.lang];
    var top = '<div class="quiz-top"><button class="close-btn" data-act="quit-quiz" aria-label="Sair do exercício">' + ICON.close + "</button>" +
      bar(Math.round(Q.i / Q.qs.length * 100)) + '<span class="count">' + (Q.i + 1) + "/" + Q.qs.length + "</span></div>" +
      '<p class="sub small" style="margin:10px 0 0">' + esc(Q.title) + " · " + Q.points + " pontos</p>";
    var body = "";
    function opts(list, isTarget) {
      return '<div class="options">' + list.map(function (o, i) {
        var cls = "opt";
        if (q.answered) { if (i === q.correct) cls += " right"; else if (i === q.chosen) cls += " wrong"; }
        return '<button class="' + cls + '" data-act="opt" data-i="' + i + '"' + (q.answered ? " disabled" : "") + (isTarget ? " lang=\"" + Q.lang + "\"" : "") + ">" + esc(o) + "</button>";
      }).join("") + "</div>";
    }
    function listenBtns() {
      return '<div class="audio-row" style="grid-template-columns:1fr 1fr"><button class="btn secondary" data-act="speak" data-id="' + it.id + '">' + ICON.vol + " Ouvir</button>" +
        '<button class="btn secondary" data-act="slow" data-id="' + it.id + '">🐢 Devagar</button></div>';
    }
    if (q.type === "mc-pt") {
      body = '<div class="q-label">O que significa?</div><div class="q-prompt" ' + lt(it) + ">" + esc(it.o) + "</div>" + listenBtns() + opts(q.options, false);
    } else if (q.type === "mc-tgt") {
      body = '<div class="q-label">Como se diz em ' + L.name + '?</div><div class="q-prompt">' + esc(it.p) + "</div>" + opts(q.options, true);
    } else if (q.type === "listen") {
      body = '<div class="q-label">Ouça e escolha o que você ouviu</div>' + listenBtns() + opts(q.options, true);
    } else if (q.type === "fill") {
      var bi = q.blank, parts = bi.toks.slice();
      var shown = q.answered ? q.options[q.correct] : "_____";
      parts[bi.idx] = bi.pre + '<span class="blank' + (q.answered ? " filled" : "") + '">' + esc(shown) + "</span>" + bi.post;
      var sentence = parts.map(function (p, i) { return i === bi.idx ? p : esc(p); }).join(" ");
      body = '<div class="q-label">Complete a frase</div><div class="q-prompt" ' + lt(it) + ">" + sentence + '</div><div class="q-hint">' + esc(it.p) + "</div>" + opts(q.options, true);
    } else if (q.type === "order") {
      var chosen = q.sel.map(function (bi2, pos) {
        return '<button class="chip" data-act="order-del" data-pos="' + pos + '"' + (q.answered ? " disabled" : "") + ">" + esc(q.toks[bi2]) + "</button>";
      }).join("");
      var bank = q.bank.map(function (ti) {
        var used = q.sel.indexOf(ti) >= 0;
        return '<button class="chip' + (used ? " used" : "") + '" data-act="order-add" data-ti="' + ti + '"' + (used || q.answered ? " disabled" : "") + ">" + esc(q.toks[ti]) + "</button>";
      }).join("");
      body = '<div class="q-label">Monte a frase em ' + L.name + '</div><div class="q-prompt">' + esc(it.p) + "</div>" +
        '<div class="answer-line" lang="' + Q.lang + '" aria-label="Sua resposta">' + chosen + "</div>" +
        '<div class="bank" lang="' + Q.lang + '">' + bank + "</div>" +
        (q.answered ? "" : '<div class="grid2" style="margin-top:16px"><button class="btn secondary" data-act="order-clear"' + (q.sel.length ? "" : " disabled") + '>Limpar</button>' +
          '<button class="btn navy" data-act="order-check"' + (q.sel.length === q.toks.length ? "" : " disabled") + ">Verificar</button></div>");
    }
    return '<div class="stack">' + top + "<div>" + body + "</div>" + (q.answered ? feedbackHtml(q) : "") + "</div>";
  }

  function explain(q) {
    var it = q.item, L = langName(it.lang), by = BY[it.lang], txt = "";
    if (q.ok) return "";
    if (q.type === "mc-pt") {
      var ch = q.options[q.chosen], w = by.pt[norm(ch)];
      txt = (w ? "“" + ch + "” é “" + w.o + "” em " + L + ". " : "") + "“" + it.o + "” significa “" + it.p + "”.";
    } else if (q.type === "mc-tgt" || q.type === "listen") {
      var ch2 = q.options[q.chosen], w2 = by.o[norm(ch2)];
      txt = (q.type === "listen" ? "Você ouviu “" + it.o + "”. " : "") +
        (w2 ? "“" + ch2 + "” significa “" + w2.p + "”. " : "") + "Para dizer “" + it.p + "”, use “" + it.o + "”.";
    } else if (q.type === "fill") {
      txt = "A palavra que completa a frase é “" + q.blank.core + "”. A frase quer dizer “" + it.p + "”.";
    } else if (q.type === "order") {
      var mine = q.sel.map(function (i) { return q.toks[i]; });
      var diff = -1;
      for (var i = 0; i < q.toks.length; i++) { if (mine[i] !== q.toks[i]) { diff = i; break; } }
      txt = "Sua frase: “" + mine.join(" ") + "”. " + (diff >= 0 ? "A palavra " + (diff + 1) + " deveria ser “" + q.toks[diff] + "”." : "");
    }
    return txt;
  }
  function feedbackHtml(q) {
    var it = q.item, last = Q.i + 1 >= Q.qs.length;
    return '<div class="feedback ' + (q.ok ? "ok" : "bad") + '" id="fb">' +
      "<h3>" + (q.ok ? "✅ Correto! +10 pontos" : "❌ Ainda não foi desta vez") + "</h3>" +
      (q.ok ? "" : "<p>" + esc(explain(q)) + "</p>") +
      '<div class="mini"><div class="orig" ' + lt(it) + ">" + esc(it.o) + '</div><div class="pt">' + esc(it.p) + "</div>" + pronBlock(it) +
      (it.n ? '<div class="note">' + esc(it.n) + "</div>" : "") + audioRow(it) + "</div>" +
      '<button class="btn navy" style="margin-top:14px" data-act="next">' + (last ? "Ver resultado" : "Continuar") + "</button></div>";
  }

  function viewResult() {
    var r = Q.result, stars = r.pct >= 90 ? 3 : r.pct >= 70 ? 2 : r.pct >= 40 ? 1 : 0;
    var starTxt = "★★★".slice(0, stars) + "☆☆☆".slice(0, 3 - stars);
    var msg;
    if (Q.mode === "lesson") {
      if (r.newly) msg = "Aula concluída! 🎉 Bônus de +" + r.bonus + " pontos.";
      else if (r.pct >= PASS) msg = "Muito bem! Você revisou esta aula com sucesso.";
      else msg = "Você precisa de " + PASS + "% para concluir a aula. Veja os erros abaixo e tente de novo.";
    } else {
      msg = r.pct >= 70 ? "Ótima revisão! Continue assim." : "Revisar é assim mesmo: os erros de hoje viram acertos amanhã.";
    }
    var uniq = [], seen = {};
    Q.wrong.forEach(function (it) { if (!seen[it.id]) { seen[it.id] = 1; uniq.push(it); } });
    var mistakes = uniq.length ? '<h2 class="h2">Para revisar (' + uniq.length + ")</h2>" + uniq.map(phraseCard).join("") : "";
    var actions = "";
    var lang = Q.lang;
    if (Q.routine) {
      var nx = nextStep(lang);
      actions += nx ? '<button class="btn primary big" data-act="routine-go">Continuar rotina: ' + esc(nx.title) + "</button>" : '<a class="btn primary big" href="#/">Rotina concluída 🎉 Ver início</a>';
    }
    if (Q.mode === "lesson") {
      if (r.pct < PASS) actions += '<a class="btn secondary" href="#/aula/' + Q.lesson + '">Rever a aula</a>';
      actions += '<button class="btn ' + (Q.routine ? "secondary" : "primary big") + '" data-act="retry">Praticar de novo</button>';
      if (!Q.routine && r.pct >= PASS) actions += '<a class="btn secondary" href="#/aulas">Ir para as aulas</a>';
    } else {
      actions += '<button class="btn ' + (Q.routine ? "secondary" : "primary big") + '" data-act="retry">Mais um exercício</button>';
      if (!Q.routine) actions += '<a class="btn secondary" href="#/revisar">Voltar</a>';
    }
    return '<div class="stack"><div class="card" style="text-align:center">' +
      '<div class="eyebrow">' + esc(Q.title) + "</div>" +
      '<div class="result-ring" style="--pct:' + r.pct + '"><span>' + r.pct + "%</span></div>" +
      '<div class="stars" aria-label="' + stars + ' de 3 estrelas">' + starTxt + "</div>" +
      '<p style="margin:8px 0 4px"><b>' + Q.correct + " de " + r.total + " corretas</b> · +" + (Q.points + r.bonus) + " pontos</p>" +
      '<p class="sub">' + msg + "</p></div>" + actions + mistakes + "</div>";
  }

  var SH = null; // "ouvir e repetir"
  function viewRepeat(id, isRoutine) {
    var l = LESSON[id];
    if (!l) return viewNotFound();
    var ph = l.items.filter(function (i) { return i.kind === "p"; });
    if (!SH || SH.id !== id) SH = { id: id, i: 0, routine: !!isRoutine };
    if (SH.done) {
      var nx = SH.routine ? nextStep(l.lang) : null;
      return '<div class="stack"><div class="card" style="text-align:center"><div class="big-emoji" style="font-size:44px">🗣️</div>' +
        '<h1 class="h1">Muito bem!</h1><p class="sub">Você repetiu ' + ph.length + " frases em voz alta. Falar é o que mais acelera a fluência.</p></div>" +
        (nx ? '<button class="btn primary big" data-act="routine-go">Continuar rotina: ' + esc(nx.title) + "</button>" : '<a class="btn primary big" href="#/">Ver início</a>') +
        '<button class="btn secondary" data-act="repeat-restart">Repetir de novo</button></div>';
    }
    var it = ph[SH.i];
    return '<div class="stack"><div class="quiz-top"><button class="close-btn" data-act="quit-quiz" aria-label="Sair">' + ICON.close + "</button>" +
      bar(Math.round(SH.i / ph.length * 100)) + '<span class="count">' + (SH.i + 1) + "/" + ph.length + "</span></div>" +
      '<div class="eyebrow">Ouça, repita em voz alta e compare</div>' +
      '<div class="card shadow-card"><div class="orig" ' + lt(it) + ">" + esc(it.o) + '</div><div class="pt">' + esc(it.p) + "</div>" + pronBlock(it) + audioRow(it) + "</div>" +
      '<div class="grid2"><button class="btn secondary" data-act="repeat-prev"' + (SH.i === 0 ? " disabled" : "") + ">Anterior</button>" +
      '<button class="btn navy" data-act="repeat-next">' + (SH.i + 1 >= ph.length ? "Concluir" : "Repeti ✓ Próxima") + "</button></div></div>";
  }

  function viewReview() {
    var lang = S.lang, pool = reviewPool(lang), weak = weakItems(lang), favs = favItems(lang);
    var studied = D.lessons[lang].filter(function (l) { return S.seen[l.id] || isDone(l.id); });
    if (!pool.length) {
      return '<h1 class="h1">Revisar</h1><div class="empty"><div class="big-emoji">📖</div><p>Quando você estudar a primeira aula, as frases aparecerão aqui para revisão.</p><a class="btn primary" href="#/aulas">Ver aulas</a></div>';
    }
    var vocab = studiedItems(lang);
    return '<div class="stack"><div><h1 class="h1">Revisar</h1><p class="sub">Reveja frases e palavras de ' + langName(lang) + " que você já estudou.</p></div>" +
      '<div class="grid3"><div class="stat"><b>' + vocab.length + "</b><span>estudados</span></div>" +
      '<div class="stat"><b>' + weak.length + "</b><span>com erros</span></div>" +
      '<div class="stat"><b>' + favs.length + "</b><span>favoritos</span></div></div>" +
      '<a class="btn primary big" href="#/quiz/review">Revisão rápida (10 perguntas)</a>' +
      '<div class="grid2"><a class="btn secondary' + (weak.length ? "" : " disabled") + '" ' + (weak.length ? 'href="#/quiz/errors"' : 'aria-disabled="true"') + ">Meus erros</a>" +
      '<a class="btn secondary" ' + (favs.length ? 'href="#/quiz/favs"' : 'aria-disabled="true" style="opacity:.45"') + ">Favoritos</a></div>" +
      '<h2 class="h2">Aulas já estudadas</h2>' + studied.map(function (l) { return lessonLink(l, "nivel"); }).join("") +
      '<details><summary>Lista de tudo que já estudei (' + vocab.length + ")</summary>" +
      vocab.map(function (it) {
        return '<div class="row" style="padding:8px 0;border-top:1px solid var(--line)"><div class="grow"><b ' + lt(it) + ">" + esc(it.o) + '</b><div class="small muted">' + esc(it.p) + '</div></div>' +
          '<button class="btn secondary sm" data-act="speak" data-id="' + it.id + '" aria-label="Ouvir ' + esc(it.o) + '">' + ICON.vol + "</button></div>";
      }).join("") + "</details></div>";
  }

  function viewFavs() {
    var lang = S.lang, favs = favItems(lang), other = favItems(lang === "en" ? "es" : "en").length;
    var html = '<div class="stack"><div><h1 class="h1">Favoritos</h1><p class="sub">Frases e palavras de ' + langName(lang) + " que você marcou com ★.</p></div>";
    if (!favs.length) {
      html += '<div class="empty"><div class="big-emoji">⭐</div><p>Toque na estrela ao lado de qualquer frase para guardá-la aqui.</p>' +
        (other ? '<p class="small">Você tem ' + other + " favorito(s) em " + langName(lang === "en" ? "es" : "en") + ".</p>" : "") +
        '<a class="btn primary" href="#/aulas">Ver aulas</a></div>';
    } else {
      html += '<a class="btn primary big" href="#/quiz/favs">Praticar favoritos</a>' + favs.map(phraseCard).join("");
    }
    return html + "</div>";
  }

  function viewProgress() {
    var lang = S.lang, rows = ["en", "es"].map(function (l) {
      var total = D.lessons[l].length, dn = doneCount(l), pct = Math.round(dn / total * 100);
      return '<div class="card flat"><div class="row between"><b>' + D.LANGS[l].flag + " " + langName(l) + "</b><b>" + pct + "%</b></div>" +
        '<div style="margin:10px 0 6px">' + bar(pct) + '</div><span class="sub small">' + dn + " de " + total + " aulas concluídas</span></div>";
    }).join("");
    var doneL = D.lessons[lang].filter(function (l) { return isDone(l.id); });
    var avg = doneL.length ? Math.round(doneL.reduce(function (a, l) { return a + (S.lessons[l.id].best || 0); }, 0) / doneL.length) : 0;
    var nl = nextLesson(lang);
    return '<div class="stack"><div><h1 class="h1">Meu progresso</h1><p class="sub">Salvo neste aparelho, sem login.</p></div>' + rows +
      '<div class="grid3"><div class="stat"><b>' + Object.keys(S.days).length + "</b><span>dias de estudo</span></div>" +
      '<div class="stat"><b>🔥 ' + streak() + "</b><span>dias seguidos</span></div>" +
      '<div class="stat"><b>' + S.points + "</b><span>pontos</span></div>" +
      '<div class="stat"><b>' + studiedItems(lang).length + "</b><span>estudados</span></div>" +
      '<div class="stat"><b>' + favItems(lang).length + "</b><span>favoritos</span></div>" +
      '<div class="stat"><b>' + (doneL.length ? avg + "%" : "–") + "</b><span>média das aulas</span></div></div>" +
      '<section class="card flat"><div class="eyebrow" style="margin-bottom:10px">Últimos 7 dias</div>' + weekRow() + "</section>" +
      (nl ? '<h2 class="h2">Próxima aula</h2>' + lessonLink(nl, "nivel") : "") +
      '<h2 class="h2">Aulas concluídas em ' + langName(lang) + "</h2>" +
      (doneL.length ? doneL.map(function (l) { return lessonLink(l, "nivel"); }).join("") : '<p class="sub">Nenhuma ainda. A primeira está esperando por você!</p>') + "</div>";
  }

  function voiceOptions(list, cur) {
    return list.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === cur ? " selected" : "") + ">" + o[1] + "</option>"; }).join("");
  }
  function viewSettings() {
    var st = S.settings;
    var voiceInfo = TTS.supported ? (TTS.voices.length ? TTS.voices.length + " vozes encontradas neste aparelho." : "As vozes ainda não carregaram (normal na primeira vez).") : "Este navegador não oferece voz embutida.";
    return '<div class="stack">' + backLink("#/", "Início") + '<h1 class="h1">Ajustes</h1>' +
      '<section class="card"><div class="eyebrow">Voz e áudio</div><p class="sub small">' + voiceInfo + "</p>" +
      '<label class="field" for="set-en">Sotaque do inglês</label><select id="set-en" data-set="enVoice">' + voiceOptions([["en-US", "Estados Unidos (en-US)"], ["en-GB", "Reino Unido (en-GB)"]], st.enVoice) + "</select>" +
      '<label class="field" for="set-es">Sotaque do espanhol</label><select id="set-es" data-set="esVoice">' + voiceOptions([["es-ES", "Espanha (es-ES)"], ["es-MX", "México (es-MX)"], ["es-US", "América Latina / EUA (es-US)"]], st.esVoice) + "</select>" +
      '<p class="sub small" style="margin-top:6px">A pronúncia escrita do app usa “s” para o z/c do espanhol (como na América Latina). Com es-ES você ouvirá o “th” da Espanha. Se você pretende falar com latino-americanos, es-MX ou es-US combinam mais.</p>' +
      '<label class="field" for="set-slow">Velocidade do botão “Devagar”</label><select id="set-slow" data-set="slowRate">' + voiceOptions([["0.45", "Muito lenta"], ["0.6", "Lenta"], ["0.75", "Pouco mais lenta"]], String(st.slowRate)) + "</select>" +
      '<div class="grid2" style="margin-top:14px"><button class="btn secondary" data-act="test-voice" data-l="en">' + ICON.vol + " Testar inglês</button><button class=\"btn secondary\" data-act=\"test-voice\" data-l=\"es\">" + ICON.vol + " Testar espanhol</button></div></section>" +
      '<a class="btn secondary" href="#/guia">Guia de pronúncia e limitações</a>' +
      '<section class="card"><div class="eyebrow">Backup do progresso</div>' +
      '<p class="sub small">O progresso fica só neste aparelho. Copie o código abaixo e guarde (por exemplo, nas Notas) para poder restaurar depois.</p>' +
      '<textarea id="backup-text" readonly aria-label="Código de backup"></textarea>' +
      '<div class="grid2" style="margin-top:10px"><button class="btn secondary" data-act="backup-copy">Copiar backup</button></div>' +
      '<label class="field" for="restore-text">Restaurar de um backup</label><textarea id="restore-text" placeholder="Cole aqui o código copiado"></textarea>' +
      '<button class="btn secondary" style="margin-top:10px" data-act="restore">Restaurar progresso</button></section>' +
      '<section class="card"><div class="eyebrow">Zerar tudo</div><p class="sub small">Apaga aulas concluídas, favoritos, dias de estudo e pontos deste aparelho.</p>' +
      '<button class="btn danger" data-act="reset" style="margin-top:10px">Apagar meu progresso</button></section>' +
      '<p class="sub small" style="text-align:center">Meu Professor de Idiomas · versão 1.0</p></div>';
  }

  function viewGuide() {
    return '<div class="stack">' + backLink("#/ajustes", "Ajustes") + '<h1 class="h1">Guia de pronúncia</h1>' +
      '<div class="notice"><b>Importante</b>A “pronúncia escrita” é uma aproximação feita para brasileiros e <b style="display:inline">não substitui</b> a pronúncia nativa. Use sempre o botão Ouvir e imite o áudio.</div>' +
      '<details open><summary>Como ler a pronúncia escrita</summary><ul>' +
      "<li>A sílaba com acento (´ ou ^) é a mais forte: <b>Gud mór-nin</b>.</li>" +
      "<li>Hífens separam sílabas; leia como em português.</li>" +
      "<li><b>â</b> é um “a” bem curto e fraco, quase um “ã” solto: <b>Â têi-bol</b>.</li></ul></details>" +
      '<details><summary>🇺🇸 Inglês</summary><ul>' +
      "<li><b>th</b> (thank, think): língua entre os dentes, só soprando.</li>" +
      "<li><b>dh</b> (the, this, mother): mesma posição da língua, mas com a voz vibrando.</li>" +
      "<li><b>r</b> no início de palavra na escrita aproximada (Rê-lôu = “hello”) representa um sopro leve, o “h” inglês.</li>" +
      "<li><b>ér</b>: o “r” americano é feito com a língua curvada, sem vibrar.</li>" +
      "<li>Terminações como “-ed” e “-s” costumam ser leves; ouça o áudio.</li></ul></details>" +
      '<details><summary>🇪🇸 Espanhol</summary><ul>' +
      "<li>O <b>h</b> é mudo: “hola” soa “ôla”.</li>" +
      "<li><b>rr</b> escrito no meio de palavras como “rrí-re” é o “j/g” espanhol: um “rr” de “carro”, mais áspero e raspado.</li>" +
      "<li><b>ll</b> e <b>y</b> soam como “i” (iá-mo = “llamo”); <b>nh</b> representa o “ñ”.</li>" +
      "<li><b>v</b> soa como “b”.</li>" +
      "<li><b>z</b> e <b>c</b> antes de e/i: na América Latina soam “s”; na Espanha soam “th” (como em “think”). O app escreve “s”.</li>" +
      "<li>As vogais são sempre claras e não “engolidas”: “a, e, i, o, u” soam do mesmo jeito.</li></ul></details>" +
      '<details><summary>Limitações conhecidas no iPhone</summary><ul>' +
      "<li>A voz vem do próprio iPhone. Se faltar uma voz: Ajustes &rsaquo; Acessibilidade &rsaquo; Conteúdo Falado &rsaquo; Vozes (baixe inglês e espanhol).</li>" +
      "<li>Se não ouvir nada, confira volume, o botão lateral de silêncio e toque de novo no botão de áudio (o iOS só libera o som após um toque seu).</li>" +
      "<li>O app não ouve você: ele não avalia sua pronúncia. Compare com o áudio por conta própria.</li>" +
      "<li>O progresso do Safari e o do app instalado na Tela de Início são separados. Escolha um e use sempre o mesmo; faça backup nos Ajustes.</li>" +
      "<li>Limpar dados do Safari pode apagar o progresso.</li></ul></details></div>";
  }

  function viewNotFound() {
    return '<div class="empty"><div class="big-emoji">🧭</div><p>Página não encontrada.</p><a class="btn primary" href="#/">Voltar ao início</a></div>';
  }

  /* ============================== Rotas e chrome ============================== */
  var TABS = [
    ["home", "#/", "Início", ICON.home],
    ["aulas", "#/aulas", "Aulas", ICON.book],
    ["revisar", "#/revisar", "Revisar", ICON.refresh],
    ["favoritos", "#/favoritos", "Favoritos", ICON.star],
    ["progresso", "#/progresso", "Progresso", ICON.chart]
  ];
  function parseHash() {
    var h = location.hash.replace(/^#\/?/, "");
    var bits = h.split("?");
    return { parts: bits[0].split("/").filter(Boolean), q: new URLSearchParams(bits[1] || "") };
  }
  function renderChrome(name) {
    document.documentElement.setAttribute("data-lang", S.lang);
    $("lang-switch").innerHTML = ["en", "es"].map(function (l) {
      return '<button class="lang-btn" data-act="lang" data-lang="' + l + '" aria-pressed="' + (S.lang === l) + '"><span class="flag">' + D.LANGS[l].flag + "</span>" + D.LANGS[l].name + "</button>";
    }).join("");
    var active = name === "aula" ? "aulas" : name;
    $("tabbar").innerHTML = '<div class="tabbar-inner">' + TABS.map(function (t) {
      return '<a class="tab" href="' + t[1] + '"' + (t[0] === active ? ' aria-current="page"' : "") + ">" + t[3] + "<span>" + t[2] + "</span></a>";
    }).join("") + "</div>";
    var focus = name === "quiz" || name === "repetir";
    document.body.classList.toggle("focus", focus);
  }
  function route() {
    var p = parseHash(), name = p.parts[0] || "home", html = "";
    stopAudio(); seqPlaying = false;
    if (name === "aula") html = viewLesson(p.parts[1], p.q.get("r") === "1");
    else if (name === "aulas") html = viewLessons();
    else if (name === "quiz") {
      var ok = startQuiz(p.parts[1], p.parts[2], p.q.get("r") === "1");
      html = viewQuiz();
      if (ok && Q.qs[0].type === "listen") setTimeout(function () { speakItem(Q.qs[0].item, false, null, { silent: true }); }, 50);
    } else if (name === "repetir") {
      if (!SH || SH.id !== p.parts[1] || SH.done) SH = null;
      html = viewRepeat(p.parts[1], p.q.get("r") === "1");
    } else if (name === "revisar") html = viewReview();
    else if (name === "favoritos") html = viewFavs();
    else if (name === "progresso") html = viewProgress();
    else if (name === "ajustes") html = viewSettings();
    else if (name === "guia") html = viewGuide();
    else if (name === "home") html = viewHome();
    else html = viewNotFound();
    $app.innerHTML = html;
    renderChrome(name === "home" || name === "" ? "home" : name);
    if (name === "ajustes") { var bt = $("backup-text"); if (bt) bt.value = JSON.stringify(S); }
    window.scrollTo(0, 0);
  }
  function go(h) {
    if (location.hash === h) route(); else location.hash = h;
  }
  function renderQuiz(keepScroll) {
    var y = window.scrollY;
    $app.innerHTML = viewQuiz();
    if (keepScroll) window.scrollTo(0, y);
  }
  function renderRepeat() {
    $app.innerHTML = viewRepeat(SH.id, SH.routine);
    window.scrollTo(0, 0);
  }

  /* ============================== Ações (cliques) ============================== */
  function updateFavButtons(id) {
    var on = !!S.favs[id];
    Array.prototype.forEach.call(document.querySelectorAll('[data-act="fav"][data-id="' + id + '"]'), function (b) {
      b.setAttribute("aria-pressed", String(on));
    });
  }
  var actions = {
    lang: function (el) {
      var l = el.dataset.lang;
      if (l === S.lang) return;
      S.lang = l; save();
      var name = parseHash().parts[0] || "home";
      if (name === "aula" || name === "quiz" || name === "repetir") go("#/");
      else route();
    },
    speak: function (el) { speakItem(ALL[el.dataset.id], false, el); },
    slow: function (el) { speakItem(ALL[el.dataset.id], true, el); },
    fav: function (el) {
      var id = el.dataset.id;
      if (S.favs[id]) { delete S.favs[id]; toast("Removido dos favoritos", 1800); }
      else { S.favs[id] = true; toast("Salvo nos favoritos ★", 1800); }
      save(); updateFavButtons(id);
      if ((parseHash().parts[0]) === "favoritos") route();
    },
    "speak-all": function (el) {
      var l = LESSON[el.dataset.id], list = l.items.slice(), label = $("seq-label");
      if (seqPlaying) { stopAudio(); seqPlaying = false; label.textContent = "Ouvir tudo"; return; }
      seqPlaying = true; label.textContent = "Parar";
      var i = 0;
      (function nextOne() {
        if (!seqPlaying || i >= list.length) { seqPlaying = false; if (label) label.textContent = "Ouvir tudo"; return; }
        var it = list[i++];
        var ok = speak(it.o, it.lang, false, { onend: function () { setTimeout(nextOne, 500); } });
        if (!ok) { seqPlaying = false; label.textContent = "Ouvir tudo"; }
      })();
    },
    "start-practice": function (el) {
      var id = el.dataset.id, l = LESSON[id];
      if (routine(l.lang).lesson === id) completeStep(l.lang, "learn");
      go("#/quiz/lesson/" + id + (routine(l.lang).lesson === id ? "?r=1" : ""));
    },
    step: function (el) { go(stepUrl(el.dataset.key, routine(S.lang))); },
    "routine-go": function () {
      var nx = nextStep(S.lang);
      if (nx) go(stepUrl(nx.key, routine(S.lang))); else go("#/");
    },
    "dismiss-hint": function () { S.hintDismissed = true; save(); route(); },
    "lessons-view": function (el) { lessonsView = el.dataset.v; route(); },
    opt: function (el) { answerChoice(Number(el.dataset.i)); },
    next: function () { nextQuestion(); },
    "order-add": function (el) {
      var q = Q.qs[Q.i]; if (q.answered) return;
      q.sel.push(Number(el.dataset.ti)); renderQuiz(true);
    },
    "order-del": function (el) {
      var q = Q.qs[Q.i]; if (q.answered) return;
      q.sel.splice(Number(el.dataset.pos), 1); renderQuiz(true);
    },
    "order-clear": function () { var q = Q.qs[Q.i]; q.sel = []; renderQuiz(true); },
    "order-check": function () { checkOrder(); },
    "quit-quiz": function () {
      stopAudio();
      var name = parseHash().parts[0];
      if (name === "repetir") { var id = SH && SH.id; SH = null; go(id ? "#/aula/" + id : "#/"); return; }
      var back = Q && Q.mode === "lesson" ? "#/aula/" + Q.lesson : "#/";
      Q = null; go(back);
    },
    retry: function () {
      var mode = Q.mode, arg = Q.lesson, r = Q.routine;
      if (startQuiz(mode, arg, r)) renderQuiz(false);
      window.scrollTo(0, 0);
    },
    "repeat-next": function () {
      var ph = LESSON[SH.id].items.filter(function (i) { return i.kind === "p"; });
      stopAudio();
      if (SH.i + 1 >= ph.length) {
        SH.done = true;
        var l = LESSON[SH.id];
        if (routine(l.lang).lesson === SH.id) completeStep(l.lang, "repeat");
        logActivity(5); save();
      } else SH.i++;
      renderRepeat();
    },
    "repeat-prev": function () { if (SH.i > 0) { stopAudio(); SH.i--; renderRepeat(); } },
    "repeat-restart": function () { var id = SH.id, r = SH.routine; SH = { id: id, i: 0, routine: r }; renderRepeat(); },
    "test-voice": function (el) {
      var l = el.dataset.l;
      speak(l === "en" ? "Hello! Nice to meet you." : "¡Hola! Mucho gusto.", l, false, { btn: el });
    },
    "backup-copy": function () {
      var ta = $("backup-text"); ta.value = JSON.stringify(S);
      ta.focus(); ta.select(); ta.setSelectionRange(0, ta.value.length);
      var done = function () { toast("Backup copiado! Cole nas Notas para guardar.", 3500); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(done, function () { try { document.execCommand("copy"); done(); } catch (e) { toast("Selecione o texto e toque em Copiar."); } });
      else { try { document.execCommand("copy"); done(); } catch (e) { toast("Selecione o texto e toque em Copiar."); } }
    },
    restore: function () {
      var txt = ($("restore-text").value || "").trim();
      try {
        var obj = JSON.parse(txt);
        if (!obj || typeof obj !== "object" || !obj.lessons || !obj.settings) throw new Error("formato");
        if (!window.confirm("Substituir o progresso atual por este backup?")) return;
        S = Object.assign(defaults(), obj);
        S.settings = Object.assign(defaults().settings, obj.settings);
        S.routine = Object.assign({ en: {}, es: {} }, obj.routine || {});
        save(); toast("Progresso restaurado!"); route();
      } catch (e) { toast("Esse código não parece um backup válido."); }
    },
    reset: function () {
      if (!window.confirm("Apagar todo o progresso deste aparelho? Isso não pode ser desfeito.")) return;
      S = defaults();
      try { localStorage.removeItem(KEY); } catch (e) { }
      save(); toast("Progresso apagado."); route();
    }
  };

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-act]");
    if (!el || el.disabled) return;
    var fn = actions[el.dataset.act];
    if (fn) { e.preventDefault(); fn(el, e); }
  });
  document.addEventListener("change", function (e) {
    var el = e.target.closest("[data-set]");
    if (!el) return;
    var key = el.dataset.set;
    S.settings[key] = key === "slowRate" ? Number(el.value) : el.value;
    save();
  });
  window.addEventListener("hashchange", route);

  /* ============================== Início ============================== */
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("./sw.js").catch(function () { }); });
  }
  // Para testes e depuração
  window.MPI = { state: function () { return S; }, quiz: function () { return Q; }, data: D, go: go, parseHash: parseHash };
  route();
})();
