# Meu Professor de Idiomas

Aplicativo web (PWA) para aprender **inglês** e **espanhol** do zero com ~15 minutos por dia.
Interface em português, feito para o iPhone, funciona offline e **não precisa de login, servidor ou banco de dados**.

## O que tem

- **84 aulas** (42 por idioma): 3 níveis (iniciante, básico, intermediário) × 14 situações, com foco em **trabalho e vida no país**:
  cumprimentos, pedidos e agradecimentos, palavras essenciais (números, verbos, conectores), apresentações,
  dia a dia no trabalho, emprego e entrevistas, trabalho em escritório, viagens, restaurantes, compras,
  moradia e serviços (banco, contas, documentos), saúde e emergências, lazer e conversas cotidianas.
  A aba **💼 Trabalho** em *Aulas* reúne só as situações de trabalho.
- Cada aula: 6 frases + 3 palavras (9 nas aulas de palavras essenciais), com tradução, **pronúncia escrita aproximada**, dica de uso e áudio
  (botões **Ouvir** e **Devagar**) usando a voz do próprio aparelho (Web Speech API).
- **Rotina diária de ~15 min**: aquecimento (revisão) → aula nova → exercícios → ouvir e repetir.
- **Exercícios**: múltipla escolha (frase → tradução e tradução → frase), ouvir e escolher, completar a frase
  e montar a frase (tradução). Mostra a resposta certa e explica cada erro.
- **Revisão** de frases estudadas, dos seus erros e dos favoritos (★).
- **Progresso**: aulas concluídas (≥ 70% de acertos), dias de estudo, sequência, pontos e percentual por idioma.
- Backup e restauração do progresso (texto) nos Ajustes.

## Como publicar no Vercel (grátis, pelo iPhone)

1. No Safari, abra **vercel.com** e entre com a sua conta (pode ser pelo GitHub).
2. Toque em **Add New… › Project**.
3. Em *Import Git Repository*, escolha este repositório (`meu-professor-de-idiomas`).
   Se ele não aparecer, toque em **Adjust GitHub App Permissions** e libere o repositório.
4. Deixe tudo como está: *Framework Preset* = **Other**, sem *Build Command*, sem *Output Directory*,
   *Root Directory* = `./`. Toque em **Deploy**.
5. Em cerca de 1 minuto você recebe um endereço `https://nome-do-projeto.vercel.app`.

## Como instalar na tela inicial do iPhone

1. Abra o endereço `vercel.app` **no Safari** (precisa ser o Safari).
2. Toque em **Compartilhar** (quadrado com seta para cima) › **Adicionar à Tela de Início** › **Adicionar**.
3. Abra pelo ícone novo e **estude sempre por ele**: o progresso do Safari e o do app instalado são separados.

## Atualizar o app depois

Mudou algum arquivo no GitHub? O Vercel publica sozinho a cada alteração.
Se mudar arquivos do app, aumente o número em `CACHE` no `sw.js` (ex.: `meu-idiomas-v4`)
para que os aparelhos recebam a versão nova.

## Estrutura

```
index.html      página única
styles.css      visual (claro/escuro, mobile-first)
data.js         TODO o conteúdo das aulas (edite aqui para acrescentar frases)
app.js          lógica: rotina, exercícios, voz, progresso
sw.js           service worker (uso offline)
manifest.json   dados de instalação (PWA)
icons/          ícones do app
vercel.json     cabeçalhos para o Vercel
tools/          testes (validate-data.mjs e e2e.cjs) — opcionais
```

### Acrescentar frases

Em `data.js`, cada aula tem 6 frases e 3 palavras (9 em "Palavras essenciais"):

```js
// frase:   [original, português, como falar, palavra-para-completar | null, nota | null]
["How are you?", "Como você está?", "Ráu ar iú?", "are", "Resposta comum: ..."]
// palavra: [original, português, como falar]
["yes", "sim", "iés"]
```

Depois rode `node tools/validate-data.mjs` para conferir duplicatas e lacunas.

## Limitações conhecidas

- A voz é a do iPhone. Se faltar: *Ajustes › Acessibilidade › Conteúdo Falado › Vozes* (baixe inglês e espanhol).
  O iOS só libera o áudio após um toque seu e o botão lateral de silêncio pode deixá-lo mudo.
- A pronúncia escrita é **aproximada** e não substitui a pronúncia nativa. O app não avalia a sua fala.
- Espanhol: o áudio padrão é es-ES (Espanha), onde z/c soam “th”; a pronúncia escrita usa “s” (América Latina).
  Dá para trocar para es-MX ou es-US em *Ajustes*.
- Progresso em `localStorage`: fica só no aparelho e pode ser apagado se você limpar os dados do Safari.
  Use o backup em *Ajustes*.
