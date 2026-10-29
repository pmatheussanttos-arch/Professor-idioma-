// Valida o conteúdo das aulas (data.js). Uso: node tools/validate-data.mjs
import fs from "node:fs";
import vm from "node:vm";
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(new URL("../data.js", import.meta.url), "utf8"), ctx);
const D = ctx.window.MPI_DATA;
const strip = (w) => w.replace(/^[¿¡"“('\s]+|[?!.,;:"”)'\s]+$/g, "");
const norm = (s) => s.trim().toLowerCase();
let errors = 0, warnings = 0;
const err = (m) => { errors++; console.log("ERRO  " + m); };
const warn = (m) => { warnings++; console.log("AVISO " + m); };

for (const lang of Object.keys(D.lessons)) {
  const lessons = D.lessons[lang];
  const expected = D.LEVELS.length * D.TOPICS.length;
  if (lessons.length !== expected) err(`${lang}: ${lessons.length} aulas, esperado ${expected}`);
  const ids = new Set(), seenO = new Map(), seenP = new Map();
  let nPhrases = 0, nWords = 0, nFill = 0, nOrder = 0, nNotes = 0;
  for (const l of lessons) {
    if (ids.has(l.id)) err(`id duplicado ${l.id}`);
    ids.add(l.id);
    const ph = l.items.filter((i) => i.kind === "p"), wd = l.items.filter((i) => i.kind === "w");
    if (ph.length !== 6) err(`${l.id}: ${ph.length} frases (esperado 6)`);
    if (wd.length !== (l.topic === "pal" ? 9 : 3)) err(`${l.id}: ${wd.length} palavras (esperado ${l.topic === "pal" ? 9 : 3})`);
    for (const it of l.items) {
      for (const f of ["o", "p", "r"]) if (!it[f] || typeof it[f] !== "string") err(`${it.id}: campo ${f} vazio`);
      const k1 = norm(it.o), k2 = norm(it.p);
      if (seenO.has(k1)) err(`${lang}: original duplicado "${it.o}" (${it.id} e ${seenO.get(k1)})`);
      if (seenP.has(k2)) err(`${lang}: tradução duplicada "${it.p}" (${it.id} e ${seenP.get(k2)})`);
      seenO.set(k1, it.id); seenP.set(k2, it.id);
      const toks = it.o.split(" ").filter(Boolean);
      if (it.kind === "p") {
        nPhrases++;
        if (it.n) nNotes++;
        if (toks.length >= 3 && toks.length <= 9) nOrder++;
        if (it.b) {
          const n = toks.filter((t) => norm(strip(t)) === norm(it.b)).length;
          if (n !== 1) err(`${it.id}: palavra "${it.b}" aparece ${n}x em "${it.o}"`);
          else nFill++;
        } else if (toks.length >= 3) warn(`${it.id}: frase com ${toks.length} palavras sem lacuna`);
        // a pronúncia deve ter o mesmo número de palavras que o original
        const pr = it.r.split(" ").filter(Boolean).length;
        if (pr !== toks.length) warn(`${it.id}: original tem ${toks.length} palavras, pronúncia ${pr} ("${it.o}" / "${it.r}")`);
      } else nWords++;
    }
  }
  console.log(`${lang}: ${lessons.length} aulas · ${nPhrases} frases (${nFill} com lacuna, ${nOrder} para montar, ${nNotes} com nota) · ${nWords} palavras`);
}
console.log(errors ? `\n${errors} erro(s), ${warnings} aviso(s)` : `\nOK: sem erros (${warnings} aviso(s))`);
process.exit(errors ? 1 : 0);
