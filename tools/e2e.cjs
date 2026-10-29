// Teste ponta a ponta. Uso: node tools/e2e.cjs   (precisa do Playwright + Chromium)
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.join(__dirname, "..");
const SHOTS = process.env.SHOTS || "";
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png" };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end("nf"); }
  res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log("  ✓ " + name); }
  else { fail++; console.log("  ✗ " + name + (extra !== undefined ? "  -> " + JSON.stringify(extra) : "")); }
}

const VOICES_OK = `
  window.__spoken = [];
  const voices = [
    { lang: "en-US", name: "Samantha", localService: true }, { lang: "en-US", name: "Bubbles", localService: true },
    { lang: "en-GB", name: "Daniel", localService: true },
    { lang: "es-ES", name: "Monica", localService: true }, { lang: "es-MX", name: "Paulina", localService: true },
    { lang: "pt-BR", name: "Luciana", localService: true } ];
  class U { constructor(t) { this.text = t; } }
  const synth = { speaking: false, pending: false, getVoices: () => voices, cancel() {}, addEventListener() {},
    speak(u) { window.__spoken.push({ text: u.text, lang: u.lang, rate: u.rate, voice: u.voice && u.voice.name });
      setTimeout(() => { u.onstart && u.onstart(); u.onend && u.onend(); }, 5); } };
  Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
  window.SpeechSynthesisUtterance = U;`;

async function newPage(browser, init, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    serviceWorkers: opts.sw ? "allow" : "block"
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
  page.on("dialog", (d) => d.accept());
  if (init) await page.addInitScript(init);
  return { ctx, page, errors };
}
const st = (page) => page.evaluate(() => JSON.parse(JSON.stringify(window.MPI.state())));
const shot = async (page, name) => { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + ".png") }); };

// responde o quiz atual; wrongAt = índices de perguntas que devem errar de propósito
async function playQuiz(page, wrongAt = []) {
  const types = new Set();
  for (let guard = 0; guard < 40; guard++) {
    const info = await page.evaluate(() => {
      const Q = window.MPI.quiz();
      if (!Q || Q.result) return null;
      const q = Q.qs[Q.i];
      return { i: Q.i, type: q.type, correct: q.correct, toks: q.toks, bank: q.bank, n: q.options ? q.options.length : 0 };
    });
    if (!info) break;
    types.add(info.type);
    const wrong = wrongAt.includes(info.i);
    if (info.type === "order") {
      const order = wrong ? info.toks.map((_, k) => k).reverse() : info.toks.map((_, k) => k);
      // evita ordem reversa idêntica (frase de 1 palavra não ocorre aqui)
      for (const ti of order) await page.click(`[data-act="order-add"][data-ti="${ti}"]`);
      await page.click('[data-act="order-check"]');
    } else {
      const idx = wrong ? (info.correct + 1) % info.n : info.correct;
      await page.click(`[data-act="opt"][data-i="${idx}"]`);
    }
    const fb = await page.textContent("#fb");
    if (wrong) { if (!/Ainda não foi desta vez/.test(fb)) throw new Error("feedback de erro ausente: " + fb); }
    else if (!/Correto/.test(fb)) throw new Error("feedback de acerto ausente: " + fb);
    await page.click('[data-act="next"]');
  }
  return types;
}

(async () => {
  await new Promise((r) => server.listen(0, r));
  const base = "http://localhost:" + server.address().port + "/";
  const browser = await chromium.launch();

  /* ---------- 1. Fluxo principal em inglês ---------- */
  console.log("\n[1] Início, rotina diária e aula em inglês");
  let { ctx, page, errors } = await newPage(browser, VOICES_OK);
  await page.goto(base);
  check("título da página", (await page.title()) === "Meu Professor de Idiomas");
  check("botão 'Começar a estudar'", await page.locator('text=Começar a estudar').isVisible());
  check("inglês selecionado por padrão", (await page.getAttribute("html", "data-lang")) === "en");
  await shot(page, "01-home-en");

  // alternância de idioma
  await page.click('[data-act="lang"][data-lang="es"]');
  check("alterna para espanhol (cor/atributo)", (await page.getAttribute("html", "data-lang")) === "es");
  check("home mostra Espanhol", /Espanhol/.test(await page.textContent("h1")));
  await shot(page, "02-home-es");
  await page.click('[data-act="lang"][data-lang="en"]');
  check("volta para inglês", /Inglês/.test(await page.textContent("h1")));

  // dia 1: aquecimento pulado, começa pela aula nova
  check("aquecimento indisponível no 1º dia", await page.locator('.step.skip').count() === 1);
  await page.click('[data-act="routine-go"]');
  await page.waitForSelector(".phrase-card");
  check("abre a aula 1 (Olá e tchau)", /Olá e tchau/.test(await page.textContent("h1")));
  check("6 frases + 3 palavras", (await page.locator(".phrase-card").count()) === 9);
  check("mostra pronúncia escrita", await page.locator(".pron", { hasText: "Rê-lôu" }).count() === 1);
  await shot(page, "03-lesson");

  await page.locator('[data-act="speak"]').first().click();
  await page.locator('[data-act="slow"]').first().click();
  const spoken = await page.evaluate(() => window.__spoken);
  check("Ouvir fala 'Hello!' em en-US", spoken[0] && spoken[0].text === "Hello!" && spoken[0].lang === "en-US", spoken[0]);
  check("usa a voz Samantha, não a de efeito 'Bubbles'", spoken[0] && spoken[0].voice === "Samantha", spoken[0]);
  check("Devagar usa velocidade menor", spoken[1] && spoken[1].rate < spoken[0].rate, spoken);

  await page.locator('[data-act="fav"]').first().click();
  check("favorito salvo", Object.keys((await st(page)).favs).length === 1);
  check("estrela marcada", (await page.locator('[data-act="fav"]').first().getAttribute("aria-pressed")) === "true");

  await page.click('[data-act="start-practice"]');
  await page.waitForSelector(".q-prompt, .q-label");
  await shot(page, "04-quiz");
  const types = await playQuiz(page, [1, 4]); // erra 2 de propósito
  check("exercícios variados", types.size >= 4, [...types]);
  await page.waitForSelector(".result-ring");
  const res = await page.textContent(".card");
  check("tela de resultado com pontuação", /corretas/.test(await page.textContent("body")) && /pontos/.test(res), res.slice(0, 80));
  await shot(page, "05-result");
  let s = await st(page);
  const rec = s.lessons["en-ini-cum"];
  check("registra tentativa da aula", rec && rec.tries === 1, rec);
  check("2 erros em 12 => 83% e aula concluída", rec && rec.best === 83 && rec.done === true, rec);
  check("erros ficam registrados para revisão", Object.values(s.items).filter((x) => x.w > 0).length === 2);
  check("lista os erros para revisar", (await page.locator(".phrase-card").count()) >= 1);
  const routineToday = Object.values(s.routine.en)[0];
  check("etapas aula+exercícios marcadas na rotina", routineToday.steps.learn === "done" && routineToday.steps.practice === "done", routineToday);

  // continua rotina: ouvir e repetir
  await page.click('[data-act="routine-go"]');
  await page.waitForSelector(".shadow-card");
  for (let i = 0; i < 6; i++) await page.click('[data-act="repeat-next"]');
  check("etapa 'ouvir e repetir' concluída", /Muito bem/.test(await page.textContent("h1")));
  await page.goto(base + "#/");
  await page.waitForSelector(".steps");
  check("rotina de hoje concluída", /Rotina de hoje concluída/.test(await page.textContent("body")));
  s = await st(page);
  check("dia de estudo contabilizado", Object.keys(s.days).length === 1 && s.points > 0, s.days);

  // persistência
  await page.reload();
  s = await st(page);
  check("progresso persiste após recarregar", s.lessons["en-ini-cum"].done && Object.keys(s.favs).length === 1);

  /* ---------- 2. Revisão e favoritos ---------- */
  console.log("\n[2] Revisar, favoritos, progresso, aulas");
  await page.goto(base + "#/revisar");
  check("tela Revisar lista aula estudada", await page.locator(".lesson-link").count() === 1);
  await page.click('a[href="#/quiz/errors"]');
  await page.waitForSelector(".quiz-top");
  const t2 = await playQuiz(page);
  await page.waitForSelector(".result-ring");
  check("revisão de erros concluída", t2.size >= 1);
  await page.goto(base + "#/quiz/review");
  await page.waitForSelector(".quiz-top");
  await playQuiz(page);
  check("revisão rápida concluída", await page.locator(".result-ring").count() === 1);
  await page.goto(base + "#/favoritos");
  check("favoritos lista o item salvo", await page.locator(".phrase-card").count() === 1);
  await shot(page, "06-favoritos");
  await page.click('[data-act="fav"]');
  check("remover favorito esvazia a lista", await page.locator(".empty").count() === 1);
  await page.goto(base + "#/progresso");
  check("progresso mostra 1 de 42 aulas", /1 de 42 aulas/.test(await page.textContent("body")));
  check("progresso mostra percentual (2%)", /2%/.test(await page.textContent("body")));
  await shot(page, "07-progresso");
  await page.goto(base + "#/aulas");
  check("42 aulas por nível", (await page.locator(".lesson-link").count()) === 42);
  await page.click('[data-act="lessons-view"][data-v="situacao"]');
  check("visão por situação (14 temas)", (await page.locator("h2.h2").count()) === 14);
  await page.click('[data-act="lessons-view"][data-v="trabalho"]');
  check("visão Trabalho (3 temas, 9 aulas)", (await page.locator("h2.h2").count()) === 3 && (await page.locator(".lesson-link").count()) === 9);
  await shot(page, "08-aulas");
  await page.goto(base + "#/guia");
  check("guia de pronúncia abre", /não substitui/.test(await page.textContent("body")));

  /* ---------- 3. Espanhol e ajustes de voz ---------- */
  console.log("\n[3] Espanhol e configurações de voz");
  await page.goto(base + "#/aulas");
  await page.click('[data-act="lessons-view"][data-v="nivel"]');
  await page.click('[data-act="lang"][data-lang="es"]');
  check("aulas em espanhol", /Aulas de Espanhol/.test(await page.textContent("h1")));
  await page.locator(".lesson-link").first().click();
  await page.waitForSelector(".phrase-card");
  check("aula de espanhol com 'Hola'", (await page.locator(".orig", { hasText: "¡Hola!" }).count()) === 1);
  await page.evaluate(() => (window.__spoken.length = 0));
  await page.locator('[data-act="speak"]').first().click();
  let sp = await page.evaluate(() => window.__spoken);
  check("espanhol usa es-ES por padrão", sp[0] && sp[0].lang === "es-ES" && sp[0].text === "¡Hola!", sp[0]);
  await shot(page, "09-lesson-es");
  await page.goto(base + "#/ajustes");
  await page.selectOption("#set-es", "es-MX");
  await page.goto(base + "#/aulas");
  await page.click('[data-act="lessons-view"][data-v="nivel"]');
  await page.locator(".lesson-link").first().click();
  await page.waitForSelector(".phrase-card");
  await page.evaluate(() => (window.__spoken.length = 0));
  await page.locator('[data-act="speak"]').first().click();
  sp = await page.evaluate(() => window.__spoken);
  check("ajuste de sotaque troca para es-MX", sp[0] && sp[0].lang === "es-MX" && sp[0].voice === "Paulina", sp[0]);
  // quiz em espanhol (inclui 'ouvir')
  await page.click('[data-act="start-practice"]');
  await page.waitForSelector(".quiz-top");
  const t3 = await playQuiz(page);
  await page.waitForSelector(".result-ring");
  check("quiz de espanhol concluído", t3.size >= 3, [...t3]);
  s = await st(page);
  check("progresso por idioma separado", s.lessons["es-ini-cum"] && s.lessons["es-ini-cum"].done && s.lessons["en-ini-cum"].done);
  await shot(page, "10-settings");

  /* ---------- 4. Backup / restauração / reset ---------- */
  console.log("\n[4] Backup, restauração e reset");
  await page.goto(base + "#/ajustes");
  await shot(page, "10-settings");
  const backup = await page.inputValue("#backup-text");
  check("backup é JSON válido com progresso", JSON.parse(backup).lessons["en-ini-cum"].done === true);
  await page.click('[data-act="reset"]');
  s = await st(page);
  check("reset zera progresso", Object.keys(s.lessons).length === 0 && s.points === 0);
  await page.fill("#restore-text", backup);
  await page.click('[data-act="restore"]');
  s = await st(page);
  check("restauração devolve o progresso", s.lessons["en-ini-cum"] && s.lessons["en-ini-cum"].done === true);
  await page.fill("#restore-text", "lixo");
  await page.click('[data-act="restore"]');
  check("backup inválido é recusado sem apagar", (await st(page)).lessons["en-ini-cum"].done === true);
  check("sem erros de JavaScript no fluxo", errors.length === 0, errors);
  await ctx.close();

  /* ---------- 5. Dia 2: aquecimento disponível ---------- */
  console.log("\n[5] Segundo dia de estudo (aquecimento disponível, próxima aula)");
  ({ ctx, page, errors } = await newPage(browser, VOICES_OK));
  await page.goto(base);
  await page.evaluate((b) => localStorage.setItem("mpi:v1", b), backup);
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("mpi:v1")); s.routine = { en: {}, es: {} }; s.days = { "2000-01-01": { pts: 10, n: 1 } }; localStorage.setItem("mpi:v1", JSON.stringify(s)); });
  await page.reload();
  check("aquecimento disponível", (await page.locator(".step.skip").count()) === 0);
  check("aula de hoje é a próxima (Agradecer e pedir ajuda)", /Agradecer e pedir ajuda/.test(await page.textContent(".hero")));
  await page.click('[data-act="routine-go"]');
  await page.waitForSelector(".quiz-top");
  check("rotina começa pelo aquecimento (revisão)", /Revisão/.test(await page.textContent("body")));
  await playQuiz(page);
  await page.waitForSelector(".result-ring");
  check("botão continua a rotina na aula nova", /Continuar rotina: Aula nova/.test(await page.textContent("body")));
  check("sem erros de JavaScript", errors.length === 0, errors);
  await ctx.close();

  /* ---------- 6. Sem voz / sem suporte ---------- */
  console.log("\n[6] Voz indisponível (mensagens amigáveis)");
  const NO_VOICE = VOICES_OK.replace(/const voices = \[[\s\S]*?\];/, 'const voices = [{ lang: "pt-BR", name: "Luciana", localService: true }];');
  ({ ctx, page, errors } = await newPage(browser, NO_VOICE));
  await page.goto(base + "#/aula/en-ini-cum");
  await page.waitForSelector(".phrase-card");
  await page.locator('[data-act="speak"]').first().click();
  check("avisa quando não há voz de inglês", /Não encontrei uma voz de Inglês/.test(await page.textContent("#toast")));
  check("não tenta falar com voz errada", (await page.evaluate(() => window.__spoken.length)) === 0);
  check("sem erros de JavaScript", errors.length === 0, errors);
  await ctx.close();

  ({ ctx, page, errors } = await newPage(browser, 'delete window.speechSynthesis; delete window.SpeechSynthesisUtterance; Object.defineProperty(window,"speechSynthesis",{value:undefined,configurable:true});'));
  await page.goto(base + "#/aula/en-ini-cum");
  await page.waitForSelector(".phrase-card");
  await page.locator('[data-act="speak"]').first().click();
  check("avisa quando o navegador não tem voz", /não tem voz/.test(await page.textContent("#toast")));
  await page.click('[data-act="start-practice"]');
  await page.waitForSelector(".quiz-top");
  const t4 = await playQuiz(page);
  check("exercícios funcionam sem voz (sem 'ouvir')", !t4.has("listen") && t4.size >= 3, [...t4]);
  check("sem erros de JavaScript", errors.length === 0, errors);
  await ctx.close();

  /* ---------- 7. PWA e offline ---------- */
  console.log("\n[7] PWA: manifest, ícones, service worker e uso offline");
  ({ ctx, page, errors } = await newPage(browser, VOICES_OK, { sw: true }));
  await page.goto(base);
  const manifest = await (await page.request.get(base + "manifest.json")).json();
  check("manifest: nome, standalone e start_url", manifest.name === "Meu Professor de Idiomas" && manifest.display === "standalone" && manifest.start_url === "./");
  for (const ic of manifest.icons) check("ícone existe: " + ic.src + " (" + ic.sizes + ")", (await page.request.get(base + ic.src)).ok());
  check("apple-touch-icon existe", (await page.request.get(base + "icons/apple-touch-icon.png")).ok());
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller || true);
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 8000 }).catch(() => {});
  check("service worker controlando a página", await page.evaluate(() => !!navigator.serviceWorker.controller));
  await ctx.setOffline(true);
  await page.reload();
  check("abre offline (sem rede)", /Começar a estudar|Continuar/.test(await page.textContent("body")));
  await page.goto(base + "#/aulas");
  check("navega offline", (await page.locator(".lesson-link").count()) === 42);
  await ctx.setOffline(false);
  await ctx.close();

  await browser.close();
  server.close();
  console.log(`\nResultado: ${pass} verificações OK, ${fail} falha(s)`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("FALHA NO TESTE:", e); process.exit(1); });
