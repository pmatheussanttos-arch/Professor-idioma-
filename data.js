/*
  Conteúdo das aulas.
  Cada aula tem 6 frases e 3 palavras (as aulas "Palavras essenciais" têm 9 palavras).
  Frase:   [original, português, como falar (aproximado), palavra-para-completar | null, nota | null]
  Palavra: [original, português, como falar (aproximado)]
  A "pronúncia escrita" é só uma aproximação para brasileiros e NÃO substitui o áudio nativo.
*/
(function () {
  var LANGS = {
    en: { name: "Inglês", flag: "🇺🇸", voiceKey: "enVoice", defaultVoice: "en-US" },
    es: { name: "Espanhol", flag: "🇪🇸", voiceKey: "esVoice", defaultVoice: "es-ES" }
  };

  var LEVELS = [
    { key: "ini", name: "Iniciante", desc: "Primeiras frases para sobreviver" },
    { key: "bas", name: "Básico", desc: "Conversas simples do dia a dia" },
    { key: "int", name: "Intermediário", desc: "Falar com mais detalhes" }
  ];

  var TOPICS = [
    { key: "cum", name: "Cumprimentos", icon: "👋" },
    { key: "ped", name: "Pedidos e agradecimentos", icon: "🙏" },
    { key: "pal", name: "Palavras essenciais", icon: "🔤" },
    { key: "apr", name: "Apresentações", icon: "🙋" },
    { key: "rot", name: "Dia a dia no trabalho", icon: "🧰", work: true },
    { key: "emp", name: "Emprego e entrevistas", icon: "📝", work: true },
    { key: "tra", name: "Trabalho em escritório", icon: "💼", work: true },
    { key: "via", name: "Viagens", icon: "✈️" },
    { key: "res", name: "Restaurantes", icon: "🍽️" },
    { key: "com", name: "Compras", icon: "🛍️" },
    { key: "viv", name: "Moradia e serviços", icon: "🏠" },
    { key: "sau", name: "Saúde e emergências", icon: "🏥" },
    { key: "laz", name: "Lazer", icon: "🎉" },
    { key: "cot", name: "Conversas cotidianas", icon: "💬" }
  ];

  var RAW = { en: [], es: [] };
  function L(lang, level, topic, title, phrases, words) {
    RAW[lang].push({ level: level, topic: topic, title: title, phrases: phrases, words: words });
  }

  /* ===================== INGLÊS ===================== */

  // ---- Iniciante
  L("en", "ini", "cum", "Olá e tchau", [
    ["Hello!", "Olá!", "Rê-lôu", null, "“Hello” serve em qualquer situação, formal ou informal."],
    ["Good morning!", "Bom dia!", "Gud mór-nin", "morning", "Usado até mais ou menos o meio-dia."],
    ["Good afternoon!", "Boa tarde!", "Gud é-fter-núnn", "afternoon", "Usado do meio-dia até o fim da tarde."],
    ["How are you?", "Como você está?", "Ráu ar iú?", "are", "Resposta comum: “I'm fine, thank you.”"],
    ["I'm fine, thank you.", "Estou bem, obrigado(a).", "Áim fáin, thénk iú.", "fine", "“I'm” é a forma curta de “I am” (eu sou/estou)."],
    ["Goodbye!", "Tchau!", "Gud-bái", null, "Também se diz “Bye!”, de forma mais informal."]
  ], [
    ["yes", "sim", "iés"], ["no", "não", "nôu"], ["please", "por favor", "plíz"]
  ]);

  L("en", "ini", "apr", "Quem sou eu", [
    ["What's your name?", "Qual é o seu nome?", "Uóts iór nêim?", "name", "“What's” é a forma curta de “What is”."],
    ["My name is Ana.", "Meu nome é Ana.", "Mai nêim iz Ana.", "is", "Troque “Ana” pelo seu nome."],
    ["Nice to meet you.", "Prazer em conhecer você.", "Náis tu mít iú.", "meet", "Resposta comum: “Nice to meet you, too.”"],
    ["I'm from Brazil.", "Eu sou do Brasil.", "Áim frâm Bra-zíl.", "from", "“I'm from…” serve para dizer de onde você é."],
    ["Where are you from?", "De onde você é?", "Uér ar iú frâm?", "Where", null],
    ["I'm learning English.", "Estou aprendendo inglês.", "Áim lér-nin Ín-glish.", "learning", "O “-ing” no final indica uma ação em andamento."]
  ], [
    ["I", "eu", "Ái"], ["you", "você", "iú"], ["name", "nome", "nêim"]
  ]);

  L("en", "ini", "via", "Na rua e no aeroporto", [
    ["Where is the bathroom?", "Onde fica o banheiro?", "Uér iz dhê béth-rum?", "Where", "Em lugares públicos dos EUA também se ouve “restroom”."],
    ["Where is the airport?", "Onde fica o aeroporto?", "Uér iz dhi ér-pórt?", "airport", null],
    ["I need help.", "Preciso de ajuda.", "Ái níd rélp.", "need", null],
    ["One ticket, please.", "Um bilhete, por favor.", "Uân tí-kit, plíz.", "ticket", null],
    ["Turn left.", "Vire à esquerda.", "Térn léft.", "left", "“Turn right” é virar à direita."],
    ["Is it far?", "É longe?", "Iz it fár?", "far", null]
  ], [
    ["left", "esquerda", "léft"], ["right", "direita", "ráit"], ["here", "aqui", "rír"]
  ]);

  L("en", "ini", "res", "Pedindo comida", [
    ["A table for two, please.", "Uma mesa para dois, por favor.", "Â têi-bol fór tú, plíz.", "table", "“For two” significa “para duas pessoas”."],
    ["The menu, please.", "O cardápio, por favor.", "Dhê mé-niu, plíz.", "menu", null],
    ["I would like water.", "Eu gostaria de água.", "Ái ud láik uó-ter.", "water", "“I would like” é mais educado que “I want”."],
    ["I'm hungry.", "Estou com fome.", "Áim rân-gri.", "hungry", "Em inglês se diz “I am hungry” (eu estou faminto), e não “eu tenho fome”."],
    ["The check, please.", "A conta, por favor.", "Dhê tchék, plíz.", "check", "No Reino Unido se diz “the bill”."],
    ["It's delicious!", "Está delicioso!", "Its di-lí-shâs!", "delicious", null]
  ], [
    ["water", "água", "uó-ter"], ["coffee", "café", "kó-fi"], ["bread", "pão", "bréd"]
  ]);

  L("en", "ini", "tra", "Meu trabalho", [
    ["I work here.", "Eu trabalho aqui.", "Ái uérk rír.", "work", null],
    ["What do you do?", "Qual é a sua profissão?", "Uót du iú dú?", "What", "É assim que se pergunta a profissão em inglês."],
    ["I'm a student.", "Eu sou estudante.", "Áim â stú-dent.", "student", null],
    ["I'm a teacher.", "Eu sou professor(a).", "Áim â tí-tcher.", "teacher", "Antes de profissões se usa “a”: “I'm a teacher”."],
    ["Where do you work?", "Onde você trabalha?", "Uér du iú uérk?", "work", null],
    ["I work from home.", "Eu trabalho de casa.", "Ái uérk frâm rôum.", "home", null]
  ], [
    ["job", "emprego", "djób"], ["boss", "chefe", "bóss"], ["office", "escritório", "ó-fis"]
  ]);

  L("en", "ini", "com", "Comprando", [
    ["How much is it?", "Quanto custa?", "Ráu mâtch iz it?", "much", null],
    ["I want this.", "Eu quero isto.", "Ái uónt dhis.", "want", "Para ser mais educado: “I would like this.”"],
    ["It's too expensive.", "É caro demais.", "Its tú ik-spén-siv.", "expensive", "Cuidado: “too” (demais) é diferente de “to” (para)."],
    ["I'm just looking.", "Estou só olhando.", "Áim djâst lú-kin.", "looking", "Resposta clássica quando o vendedor pergunta se pode ajudar."],
    ["Can I try it on?", "Posso experimentar?", "Kén ái trái it ón?", "try", "“Try on” é experimentar uma roupa."],
    ["Where can I pay?", "Onde posso pagar?", "Uér kén ái pêi?", "pay", null]
  ], [
    ["cheap", "barato", "tchíp"], ["big", "grande", "big"], ["small", "pequeno", "smól"]
  ]);

  L("en", "ini", "cot", "Entender e se fazer entender", [
    ["I don't understand.", "Eu não entendo.", "Ái dôunt ân-der-sténd.", "understand", "“Don't” é a forma curta de “do not”."],
    ["Can you repeat, please?", "Pode repetir, por favor?", "Kén iú ri-pít, plíz?", "repeat", null],
    ["Speak slowly, please.", "Fale devagar, por favor.", "Spík slôu-li, plíz.", "slowly", "Palavras com “-ly” costumam indicar o modo de fazer algo."],
    ["Do you speak English?", "Você fala inglês?", "Du iú spík Ín-glish?", "speak", null],
    ["I don't know.", "Eu não sei.", "Ái dôunt nôu.", "know", null],
    ["I'm sorry.", "Desculpe.", "Áim só-ri.", "sorry", "Serve para pedir desculpas e também para lamentar algo."]
  ], [
    ["today", "hoje", "tu-dêi"], ["tomorrow", "amanhã", "tu-mó-rôu"], ["now", "agora", "náu"]
  ]);

  // ---- Básico
  L("en", "bas", "cum", "Cumprimentos no dia a dia", [
    ["Good evening!", "Boa noite! (ao chegar)", "Gud ív-nin!", "evening", "“Good evening” é usado para cumprimentar à noite."],
    ["Good night!", "Boa noite! (ao se despedir)", "Gud náit!", "night", "“Good night” só serve para se despedir ou ir dormir."],
    ["How's it going?", "Como vão as coisas?", "Ráuz it gôu-in?", "going", "Informal. Uma resposta comum é “Pretty good!”."],
    ["What's up?", "E aí?", "Uóts âp?", "up", "Muito informal, entre amigos."],
    ["See you tomorrow!", "Até amanhã!", "Sí iú tu-mó-rôu!", "tomorrow", null],
    ["Have a nice day!", "Tenha um bom dia!", "Rév â náis dêi!", "nice", null]
  ], [
    ["morning", "manhã", "mór-nin"], ["night", "noite", "náit"], ["afternoon", "tarde", "é-fter-núnn"]
  ]);

  L("en", "bas", "apr", "Eu e minha família", [
    ["This is my friend.", "Este é meu amigo.", "Dhis iz mai frénd.", "friend", "Serve para amigo e amiga."],
    ["I have two brothers.", "Eu tenho dois irmãos.", "Ái rév tú brá-dhers.", "brothers", null],
    ["I live in São Paulo.", "Eu moro em São Paulo.", "Ái liv in Sãu Páu-lu.", "live", "Aqui “live” rima com “give”, e não com “five”."],
    ["I'm twenty-five years old.", "Eu tenho vinte e cinco anos.", "Áim tuén-ti-fáiv iérs ôuld.", "years", "Em inglês a idade usa o verbo “ser/estar”, e não “ter”."],
    ["She is my sister.", "Ela é minha irmã.", "Shi iz mai sís-ter.", "sister", null],
    ["How old are you?", "Quantos anos você tem?", "Ráu ôuld ar iú?", "old", null]
  ], [
    ["family", "família", "fém-li"], ["mother", "mãe", "má-dher"], ["father", "pai", "fá-dher"]
  ]);

  L("en", "bas", "via", "Hotel e transporte", [
    ["I have a reservation.", "Eu tenho uma reserva.", "Ái rév â ré-zer-vêi-shân.", "reservation", null],
    ["What time is check-out?", "A que horas é o check-out?", "Uót táim iz tchék-áut?", "time", null],
    ["Is breakfast included?", "O café da manhã está incluído?", "Iz brék-fâst in-klú-did?", "included", null],
    ["How do I get to the station?", "Como chego à estação?", "Ráu du ái guét tu dhê stêi-shân?", "get", "“Get to” significa “chegar a”."],
    ["Where can I buy a ticket?", "Onde posso comprar uma passagem?", "Uér kén ái bái â tí-kit?", "buy", null],
    ["The train is late.", "O trem está atrasado.", "Dhê trêin iz lêit.", "late", null]
  ], [
    ["hotel", "hotel", "rôu-tél"], ["room", "quarto", "rúm"], ["train", "trem", "trêin"]
  ]);

  L("en", "bas", "res", "No restaurante", [
    ["I'm allergic to peanuts.", "Sou alérgico(a) a amendoim.", "Áim a-lér-djik tu pí-nâts.", "allergic", null],
    ["What do you recommend?", "O que você recomenda?", "Uót du iú rè-ko-ménd?", "recommend", null],
    ["I'll have the chicken.", "Vou querer o frango.", "Áil rév dhê tchí-kin.", "chicken", "“I'll” é a forma curta de “I will”."],
    ["Is the tip included?", "A gorjeta está incluída?", "Iz dhê tip in-klú-did?", "tip", null],
    ["No ice, please.", "Sem gelo, por favor.", "Nôu áis, plíz.", "ice", null],
    ["Could we have more water?", "Podemos pedir mais água?", "Kud uí rév môr uó-ter?", "more", "“Could” deixa o pedido mais educado."]
  ], [
    ["beer", "cerveja", "bír"], ["juice", "suco", "djús"], ["salt", "sal", "sólt"]
  ]);

  L("en", "bas", "tra", "No escritório", [
    ["I have a meeting at ten.", "Tenho uma reunião às dez.", "Ái rév â mí-tin ét tén.", "meeting", null],
    ["Can you send me the email?", "Você pode me enviar o e-mail?", "Kén iú sénd mi dhi í-mêil?", "send", null],
    ["I'll call you later.", "Eu ligo para você mais tarde.", "Áil kól iú lêi-ter.", "call", null],
    ["The deadline is Friday.", "O prazo é sexta-feira.", "Dhê déd-láin iz Frái-dêi.", "deadline", null],
    ["I'm busy right now.", "Estou ocupado(a) agora.", "Áim bí-zi ráit náu.", "busy", null],
    ["Let's schedule a call.", "Vamos agendar uma ligação.", "Léts ské-djul â kól.", "schedule", "“Let's” é a forma curta de “Let us” (vamos)."]
  ], [
    ["team", "equipe", "tím"], ["client", "cliente", "klái-ent"], ["salary", "salário", "sé-lâ-ri"]
  ]);

  L("en", "bas", "com", "Roupas e preços", [
    ["Do you have a smaller size?", "Você tem um tamanho menor?", "Du iú rév â smó-ler sáiz?", "smaller", null],
    ["Do you have this in blue?", "Você tem isto em azul?", "Du iú rév dhis in blú?", "blue", null],
    ["Do you accept credit cards?", "Vocês aceitam cartão de crédito?", "Du iú ak-sépt kré-dit kárds?", "accept", null],
    ["Can I get a discount?", "Posso ter um desconto?", "Kén ái guét â dís-kaunt?", "discount", null],
    ["I'll take it.", "Vou levar.", "Áil têik it.", "take", "Frase usada para fechar a compra."],
    ["Can I have a bag?", "Pode me dar uma sacola?", "Kén ái rév â bég?", "bag", null]
  ], [
    ["shirt", "camisa", "shért"], ["shoes", "sapatos", "shúz"], ["pants", "calça", "pénts"]
  ]);

  L("en", "bas", "cot", "Rotina e tempo", [
    ["What time is it?", "Que horas são?", "Uót táim iz it?", "time", null],
    ["I wake up at seven.", "Eu acordo às sete.", "Ái uêik âp ét sé-ven.", "wake", null],
    ["It's raining.", "Está chovendo.", "Its rêi-nin.", "raining", null],
    ["It's very hot today.", "Está muito quente hoje.", "Its vé-ri rót tu-dêi.", "hot", null],
    ["I'm going to the gym.", "Vou à academia.", "Áim gôu-in tu dhê djím.", "gym", null],
    ["Let's have lunch.", "Vamos almoçar.", "Léts rév lântch.", "lunch", null]
  ], [
    ["weather", "clima", "ué-dher"], ["cold", "frio", "kôuld"], ["rain", "chuva", "rêin"]
  ]);

  // ---- Intermediário
  L("en", "int", "cum", "Conversa de verdade", [
    ["Long time no see!", "Quanto tempo!", "Lóng táim nôu sí!", "time", "Expressão informal para quem você não vê há muito tempo."],
    ["It's been a while.", "Faz um tempo.", "Its bín â uáil.", "while", null],
    ["How have you been?", "Como você tem estado?", "Ráu rév iú bín?", "been", null],
    ["I'm doing great, thanks for asking.", "Estou ótimo, obrigado por perguntar.", "Áim dú-in grêit, thénks fór és-kin.", "great", null],
    ["Take care!", "Se cuide!", "Têik kér!", "care", null],
    ["Say hi to your family.", "Dê um oi para a sua família.", "Sêi rái tu iór fém-li.", "hi", null]
  ], [
    ["welcome", "bem-vindo", "uél-kâm"], ["neighbor", "vizinho", "nêi-ber"], ["pleasure", "prazer", "plé-jer"]
  ]);

  L("en", "int", "apr", "Contando sobre você", [
    ["I grew up in a small town.", "Eu cresci em uma cidade pequena.", "Ái grú âp in â smól táun.", "grew", null],
    ["I've been studying English for six months.", "Estudo inglês há seis meses.", "Áiv bín stâ-di-in Ín-glish fór síks mânths.", "months", "“I've been studying” indica algo que começou no passado e continua."],
    ["In my free time, I like to read.", "No meu tempo livre, gosto de ler.", "In mai frí táim, ái láik tu ríd.", "read", null],
    ["I'm interested in technology.", "Tenho interesse em tecnologia.", "Áim ín-tres-tid in tek-nó-lâ-dji.", "interested", null],
    ["I'd like to introduce myself.", "Gostaria de me apresentar.", "Áid láik tu in-tro-dús mai-sélf.", "introduce", "“I'd” é a forma curta de “I would”."],
    ["What do you do for fun?", "O que você faz para se divertir?", "Uót du iú du fór fân?", "fun", null]
  ], [
    ["hobby", "passatempo", "rá-bi"], ["career", "carreira", "ka-rír"], ["experience", "experiência", "ik-spí-ri-êns"]
  ]);

  L("en", "int", "via", "Imprevistos em viagem", [
    ["My flight was canceled.", "Meu voo foi cancelado.", "Mai fláit uâz kén-seld.", "canceled", null],
    ["I lost my passport.", "Perdi meu passaporte.", "Ái lóst mai pés-pórt.", "lost", null],
    ["Could you recommend a good hotel?", "Você poderia recomendar um bom hotel?", "Kud iú rè-ko-ménd â gud rôu-tél?", "hotel", null],
    ["How long does it take to get there?", "Quanto tempo leva para chegar lá?", "Ráu lóng dâz it têik tu guét dhér?", "long", null],
    ["I'd like to rent a car.", "Gostaria de alugar um carro.", "Áid láik tu rént â kár.", "rent", null],
    ["Is there a pharmacy nearby?", "Tem uma farmácia por perto?", "Iz dhér â fár-mâ-si nír-bái?", "pharmacy", null]
  ], [
    ["luggage", "bagagem", "lâ-guidj"], ["delay", "atraso", "di-lêi"], ["insurance", "seguro", "in-shú-râns"]
  ]);

  L("en", "int", "res", "Pedidos mais detalhados", [
    ["Could I see the wine list?", "Poderia ver a carta de vinhos?", "Kud ái sí dhê uáin líst?", "wine", null],
    ["I'm vegetarian.", "Sou vegetariano(a).", "Áim vé-djâ-té-ri-ân.", "vegetarian", null],
    ["I'd like my steak medium, please.", "Quero meu bife ao ponto, por favor.", "Áid láik mai stêik mí-di-âm, plíz.", "steak", null],
    ["Could you bring me another one?", "Poderia me trazer outro?", "Kud iú bring mi a-ná-dher uân?", "another", null],
    ["We'd like to split the bill.", "Gostaríamos de dividir a conta.", "Uíd láik tu split dhê bíl.", "split", null],
    ["The food was excellent.", "A comida estava excelente.", "Dhê fúd uâz ék-sê-lent.", "excellent", null]
  ], [
    ["spicy", "picante", "spái-si"], ["dessert", "sobremesa", "di-zért"], ["napkin", "guardanapo", "nép-kin"]
  ]);

  L("en", "int", "tra", "Reuniões e e-mails", [
    ["I'd like to schedule a meeting.", "Gostaria de marcar uma reunião.", "Áid láik tu ské-djul â mí-tin.", "schedule", null],
    ["Could you please send me the report?", "Você poderia me enviar o relatório?", "Kud iú plíz sénd mi dhê ri-pórt?", "report", null],
    ["I'm working on a new project.", "Estou trabalhando em um novo projeto.", "Áim uér-kin ón â niú pró-djékt.", "project", null],
    ["Let me know if you have any questions.", "Me avise se tiver alguma dúvida.", "Lét mi nôu if iú rév é-ni kués-tchâns.", "questions", null],
    ["I'll get back to you by tomorrow.", "Retorno para você até amanhã.", "Áil guét bék tu iú bái tu-mó-rôu.", "back", null],
    ["Thank you for your time.", "Obrigado pelo seu tempo.", "Thénk iú fór iór táim.", "time", null]
  ], [
    ["manager", "gerente", "mé-ni-djer"], ["contract", "contrato", "kón-trékt"], ["budget", "orçamento", "bâ-djit"]
  ]);

  L("en", "int", "com", "Trocas e atendimento", [
    ["I'd like to return this.", "Gostaria de devolver isto.", "Áid láik tu ri-térn dhis.", "return", null],
    ["It doesn't fit me.", "Não serviu em mim.", "It dâ-zent fit mi.", "fit", null],
    ["Do you have a receipt?", "Você tem o recibo?", "Du iú rév â ri-sít?", "receipt", null],
    ["Can I get a refund?", "Posso receber o reembolso?", "Kén ái guét â rí-fând?", "refund", null],
    ["Is this on sale?", "Isto está em promoção?", "Iz dhis ón sêil?", "sale", null],
    ["I'm looking for a gift.", "Estou procurando um presente.", "Áim lú-kin fór â guíft.", "gift", null]
  ], [
    ["change", "troco", "tchêindj"], ["cash", "dinheiro vivo", "késh"], ["brand", "marca", "brénd"]
  ]);

  L("en", "int", "cot", "Opinar e fazer planos", [
    ["What do you think?", "O que você acha?", "Uót du iú thínk?", "think", null],
    ["In my opinion, it's a good idea.", "Na minha opinião, é uma boa ideia.", "In mai ô-pín-iân, its â gud ái-dí-â.", "opinion", null],
    ["I'm not sure yet.", "Ainda não tenho certeza.", "Áim nót shur iét.", "sure", null],
    ["Do you want to hang out this weekend?", "Quer sair neste fim de semana?", "Du iú uónt tu réng áut dhis uík-énd?", "weekend", "“Hang out” é sair para passar um tempo com alguém."],
    ["I'm running late.", "Estou atrasado(a).", "Áim rân-nin lêit.", "running", null],
    ["That sounds great!", "Parece ótimo!", "Dhét sáunds grêit!", "sounds", null]
  ], [
    ["maybe", "talvez", "mêi-bi"], ["usually", "geralmente", "iú-jua-li"], ["always", "sempre", "ól-uêiz"]
  ]);

  /* ===================== ESPANHOL ===================== */

  // ---- Iniciante
  L("es", "ini", "cum", "Olá e tchau", [
    ["¡Hola!", "Olá!", "Ô-la", null, "O “h” é mudo em espanhol."],
    ["¡Buenos días!", "Bom dia!", "Buê-nos dí-as", "días", "Usado até mais ou menos o meio-dia."],
    ["¡Buenas tardes!", "Boa tarde!", "Buê-nas tár-des", "tardes", "Do meio-dia até anoitecer. Repare que fica no plural: “buenas”."],
    ["¿Cómo estás?", "Como você está?", "Kô-mo es-tás?", "estás", "Perguntas e exclamações levam ¿ ¡ no começo e ? ! no fim."],
    ["Estoy bien, gracias.", "Estou bem, obrigado(a).", "Es-tói biên, grá-sias.", "bien", "“Estoy” vem de “estar”, para estados passageiros."],
    ["¡Adiós!", "Tchau!", "A-diós", null, "Também se diz “¡Chao!” entre amigos."]
  ], [
    ["sí", "sim", "si"], ["no", "não", "nô"], ["por favor", "por favor", "por fa-bór"]
  ]);

  L("es", "ini", "apr", "Quem sou eu", [
    ["¿Cómo te llamas?", "Qual é o seu nome?", "Kô-mo te iá-mas?", "llamas", "Literalmente: “Como você se chama?”"],
    ["Me llamo Ana.", "Meu nome é Ana.", "Me iá-mo Ana.", "llamo", "O “ll” soa como “i” na maior parte do mundo hispânico."],
    ["Mucho gusto.", "Muito prazer.", "Mú-tcho gús-to.", null, null],
    ["Soy de Brasil.", "Eu sou do Brasil.", "Soi de Bra-síl.", "de", "“Soy” vem de “ser”: origem e identidade."],
    ["Estoy aprendiendo español.", "Estou aprendendo espanhol.", "Es-tói a-pren-diên-do es-pa-nhól.", "aprendiendo", "O “ñ” soa como “nh” em português."],
    ["¿De dónde eres?", "De onde você é?", "De dôn-de ê-res?", "dónde", null]
  ], [
    ["yo", "eu", "iô"], ["tú", "você (informal)", "tu"], ["nombre", "nome", "nôm-bre"]
  ]);

  L("es", "ini", "via", "Na rua e no aeroporto", [
    ["¿Dónde está el baño?", "Onde fica o banheiro?", "Dôn-de es-tá el bá-nho?", "baño", "Na Espanha também se ouve “los servicios” ou “el aseo”."],
    ["¿Dónde está el aeropuerto?", "Onde fica o aeroporto?", "Dôn-de es-tá el a-e-ro-puér-to?", "aeropuerto", null],
    ["Necesito ayuda.", "Preciso de ajuda.", "Ne-se-sí-to a-iú-da.", null, null],
    ["Un billete, por favor.", "Uma passagem, por favor.", "Um bi-iê-te, por fa-bór.", "billete", "Na América Latina costuma-se dizer “boleto” ou “pasaje”."],
    ["Gire a la izquierda.", "Vire à esquerda.", "Rrí-re a la is-kiêr-da.", "izquierda", "“Derecha” é direita. O “j” e o “g” antes de e/i soam como um “rr” forte."],
    ["¿Está lejos?", "É longe?", "Es-tá lê-rros?", null, null]
  ], [
    ["derecha", "direita", "de-rê-tcha"], ["aquí", "aqui", "a-kí"], ["allí", "ali", "a-ií"]
  ]);

  L("es", "ini", "res", "Pedindo comida", [
    ["Una mesa para dos, por favor.", "Uma mesa para dois, por favor.", "Ú-na mê-sa pá-ra dos, por fa-bór.", "mesa", null],
    ["La carta, por favor.", "O cardápio, por favor.", "La kár-ta, por fa-bór.", "carta", "Na América Latina costuma-se dizer “el menú”."],
    ["Quiero agua.", "Quero água.", "Kiê-ro á-gua.", null, null],
    ["Tengo hambre.", "Estou com fome.", "Tên-go ám-bre.", null, "Em espanhol se diz “tenho fome”, assim como em português."],
    ["La cuenta, por favor.", "A conta, por favor.", "La kuên-ta, por fa-bór.", "cuenta", null],
    ["¡Está delicioso!", "Está delicioso!", "Es-tá de-li-sió-so!", null, null]
  ], [
    ["café", "café", "ka-fé"], ["pan", "pão", "pan"], ["cerveza", "cerveja", "ser-bê-sa"]
  ]);

  L("es", "ini", "tra", "Meu trabalho", [
    ["Trabajo aquí.", "Eu trabalho aqui.", "Tra-bá-rro a-kí.", null, "Em espanhol o sujeito “yo” costuma ser omitido."],
    ["¿A qué te dedicas?", "Qual é a sua profissão?", "A kê te de-dí-kas?", "dedicas", "É assim que se pergunta a profissão em espanhol."],
    ["Soy estudiante.", "Eu sou estudante.", "Soi es-tu-diân-te.", null, null],
    ["Soy profesor.", "Eu sou professor(a).", "Soi pro-fe-sór.", null, "Para uma mulher: “Soy profesora”."],
    ["¿Dónde trabajas?", "Onde você trabalha?", "Dôn-de tra-bá-rras?", null, null],
    ["Trabajo desde casa.", "Trabalho de casa.", "Tra-bá-rro dês-de ká-sa.", "casa", null]
  ], [
    ["jefe", "chefe", "rrê-fe"], ["oficina", "escritório", "o-fi-sí-na"], ["empresa", "empresa", "em-prê-sa"]
  ]);

  L("es", "ini", "com", "Comprando", [
    ["¿Cuánto cuesta?", "Quanto custa?", "Kuán-to kuês-ta?", null, null],
    ["Quiero esto.", "Quero isto.", "Kiê-ro ês-to.", null, null],
    ["Es muy caro.", "É muito caro.", "Es mui ká-ro.", "caro", null],
    ["Solo estoy mirando.", "Só estou olhando.", "Sô-lo es-tói mi-rán-do.", "mirando", null],
    ["¿Puedo probármelo?", "Posso experimentar?", "Puê-do pro-bár-me-lo?", null, "Usado para roupas e sapatos."],
    ["¿Dónde puedo pagar?", "Onde posso pagar?", "Dôn-de puê-do pa-gár?", "pagar", null]
  ], [
    ["barato", "barato", "ba-rá-to"], ["grande", "grande", "grân-de"], ["pequeño", "pequeno", "pe-kê-nho"]
  ]);

  L("es", "ini", "cot", "Entender e se fazer entender", [
    ["No entiendo.", "Eu não entendo.", "No en-tiên-do.", null, null],
    ["¿Puede repetir, por favor?", "Pode repetir, por favor?", "Puê-de re-pe-tír, por fa-bór?", "repetir", null],
    ["Hable más despacio, por favor.", "Fale mais devagar, por favor.", "Á-ble más des-pá-sio, por fa-bór.", "despacio", null],
    ["¿Habla inglés?", "Você fala inglês?", "Á-bla in-glés?", null, null],
    ["No sé.", "Eu não sei.", "No sê.", null, "Atenção ao acento: “sé” (eu sei) é diferente de “se”."],
    ["Lo siento.", "Sinto muito.", "Lo siên-to.", null, "Serve para pedir desculpas ou lamentar algo."]
  ], [
    ["hoy", "hoje", "ói"], ["mañana", "amanhã", "ma-nhá-na"], ["ahora", "agora", "a-ô-ra"]
  ]);

  // ---- Básico
  L("es", "bas", "cum", "Cumprimentos no dia a dia", [
    ["¡Buenas noches!", "Boa noite!", "Buê-nas nô-tches!", "noches", "Serve tanto para cumprimentar quanto para se despedir à noite."],
    ["¿Qué tal?", "E aí? / Tudo bem?", "Ke tal?", null, "Informal e muito comum."],
    ["¿Cómo va todo?", "Como vão as coisas?", "Kô-mo ba tô-do?", "todo", null],
    ["¡Hasta mañana!", "Até amanhã!", "Ás-ta ma-nhá-na!", "mañana", "O “h” é mudo: “hasta” soa “asta”."],
    ["¡Hasta luego!", "Até logo!", "Ás-ta luê-go!", "luego", null],
    ["¡Que tengas un buen día!", "Tenha um bom dia!", "Ke tên-gas um buén dí-a!", "día", null]
  ], [
    ["bienvenido", "bem-vindo", "bien-be-ní-do"], ["gracias", "obrigado(a)", "grá-sias"], ["de nada", "de nada", "de ná-da"]
  ]);

  L("es", "bas", "apr", "Eu e minha família", [
    ["Este es mi amigo.", "Este é meu amigo.", "Ês-te es mi a-mí-go.", "amigo", "Para amiga: “Esta es mi amiga”."],
    ["Tengo dos hermanos.", "Eu tenho dois irmãos.", "Tên-go dos er-má-nos.", "hermanos", "O “h” é mudo."],
    ["Vivo en São Paulo.", "Eu moro em São Paulo.", "Bí-bo en Sãu Páu-lo.", "Vivo", "O “v” em espanhol soa como “b”."],
    ["Tengo veinticinco años.", "Eu tenho vinte e cinco anos.", "Tên-go bein-ti-sín-ko á-nhos.", "años", "Em espanhol se usa “tener” (ter) para a idade, como em português."],
    ["Ella es mi hermana.", "Ela é minha irmã.", "Ê-ia es mi er-má-na.", "hermana", null],
    ["¿Cuántos años tienes?", "Quantos anos você tem?", "Kuán-tos á-nhos tiê-nes?", "años", null]
  ], [
    ["familia", "família", "fa-mí-lia"], ["madre", "mãe", "má-dre"], ["padre", "pai", "pá-dre"]
  ]);

  L("es", "bas", "via", "Hotel e transporte", [
    ["Tengo una reserva.", "Tenho uma reserva.", "Tên-go ú-na re-sér-ba.", "reserva", null],
    ["¿A qué hora es la salida?", "A que horas é o check-out?", "A kê ô-ra es la sa-lí-da?", "hora", "Literalmente: “a que horas é a saída?”"],
    ["¿El desayuno está incluido?", "O café da manhã está incluído?", "El de-sa-iú-no es-tá in-klu-í-do?", "incluido", null],
    ["¿Cómo llego a la estación?", "Como chego à estação?", "Kô-mo iê-go a la es-ta-sión?", "llego", null],
    ["¿Dónde puedo comprar un billete?", "Onde posso comprar uma passagem?", "Dôn-de puê-do kom-prár um bi-iê-te?", "comprar", null],
    ["El tren llega tarde.", "O trem chega atrasado.", "El trén iê-ga tár-de.", "tarde", null]
  ], [
    ["hotel", "hotel", "o-tél"], ["habitación", "quarto", "a-bi-ta-sión"], ["autobús", "ônibus", "au-to-bús"]
  ]);

  L("es", "bas", "res", "No restaurante", [
    ["Soy alérgico a los cacahuetes.", "Sou alérgico(a) a amendoim.", "Soi a-lér-rri-ko a los ka-ka-uê-tes.", "cacahuetes", "Na América Latina também se diz “maní”."],
    ["¿Qué recomienda?", "O que você recomenda?", "Ke re-ko-miên-da?", null, null],
    ["Voy a tomar el pollo.", "Vou querer o frango.", "Bói a to-már el pó-io.", "pollo", "“Voy a + verbo” indica o que você vai fazer."],
    ["¿La propina está incluida?", "A gorjeta está incluída?", "La pro-pí-na es-tá in-klu-í-da?", "propina", null],
    ["Sin hielo, por favor.", "Sem gelo, por favor.", "Sin iê-lo, por fa-bór.", "hielo", null],
    ["¿Podemos pedir más agua?", "Podemos pedir mais água?", "Po-dê-mos pe-dír más á-gua?", "más", null]
  ], [
    ["postre", "sobremesa", "pós-tre"], ["sal", "sal", "sal"], ["pimienta", "pimenta", "pi-miên-ta"]
  ]);

  L("es", "bas", "tra", "No escritório", [
    ["Tengo una reunión a las diez.", "Tenho uma reunião às dez.", "Tên-go ú-na rre-u-nión a las diés.", "reunión", null],
    ["¿Puedes enviarme el correo?", "Pode me enviar o e-mail?", "Puê-des en-biár-me el ko-rrê-o?", "correo", null],
    ["Te llamo más tarde.", "Eu ligo para você mais tarde.", "Te iá-mo más tár-de.", "llamo", null],
    ["La fecha límite es el viernes.", "O prazo é sexta-feira.", "La fê-tcha lí-mi-te es el biér-nes.", "viernes", null],
    ["Estoy ocupado ahora.", "Estou ocupado(a) agora.", "Es-tói o-ku-pá-do a-ô-ra.", "ocupado", null],
    ["Vamos a programar una llamada.", "Vamos agendar uma ligação.", "Bá-mos a pro-gra-már ú-na ia-má-da.", "llamada", null]
  ], [
    ["equipo", "equipe", "e-kí-po"], ["cliente", "cliente", "kli-ên-te"], ["sueldo", "salário", "suél-do"]
  ]);

  L("es", "bas", "com", "Roupas e preços", [
    ["¿Tiene una talla más pequeña?", "Você tem um tamanho menor?", "Tiê-ne ú-na tá-ia más pe-kê-nha?", "talla", null],
    ["¿Lo tiene en azul?", "Você tem isto em azul?", "Lo tiê-ne en a-sul?", "azul", null],
    ["¿Aceptan tarjetas de crédito?", "Vocês aceitam cartão de crédito?", "A-sép-tan tar-rrê-tas de krê-di-to?", "tarjetas", null],
    ["¿Me puede hacer un descuento?", "Pode me dar um desconto?", "Me puê-de a-sér um des-kuên-to?", "descuento", null],
    ["Me lo llevo.", "Vou levar.", "Me lo iê-bo.", "llevo", "Frase usada para fechar a compra."],
    ["¿Me da una bolsa?", "Pode me dar uma sacola?", "Me da ú-na ból-sa?", "bolsa", null]
  ], [
    ["camisa", "camisa", "ka-mí-sa"], ["zapatos", "sapatos", "sa-pá-tos"], ["pantalones", "calça", "pan-ta-ló-nes"]
  ]);

  L("es", "bas", "cot", "Rotina e tempo", [
    ["¿Qué hora es?", "Que horas são?", "Ke ô-ra és?", "hora", null],
    ["Me levanto a las siete.", "Eu me levanto às sete.", "Me le-bán-to a las siê-te.", "levanto", null],
    ["Está lloviendo.", "Está chovendo.", "Es-tá io-biên-do.", null, null],
    ["Hoy hace mucho calor.", "Hoje está muito quente.", "Ói á-se mú-tcho ka-lór.", "calor", "Para o clima se usa “hacer”: “hace calor”, “hace frío”."],
    ["Voy al gimnasio.", "Vou à academia.", "Bói al rrim-ná-sio.", "gimnasio", null],
    ["Vamos a almorzar.", "Vamos almoçar.", "Bá-mos a al-mor-sár.", "almorzar", null]
  ], [
    ["tiempo", "tempo (clima)", "tiêm-po"], ["frío", "frio", "frí-o"], ["lluvia", "chuva", "iú-bia"]
  ]);

  // ---- Intermediário
  L("es", "int", "cum", "Conversa de verdade", [
    ["¡Cuánto tiempo sin verte!", "Quanto tempo sem te ver!", "Kuán-to tiêm-po sin bêr-te!", "tiempo", null],
    ["Ha pasado un tiempo.", "Já faz um tempo.", "A pa-sá-do um tiêm-po.", "pasado", null],
    ["¿Cómo has estado?", "Como você tem estado?", "Kô-mo as es-tá-do?", "estado", null],
    ["Estoy muy bien, gracias por preguntar.", "Estou muito bem, obrigado por perguntar.", "Es-tói mui biên, grá-sias por pre-gun-tár.", "preguntar", null],
    ["¡Cuídate!", "Se cuide!", "Kuí-da-te!", null, null],
    ["Saluda a tu familia de mi parte.", "Mande um abraço à sua família.", "Sa-lú-da a tu fa-mí-lia de mi pár-te.", "Saluda", null]
  ], [
    ["encantado", "encantado (prazer)", "en-kan-tá-do"], ["vecino", "vizinho", "be-sí-no"], ["invitado", "convidado", "in-bi-tá-do"]
  ]);

  L("es", "int", "apr", "Contando sobre você", [
    ["Crecí en un pueblo pequeño.", "Cresci em uma cidadezinha.", "Kre-sí en um puê-blo pe-kê-nho.", "pueblo", null],
    ["Llevo seis meses estudiando español.", "Estudo espanhol há seis meses.", "Iê-bo sêis mê-ses es-tu-diân-do es-pa-nhól.", "meses", "“Llevo + tempo + gerúndio” indica algo que começou antes e continua."],
    ["En mi tiempo libre, me gusta leer.", "No meu tempo livre, gosto de ler.", "En mi tiêm-po lí-bre, me gús-ta le-êr.", "leer", null],
    ["Me interesa la tecnología.", "Me interesso por tecnologia.", "Me in-te-rê-sa la tek-no-lo-rrí-a.", "tecnología", null],
    ["Me gustaría presentarme.", "Gostaria de me apresentar.", "Me gus-ta-rí-a pre-sen-tár-me.", "presentarme", null],
    ["¿Qué haces para divertirte?", "O que você faz para se divertir?", "Ke á-ses pá-ra di-ber-tír-te?", "divertirte", null]
  ], [
    ["pasatiempo", "passatempo", "pa-sa-tiêm-po"], ["carrera", "carreira", "ka-rrê-ra"], ["experiencia", "experiência", "eks-pe-riên-sia"]
  ]);

  L("es", "int", "via", "Imprevistos em viagem", [
    ["Cancelaron mi vuelo.", "Cancelaram meu voo.", "Kan-se-lá-ron mi buê-lo.", "vuelo", null],
    ["Perdí mi pasaporte.", "Perdi meu passaporte.", "Per-dí mi pa-sa-pór-te.", "pasaporte", null],
    ["¿Puede recomendarme un buen hotel?", "Pode me recomendar um bom hotel?", "Puê-de re-ko-men-dár-me um buén o-tél?", "hotel", null],
    ["¿Cuánto se tarda en llegar?", "Quanto tempo leva para chegar?", "Kuán-to se tár-da en ie-gár?", "tarda", null],
    ["Quisiera alquilar un coche.", "Gostaria de alugar um carro.", "Ki-siê-ra al-ki-lár um kô-tche.", "alquilar", "Na América Latina costuma-se dizer “carro” ou “auto”."],
    ["¿Hay una farmacia cerca?", "Tem uma farmácia por perto?", "Ai ú-na far-má-sia sér-ka?", "farmacia", null]
  ], [
    ["equipaje", "bagagem", "e-ki-pá-rre"], ["retraso", "atraso", "re-trá-so"], ["seguro", "seguro (de viagem)", "se-gú-ro"]
  ]);

  L("es", "int", "res", "Pedidos mais detalhados", [
    ["¿Podría ver la carta de vinos?", "Poderia ver a carta de vinhos?", "Po-drí-a bér la kár-ta de bí-nos?", "vinos", null],
    ["Soy vegetariano.", "Sou vegetariano(a).", "Soi be-rre-ta-riá-no.", null, "Para uma mulher: “Soy vegetariana”."],
    ["Quisiera el filete al punto, por favor.", "Quero o bife ao ponto, por favor.", "Ki-siê-ra el fi-lê-te al pún-to, por fa-bór.", "punto", null],
    ["¿Podría traerme otro?", "Poderia me trazer outro?", "Po-drí-a tra-êr-me ô-tro?", "otro", null],
    ["Nos gustaría dividir la cuenta.", "Gostaríamos de dividir a conta.", "Nos gus-ta-rí-a di-bi-dír la kuên-ta.", "dividir", null],
    ["La comida estaba excelente.", "A comida estava excelente.", "La ko-mí-da es-tá-ba ek-se-lên-te.", "excelente", null]
  ], [
    ["picante", "picante", "pi-kán-te"], ["servilleta", "guardanapo", "ser-bi-iê-ta"], ["helado", "sorvete", "e-lá-do"]
  ]);

  L("es", "int", "tra", "Reuniões e e-mails", [
    ["Me gustaría programar una reunión.", "Gostaria de marcar uma reunião.", "Me gus-ta-rí-a pro-gra-már ú-na rre-u-nión.", "programar", null],
    ["¿Podría enviarme el informe?", "Poderia me enviar o relatório?", "Po-drí-a en-biár-me el in-fór-me?", "informe", null],
    ["Estoy trabajando en un proyecto nuevo.", "Estou trabalhando em um novo projeto.", "Es-tói tra-ba-rrán-do en um pro-iêk-to nuê-bo.", "proyecto", null],
    ["Avíseme si tiene alguna pregunta.", "Me avise se tiver alguma dúvida.", "A-bí-se-me si tiê-ne al-gú-na pre-gún-ta.", "pregunta", null],
    ["Le respondo antes de mañana.", "Respondo ao senhor(a) antes de amanhã.", "Le res-pón-do án-tes de ma-nhá-na.", "respondo", "“Le” aqui é tratamento formal (“o senhor/a senhora”)."],
    ["Gracias por su tiempo.", "Obrigado pelo seu tempo.", "Grá-sias por su tiêm-po.", "tiempo", null]
  ], [
    ["gerente", "gerente", "rre-rrên-te"], ["contrato", "contrato", "kon-trá-to"], ["presupuesto", "orçamento", "pre-su-puês-to"]
  ]);

  L("es", "int", "com", "Trocas e atendimento", [
    ["Quisiera devolver esto.", "Gostaria de devolver isto.", "Ki-siê-ra de-bol-bér ês-to.", "devolver", null],
    ["No me queda bien.", "Não me serve / não fica bom em mim.", "No me kê-da biên.", "queda", null],
    ["¿Tiene el recibo?", "Você tem o recibo?", "Tiê-ne el re-sí-bo?", "recibo", null],
    ["¿Puedo obtener un reembolso?", "Posso receber o reembolso?", "Puê-do ob-te-nêr um rre-em-ból-so?", "reembolso", null],
    ["¿Está en oferta?", "Está em promoção?", "Es-tá en o-fér-ta?", "oferta", null],
    ["Busco un regalo.", "Estou procurando um presente.", "Bús-ko um re-gá-lo.", "regalo", null]
  ], [
    ["cambio", "troco", "kám-bio"], ["efectivo", "dinheiro vivo", "e-fek-tí-bo"], ["marca", "marca", "már-ka"]
  ]);

  L("es", "int", "cot", "Opinar e fazer planos", [
    ["¿Qué opinas?", "O que você acha?", "Ke o-pí-nas?", null, null],
    ["En mi opinión, es una buena idea.", "Na minha opinião, é uma boa ideia.", "En mi o-pi-nión, es ú-na buê-na i-dê-a.", "idea", null],
    ["Todavía no estoy seguro.", "Ainda não tenho certeza.", "To-da-bí-a no es-tói se-gú-ro.", "seguro", null],
    ["¿Quieres salir este fin de semana?", "Quer sair neste fim de semana?", "Kiê-res sa-lír ês-te fin de se-má-na?", "salir", null],
    ["Voy con retraso.", "Estou atrasado(a).", "Bói kon re-trá-so.", "retraso", null],
    ["¡Suena genial!", "Parece ótimo!", "Suê-na rre-niál!", null, null]
  ], [
    ["quizás", "talvez", "ki-sás"], ["normalmente", "geralmente", "nor-mal-mên-te"], ["siempre", "sempre", "siêm-pre"]
  ]);

  /* ===================== NOVAS SITUAÇÕES: dia a dia, trabalho e vida no país ===================== */

  /* ---------- INGLÊS: Pedidos e agradecimentos ---------- */
  L("en", "ini", "ped", "Agradecer e pedir ajuda", [
    ["Thank you very much.", "Muito obrigado(a).", "Thénk iú vé-ri mâtch.", "very", "“Very much” deixa o agradecimento mais forte."],
    ["You're welcome.", "De nada.", "Iór uél-kâm.", null, "É a resposta ao “thank you”. “Welcome” sozinho significa “bem-vindo”."],
    ["Excuse me.", "Com licença.", "Ik-skiús mi.", null, "Serve para chamar a atenção de alguém ou pedir passagem."],
    ["Can you help me, please?", "Pode me ajudar, por favor?", "Kén iú rélp mi, plíz?", "help", null],
    ["Could you open the door?", "Poderia abrir a porta?", "Kud iú ôu-pen dhê dór?", "open", "“Could” é mais educado que “Can”."],
    ["Just a moment, please.", "Só um momento, por favor.", "Djâst â mô-ment, plíz.", "moment", null]
  ], [
    ["thanks", "obrigado(a)", "thénks"], ["help", "ajuda", "rélp"], ["wait", "esperar", "uêit"]
  ]);

  L("en", "bas", "ped", "Pedir um favor", [
    ["Could you do me a favor?", "Você poderia me fazer um favor?", "Kud iú du mi â fêi-vâr?", "favor", null],
    ["I really appreciate it.", "Eu agradeço muito.", "Ái rí-li a-prí-shi-êit it.", "appreciate", "Boa forma de agradecer no trabalho."],
    ["Thanks for your help.", "Obrigado pela ajuda.", "Thénks fór iór rélp.", "help", null],
    ["No problem.", "Sem problema.", "Nôu pró-blem.", null, "Resposta informal ao “thanks”."],
    ["Could you speak a little louder?", "Poderia falar um pouco mais alto?", "Kud iú spík â lí-tol láu-der?", "louder", null],
    ["Sorry to bother you.", "Desculpe incomodar.", "Só-ri tu bá-dher iú.", "bother", "Use antes de fazer uma pergunta a alguém ocupado."]
  ], [
    ["again", "de novo", "a-guén"], ["slow", "devagar (lento)", "slôu"], ["loud", "alto (volume)", "láud"]
  ]);

  L("en", "int", "ped", "Pedidos educados", [
    ["Would you mind helping me with this?", "Você se importaria de me ajudar com isto?", "Ud iú máind rél-pin mi uídh dhis?", "helping", "“Would you mind” é um pedido muito educado."],
    ["I'd be grateful for your help.", "Eu ficaria grato pela sua ajuda.", "Áid bi grêit-fâl fór iór rélp.", "grateful", null],
    ["Thank you for being so patient.", "Obrigado por ter tanta paciência.", "Thénk iú fór bí-in sôu pêi-shent.", "patient", null],
    ["Sorry, I didn't catch that.", "Desculpe, não captei isso.", "Só-ri, ái dí-dent kétch dhét.", "catch", "Boa forma de pedir para repetir, sem parecer rude."],
    ["Could you write it down for me?", "Você poderia anotar isso para mim?", "Kud iú ráit it dáun fór mi?", "write", null],
    ["I'm sorry for the inconvenience.", "Peço desculpas pelo transtorno.", "Áim só-ri fór dhi in-kon-ví-niêns.", "inconvenience", null]
  ], [
    ["kindly", "gentilmente", "káind-li"], ["favor", "favor", "fêi-vâr"], ["patience", "paciência", "pêi-shêns"]
  ]);

  /* ---------- INGLÊS: Palavras essenciais ---------- */
  L("en", "ini", "pal", "Números e perguntas", [
    ["What is this?", "O que é isto?", "Uót iz dhis?", "this", null],
    ["Where is it?", "Onde está?", "Uér iz it?", "Where", null],
    ["When does it start?", "Quando começa?", "Uén dâz it stárt?", "start", null],
    ["Who is that?", "Quem é aquele?", "Rú iz dhét?", "Who", null],
    ["How many do you need?", "Quantos você precisa?", "Ráu mé-ni du iú níd?", "many", "“How many” é para coisas que se contam; “How much” é para quantidade ou preço."],
    ["Which one?", "Qual deles?", "Uítch uân?", null, null]
  ], [
    ["one", "um", "uân"], ["two", "dois", "tú"], ["three", "três", "thrí"], ["five", "cinco", "fáiv"], ["ten", "dez", "tén"],
    ["twenty", "vinte", "tuén-ti"], ["hundred", "cem", "rân-dred"], ["Monday", "segunda-feira", "Mân-dêi"], ["week", "semana", "uík"]
  ]);

  L("en", "bas", "pal", "Verbos mais usados", [
    ["I need to go.", "Preciso ir.", "Ái níd tu gôu.", "need", null],
    ["I can do it.", "Eu consigo fazer.", "Ái kén du it.", "can", "“Can” é “conseguir/poder”."],
    ["I have to work tomorrow.", "Tenho que trabalhar amanhã.", "Ái rév tu uérk tu-mó-rôu.", "have", "“Have to” indica obrigação."],
    ["I want to learn.", "Quero aprender.", "Ái uónt tu lérn.", "learn", null],
    ["Do you know him?", "Você o conhece?", "Du iú nôu rim?", "know", null],
    ["Let me try.", "Deixe-me tentar.", "Lét mi trái.", "try", null]
  ], [
    ["go", "ir", "gôu"], ["come", "vir", "kâm"], ["give", "dar", "guiv"], ["take", "pegar / levar", "têik"], ["make", "fazer (criar)", "mêik"],
    ["get", "conseguir / pegar", "guét"], ["see", "ver", "sí"], ["say", "dizer", "sêi"], ["ask", "perguntar / pedir", "ésk"]
  ]);

  L("en", "int", "pal", "Conectores e expressões", [
    ["I think so.", "Acho que sim.", "Ái thínk sôu.", "think", null],
    ["Of course!", "Claro!", "Âv kórs!", null, null],
    ["It depends.", "Depende.", "It di-péndz.", null, null],
    ["As soon as possible.", "O mais rápido possível.", "Éz sún éz pó-sâ-bol.", "possible", "Muito usado no trabalho; às vezes aparece como “ASAP”."],
    ["I'm not sure about that.", "Não tenho certeza disso.", "Áim nót shur a-báut dhét.", "about", null],
    ["That makes sense.", "Faz sentido.", "Dhét mêiks sens.", "makes", null]
  ], [
    ["because", "porque", "bi-kóz"], ["but", "mas", "bât"], ["also", "também", "ól-sôu"], ["however", "porém", "rau-é-ver"], ["already", "já", "ol-ré-di"],
    ["still", "ainda", "stil"], ["almost", "quase", "ól-môst"], ["enough", "suficiente", "i-nâf"], ["often", "frequentemente", "ó-fen"]
  ]);

  /* ---------- INGLÊS: Dia a dia no trabalho ---------- */
  L("en", "ini", "rot", "Primeiros dias no trabalho", [
    ["What time do I start?", "A que horas eu começo?", "Uót táim du ái stárt?", "start", null],
    ["What time do I finish?", "A que horas eu termino?", "Uót táim du ái fí-nish?", "finish", null],
    ["Where do I put this?", "Onde eu coloco isto?", "Uér du ái pút dhis?", "put", null],
    ["Can you show me how?", "Pode me mostrar como se faz?", "Kén iú shôu mi ráu?", "show", "Ótima frase para o primeiro dia: ninguém espera que você já saiba tudo."],
    ["I'm finished.", "Terminei.", "Áim fí-nisht.", null, null],
    ["I'll do it now.", "Eu faço agora.", "Áil du it náu.", "now", null]
  ], [
    ["shift", "turno", "shíft"], ["break", "intervalo", "brêik"], ["tools", "ferramentas", "túls"]
  ]);

  L("en", "bas", "rot", "Horários, folgas e pagamento", [
    ["Who is my supervisor?", "Quem é meu supervisor?", "Rú iz mai sú-per-vái-zer?", "supervisor", null],
    ["I need a day off.", "Preciso de um dia de folga.", "Ái níd â dêi óf.", "off", null],
    ["I'm sick today.", "Estou doente hoje.", "Áim sik tu-dêi.", "sick", "Avise o quanto antes, de preferência por mensagem ou ligação."],
    ["I'll be late tomorrow.", "Vou chegar atrasado amanhã.", "Áil bi lêit tu-mó-rôu.", "late", null],
    ["When do I get paid?", "Quando eu recebo o pagamento?", "Uén du ái guét pêid?", "paid", null],
    ["Is overtime paid?", "As horas extras são pagas?", "Iz ôu-ver-táim pêid?", "overtime", null]
  ], [
    ["schedule", "escala / horário", "ské-djul"], ["uniform", "uniforme", "iú-ni-fórm"], ["safety", "segurança (proteção)", "sêif-ti"]
  ]);

  L("en", "int", "rot", "Instruções e responsabilidade", [
    ["I understand the instructions.", "Eu entendo as instruções.", "Ái ân-der-sténd dhi ins-trâk-shâns.", "instructions", null],
    ["Could you explain the safety rules?", "Poderia explicar as regras de segurança?", "Kud iú ik-splêin dhê sêif-ti rúls?", "rules", null],
    ["I'll take care of it.", "Eu cuido disso.", "Áil têik kér âv it.", "care", null],
    ["I made a mistake.", "Eu cometi um erro.", "Ái mêid â mis-têik.", "mistake", "Assumir o erro rápido é muito bem visto no trabalho."],
    ["Is there anything else I can do?", "Há mais alguma coisa que eu possa fazer?", "Iz dhér é-ni-thing éls ái kén du?", "anything", null],
    ["I can work extra hours this week.", "Posso fazer horas extras esta semana.", "Ái kén uérk ék-strâ áu-ers dhis uík.", "extra", null]
  ], [
    ["equipment", "equipamento", "i-kuíp-ment"], ["task", "tarefa", "tésk"], ["coworker", "colega de trabalho", "kôu-uér-ker"]
  ]);

  /* ---------- INGLÊS: Procurar emprego ---------- */
  L("en", "ini", "emp", "Procurando emprego", [
    ["I'm looking for a job.", "Estou procurando emprego.", "Áim lú-kin fór â djób.", "job", null],
    ["Are you hiring?", "Vocês estão contratando?", "Ar iú rái-rin?", "hiring", "Pergunta direta e comum ao entregar currículo pessoalmente."],
    ["I have experience.", "Eu tenho experiência.", "Ái rév ik-spí-ri-êns.", "experience", null],
    ["I can start on Monday.", "Posso começar na segunda-feira.", "Ái kén stárt ón Mân-dêi.", "start", null],
    ["Here is my resume.", "Aqui está meu currículo.", "Rír iz mai ré-zu-mêi.", "resume", "Nos EUA se diz “resume”; no Reino Unido, “CV”."],
    ["Do you have an application form?", "Vocês têm um formulário de candidatura?", "Du iú rév én a-pli-kêi-shân fórm?", "form", null]
  ], [
    ["resume", "currículo", "ré-zu-mêi"], ["interview", "entrevista", "ín-ter-viu"], ["full-time", "período integral", "fúl-táim"]
  ]);

  L("en", "bas", "emp", "Falando da sua experiência", [
    ["I worked as a cook.", "Trabalhei como cozinheiro(a).", "Ái uérkt éz â kúk.", "worked", null],
    ["I have two years of experience.", "Tenho dois anos de experiência.", "Ái rév tú iérs âv ik-spí-ri-êns.", "years", null],
    ["I'm a hard worker.", "Sou trabalhador(a) dedicado(a).", "Áim â rárd uér-ker.", "hard", null],
    ["Is the job full-time?", "A vaga é de período integral?", "Iz dhê djób fúl-táim?", "job", null],
    ["How much is the pay?", "Quanto é o pagamento?", "Ráu mâtch iz dhê pêi?", "pay", "Pergunte também se é por hora (“hourly”) ou por mês."],
    ["Do I need a work permit?", "Preciso de autorização de trabalho?", "Du ái níd â uérk pér-mit?", "permit", null]
  ], [
    ["cook", "cozinheiro(a)", "kúk"], ["driver", "motorista", "drái-ver"], ["cleaner", "faxineiro(a)", "klí-ner"]
  ]);

  L("en", "int", "emp", "Entrevista de emprego", [
    ["I'm applying for the position.", "Estou me candidatando à vaga.", "Áim a-plái-in fór dhê po-zí-shân.", "applying", null],
    ["Could you tell me about the job?", "Pode me falar sobre o trabalho?", "Kud iú tél mi a-báut dhê djób?", "tell", null],
    ["My strengths are teamwork and punctuality.", "Meus pontos fortes são trabalho em equipe e pontualidade.", "Mai strénkths ar tím-uérk énd pânk-tchu-é-lâ-ti.", "teamwork", "Frase pronta para a pergunta “What are your strengths?”."],
    ["I'm available to work weekends.", "Estou disponível para trabalhar nos fins de semana.", "Áim a-vêi-lâ-bol tu uérk uík-éndz.", "available", null],
    ["Can I get a reference letter?", "Posso pedir uma carta de referência?", "Kén ái guét â ré-fer-êns lé-ter?", "reference", null],
    ["When can I expect to hear from you?", "Quando posso esperar uma resposta de vocês?", "Uén kén ái ik-spékt tu rír frâm iú?", "expect", null]
  ], [
    ["position", "vaga / cargo", "po-zí-shân"], ["wage", "pagamento por hora", "uêidj"], ["benefits", "benefícios", "bé-ne-fits"]
  ]);

  /* ---------- INGLÊS: Moradia e serviços ---------- */
  L("en", "ini", "viv", "Casa, mercado e celular", [
    ["I'm looking for an apartment.", "Estou procurando um apartamento.", "Áim lú-kin fór én a-párt-ment.", "apartment", "No Reino Unido se diz “flat”."],
    ["How much is the rent?", "Quanto é o aluguel?", "Ráu mâtch iz dhê rént?", "rent", null],
    ["Where is the supermarket?", "Onde fica o supermercado?", "Uér iz dhê sú-per-már-ket?", "supermarket", null],
    ["I need a bus card.", "Preciso de um cartão de ônibus.", "Ái níd â bâs kárd.", "card", null],
    ["Where can I buy a SIM card?", "Onde posso comprar um chip de celular?", "Uér kén ái bái â sim kárd?", "SIM", null],
    ["What is the Wi-Fi password?", "Qual é a senha do Wi-Fi?", "Uót iz dhê Uái-fái pés-uérd?", "password", null]
  ], [
    ["key", "chave", "kí"], ["address", "endereço", "é-dres"], ["bank", "banco", "bénk"]
  ]);

  L("en", "bas", "viv", "Banco, contas e transporte", [
    ["I'd like to open a bank account.", "Gostaria de abrir uma conta bancária.", "Áid láik tu ôu-pen â bénk a-káunt.", "account", null],
    ["What documents do I need?", "De quais documentos eu preciso?", "Uót dó-kiu-ments du ái níd?", "documents", "Pergunta útil em qualquer repartição ou banco."],
    ["Where do I pay the electricity bill?", "Onde pago a conta de luz?", "Uér du ái pêi dhi i-lek-trí-si-ti bíl?", "electricity", null],
    ["The internet is not working.", "A internet não está funcionando.", "Dhi ín-ter-nét iz nót uér-kin.", "internet", null],
    ["Can I schedule an appointment?", "Posso marcar um horário?", "Kén ái ské-djul én a-póint-ment?", "appointment", null],
    ["Which bus goes to downtown?", "Qual ônibus vai para o centro?", "Uítch bâs gôuz tu dáun-táun?", "goes", null]
  ], [
    ["lease", "contrato de aluguel", "lís"], ["landlord", "proprietário (do imóvel)", "lénd-lórd"], ["deposit", "depósito / caução", "di-pó-zit"]
  ]);

  L("en", "int", "viv", "Documentos e burocracia", [
    ["I'd like to renew my visa.", "Gostaria de renovar meu visto.", "Áid láik tu ri-niú mai ví-zâ.", "renew", null],
    ["Do I need to sign a lease?", "Preciso assinar um contrato de aluguel?", "Du ái níd tu sáin â lís?", "sign", null],
    ["Is the deposit refundable?", "A caução é reembolsável?", "Iz dhê di-pó-zit ri-fân-dâ-bol?", "deposit", null],
    ["I need to report a problem.", "Preciso relatar um problema.", "Ái níd tu ri-pórt â pró-blem.", "report", null],
    ["How do I set up automatic payments?", "Como configuro pagamentos automáticos?", "Ráu du ái sét âp ó-to-mé-tik pêi-ments?", "automatic", null],
    ["I'm still waiting for my documents.", "Ainda estou esperando meus documentos.", "Áim stil uêi-tin fór mai dó-kiu-ments.", "waiting", null]
  ], [
    ["tenant", "inquilino", "té-nânt"], ["utilities", "contas da casa (água, luz)", "iu-tí-lâ-tiz"], ["registration", "cadastro / registro", "réd-jis-trêi-shân"]
  ]);

  /* ---------- INGLÊS: Saúde e emergências ---------- */
  L("en", "ini", "sau", "Preciso de ajuda médica", [
    ["I need a doctor.", "Preciso de um médico.", "Ái níd â dók-ter.", "doctor", null],
    ["I don't feel well.", "Não estou me sentindo bem.", "Ái dôunt fíl uél.", "feel", null],
    ["It hurts here.", "Dói aqui.", "It rérts rír.", "hurts", "Aponte para o local enquanto fala."],
    ["Call an ambulance!", "Chame uma ambulância!", "Kól én ém-biu-lâns!", "ambulance", "Nos EUA e no Canadá, o número de emergência é 911; no Reino Unido, 999."],
    ["Where is the pharmacy?", "Onde fica a farmácia?", "Uér iz dhê fár-mâ-si?", "pharmacy", null],
    ["I need help right now!", "Preciso de ajuda agora mesmo!", "Ái níd rélp ráit náu!", "right", null]
  ], [
    ["pain", "dor", "pêin"], ["fever", "febre", "fí-ver"], ["hospital", "hospital", "rós-pi-tâl"]
  ]);

  L("en", "bas", "sau", "Consulta e remédios", [
    ["I have a headache.", "Estou com dor de cabeça.", "Ái rév â réd-êik.", "headache", null],
    ["I have a fever and a cough.", "Estou com febre e tosse.", "Ái rév â fí-ver énd â kóf.", "fever", null],
    ["I need to make an appointment.", "Preciso marcar uma consulta.", "Ái níd tu mêik én a-póint-ment.", "appointment", null],
    ["Do you have health insurance?", "Você tem plano de saúde?", "Du iú rév rélth in-shú-râns?", "insurance", null],
    ["How often should I take this medicine?", "Com que frequência devo tomar este remédio?", "Ráu ó-fen shud ái têik dhis mé-di-sin?", "medicine", null],
    ["I've been feeling dizzy.", "Tenho me sentido tonto(a).", "Áiv bín fí-lin dí-zi.", "dizzy", null]
  ], [
    ["prescription", "receita médica", "pris-krip-shân"], ["emergency", "emergência", "i-mér-djen-si"], ["dentist", "dentista", "dén-tist"]
  ]);

  L("en", "int", "sau", "Explicando sintomas", [
    ["I've had these symptoms for three days.", "Estou com esses sintomas há três dias.", "Áiv réd dhíz símp-tâms fór thrí dêiz.", "symptoms", null],
    ["Is it serious?", "É grave?", "Iz it sí-ri-âs?", "serious", null],
    ["Do I need to fast before the test?", "Preciso estar em jejum antes do exame?", "Du ái níd tu fést bi-fór dhê tést?", "fast", null],
    ["I'm taking medication for high blood pressure.", "Tomo remédio para pressão alta.", "Áim têi-kin mé-di-kêi-shân fór rái blâd pré-shér.", "pressure", null],
    ["Could you give me a medical certificate?", "Poderia me dar um atestado médico?", "Kud iú guiv mi â mé-di-kâl ser-tí-fi-kât?", "certificate", "Necessário para justificar faltas no trabalho."],
    ["Where is the nearest emergency room?", "Onde fica o pronto-socorro mais próximo?", "Uér iz dhê nír-est i-mér-djen-si rúm?", "nearest", null]
  ], [
    ["allergy", "alergia", "é-ler-dji"], ["injury", "lesão / ferimento", "ín-dju-ri"], ["treatment", "tratamento", "trít-ment"]
  ]);

  /* ---------- INGLÊS: Lazer ---------- */
  L("en", "ini", "laz", "Lazer simples", [
    ["Do you like music?", "Você gosta de música?", "Du iú láik miú-zik?", "music", null],
    ["I like soccer.", "Eu gosto de futebol.", "Ái láik só-ker.", "soccer", "Nos EUA, “soccer” é o nosso futebol; “football” é o futebol americano."],
    ["Let's go to the park.", "Vamos ao parque.", "Léts gôu tu dhê párk.", "park", null],
    ["Do you want to watch a movie?", "Quer assistir a um filme?", "Du iú uónt tu uótch â mú-vi?", "movie", null],
    ["What do you like to do?", "O que você gosta de fazer?", "Uót du iú láik tu du?", "like", null],
    ["I'm free on Saturday.", "Estou livre no sábado.", "Áim frí ón Sé-ter-dêi.", "free", null]
  ], [
    ["park", "parque", "párk"], ["beach", "praia", "bítch"], ["game", "jogo", "guêim"]
  ]);

  L("en", "bas", "laz", "Combinar programas", [
    ["What are you doing this weekend?", "O que você vai fazer neste fim de semana?", "Uót ar iú dú-in dhis uík-énd?", "doing", null],
    ["Do you want to grab a coffee?", "Quer tomar um café?", "Du iú uónt tu grép â kó-fi?", "grab", "“Grab a coffee” é o convite casual mais comum."],
    ["I play soccer on Sundays.", "Eu jogo futebol aos domingos.", "Ái plêi só-ker ón Sân-dêiz.", "Sundays", null],
    ["That was a lot of fun.", "Foi muito divertido.", "Dhét uâz â lót âv fân.", "fun", null],
    ["Do you want to join us?", "Quer se juntar a nós?", "Du iú uónt tu djóin âs?", "join", null],
    ["I'm going to the beach on Saturday.", "Vou à praia no sábado.", "Áim gôu-in tu dhê bítch ón Sé-ter-dêi.", "beach", null]
  ], [
    ["movie", "filme", "mú-vi"], ["party", "festa", "pár-ti"], ["concert", "show / concerto", "kón-sert"]
  ]);

  L("en", "int", "laz", "Vida social", [
    ["I'm into hiking and photography.", "Eu curto trilhas e fotografia.", "Áim ín-tu rái-kin énd fâ-tó-grâ-fi.", "hiking", null],
    ["Let's meet up after work.", "Vamos nos encontrar depois do trabalho.", "Léts mít âp é-fter uérk.", "after", null],
    ["I'd love to, but I'm busy.", "Eu adoraria, mas estou ocupado.", "Áid lâv tu, bât áim bí-zi.", "love", "Jeito educado de recusar um convite."],
    ["Have you seen that show?", "Você já viu aquela série?", "Rév iú sín dhét shôu?", "seen", null],
    ["We should hang out more often.", "Deveríamos sair mais vezes.", "Uí shud réng áut môr ó-fen.", "often", null],
    ["It was great catching up with you.", "Foi ótimo colocar o papo em dia com você.", "It uâz grêit ké-tchin âp uídh iú.", "catching", null]
  ], [
    ["hiking", "trilha", "rái-kin"], ["nightlife", "vida noturna", "náit-láif"], ["invitation", "convite", "in-vi-têi-shân"]
  ]);

  /* ---------- ESPANHOL: Pedidos e agradecimentos ---------- */
  L("es", "ini", "ped", "Agradecer e pedir ajuda", [
    ["Muchas gracias.", "Muito obrigado(a).", "Mú-tchas grá-sias.", null, "“Gracias” serve para homem e mulher."],
    ["No hay de qué.", "De nada (resposta educada).", "No ai de kê.", "hay", "Literalmente: “não há de quê”. Também se diz “de nada”."],
    ["Con permiso.", "Com licença.", "Kon per-mí-so.", null, "Serve para pedir passagem ou entrar num lugar."],
    ["¿Puede ayudarme, por favor?", "Pode me ajudar, por favor?", "Puê-de a-iu-dár-me, por fa-bór?", "ayudarme", null],
    ["¿Podría abrir la puerta?", "Poderia abrir a porta?", "Po-drí-a a-brír la puêr-ta?", "puerta", "“Podría” é mais educado que “puede”."],
    ["Un momento, por favor.", "Só um momento, por favor.", "Um mo-mên-to, por fa-bór.", "momento", null]
  ], [
    ["ayuda", "ajuda", "a-iú-da"], ["esperar", "esperar", "es-pe-rár"], ["perdón", "desculpa", "per-dón"]
  ]);

  L("es", "bas", "ped", "Pedir um favor", [
    ["¿Me puede hacer un favor?", "Você poderia me fazer um favor?", "Me puê-de a-sér um fa-bór?", "favor", null],
    ["Se lo agradezco mucho.", "Agradeço muito.", "Se lo a-gra-dês-ko mú-tcho.", "agradezco", "Forma educada (usted). “Te lo agradezco” é para amigos."],
    ["Gracias por tu ayuda.", "Obrigado pela ajuda.", "Grá-sias por tu a-iú-da.", "ayuda", null],
    ["No hay problema.", "Sem problema.", "No ai pro-blê-ma.", "problema", null],
    ["¿Puede hablar un poco más alto?", "Pode falar um pouco mais alto?", "Puê-de a-blár um pô-ko más ál-to?", "alto", null],
    ["Perdón por molestar.", "Desculpe incomodar.", "Per-dón por mo-les-tár.", "molestar", "Use antes de fazer uma pergunta a alguém ocupado."]
  ], [
    ["otra vez", "de novo", "ô-tra bês"], ["despacio", "devagar", "des-pá-sio"], ["fuerte", "alto (volume) / forte", "fuêr-te"]
  ]);

  L("es", "int", "ped", "Pedidos educados", [
    ["¿Le importaría ayudarme con esto?", "Você se importaria de me ajudar com isto?", "Le im-por-ta-rí-a a-iu-dár-me kon ês-to?", "importaría", "“Le importaría” é um pedido muito educado."],
    ["Le estaría muy agradecido por su ayuda.", "Eu ficaria muito grato pela sua ajuda.", "Le es-ta-rí-a mui a-gra-de-sí-do por su a-iú-da.", "agradecido", null],
    ["Gracias por tener tanta paciencia.", "Obrigado por ter tanta paciência.", "Grá-sias por te-nêr tán-ta pa-siên-sia.", "paciencia", null],
    ["Perdone, no he entendido eso.", "Desculpe, não entendi isso.", "Per-dô-ne, no e en-ten-dí-do ê-so.", "entendido", null],
    ["¿Podría escribirlo para mí?", "Poderia escrever isso para mim?", "Po-drí-a es-kri-bír-lo pá-ra mi?", "escribirlo", null],
    ["Lamento las molestias.", "Lamento o transtorno.", "La-mên-to las mo-lês-tias.", "molestias", null]
  ], [
    ["amablemente", "gentilmente", "a-ma-ble-mên-te"], ["favor", "favor", "fa-bór"], ["paciencia", "paciência", "pa-siên-sia"]
  ]);

  /* ---------- ESPANHOL: Palavras essenciais ---------- */
  L("es", "ini", "pal", "Números e perguntas", [
    ["¿Qué es esto?", "O que é isto?", "Ke es ês-to?", "esto", null],
    ["¿Dónde está?", "Onde está?", "Dôn-de es-tá?", null, null],
    ["¿Cuándo empieza?", "Quando começa?", "Kuán-do em-piê-sa?", null, null],
    ["¿Quién es ese?", "Quem é aquele?", "Kién es ê-se?", "ese", null],
    ["¿Cuántos necesitas?", "Quantos você precisa?", "Kuán-tos ne-se-sí-tas?", null, "Ao falar de coisas femininas: “¿Cuántas?”."],
    ["¿Por qué?", "Por quê?", "Por kê?", null, "“Por qué” (pergunta) e “porque” (resposta) se escrevem diferente."]
  ], [
    ["uno", "um", "ú-no"], ["dos", "dois", "dos"], ["tres", "três", "tres"], ["cinco", "cinco", "sín-ko"], ["diez", "dez", "diés"],
    ["veinte", "vinte", "bêin-te"], ["cien", "cem", "sién"], ["lunes", "segunda-feira", "lú-nes"], ["semana", "semana", "se-má-na"]
  ]);

  L("es", "bas", "pal", "Verbos mais usados", [
    ["Tengo que ir ahora.", "Tenho que ir agora.", "Tên-go ke ir a-ô-ra.", "ahora", "“Tener que” + verbo indica obrigação."],
    ["Yo puedo hacerlo.", "Eu consigo fazer.", "Iô puê-do a-sér-lo.", "puedo", null],
    ["Tengo que trabajar mañana.", "Tenho que trabalhar amanhã.", "Tên-go ke tra-ba-rrár ma-nhá-na.", "trabajar", null],
    ["Quiero aprender más.", "Quero aprender mais.", "Kiê-ro a-pren-dér más.", "aprender", null],
    ["¿Lo conoces bien?", "Você o conhece bem?", "Lo ko-nô-ses biên?", "conoces", "“Conocer” é conhecer pessoas e lugares; “saber” é saber um fato."],
    ["Déjame intentarlo otra vez.", "Deixe-me tentar de novo.", "Dê-rra-me in-ten-tár-lo ô-tra bês.", "intentarlo", null]
  ], [
    ["ir", "ir", "ir"], ["venir", "vir", "be-nír"], ["dar", "dar", "dar"], ["tomar", "tomar / pegar", "to-már"], ["hacer", "fazer", "a-sér"],
    ["tener", "ter", "te-nêr"], ["ver", "ver", "ber"], ["decir", "dizer", "de-sír"], ["pedir", "pedir", "pe-dír"]
  ]);

  L("es", "int", "pal", "Conectores e expressões", [
    ["Creo que sí.", "Acho que sim.", "Krê-o ke si.", "Creo", null],
    ["¡Por supuesto!", "Claro!", "Por su-puês-to!", null, null],
    ["Depende.", "Depende.", "De-pên-de.", null, null],
    ["Lo antes posible.", "O mais rápido possível.", "Lo án-tes po-sí-ble.", "posible", "Muito usado no trabalho."],
    ["No estoy seguro de eso.", "Não tenho certeza disso.", "No es-tói se-gú-ro de ê-so.", "eso", null],
    ["Eso tiene sentido.", "Faz sentido.", "Ê-so tiê-ne sen-tí-do.", "sentido", null]
  ], [
    ["porque", "porque", "pór-ke"], ["pero", "mas", "pê-ro"], ["también", "também", "tam-biên"], ["sin embargo", "porém", "sin em-bár-go"], ["ya", "já", "ia"],
    ["casi", "quase", "ká-si"], ["suficiente", "suficiente", "su-fi-siên-te"], ["a menudo", "frequentemente", "a me-nú-do"], ["además", "além disso", "a-de-más"]
  ]);

  /* ---------- ESPANHOL: Dia a dia no trabalho ---------- */
  L("es", "ini", "rot", "Primeiros dias no trabalho", [
    ["¿A qué hora empiezo?", "A que horas eu começo?", "A kê ô-ra em-piê-so?", "hora", null],
    ["¿A qué hora termino?", "A que horas eu termino?", "A kê ô-ra ter-mí-no?", "termino", null],
    ["¿Dónde pongo esto?", "Onde eu coloco isto?", "Dôn-de pôn-go ês-to?", "pongo", null],
    ["¿Puede mostrarme cómo se hace?", "Pode me mostrar como se faz?", "Puê-de mos-trár-me kô-mo se á-se?", "mostrarme", "Ótima frase para o primeiro dia: ninguém espera que você já saiba tudo."],
    ["Ya terminé.", "Terminei.", "Ia ter-mi-nê.", null, null],
    ["Lo hago ahora.", "Eu faço agora.", "Lo á-go a-ô-ra.", "hago", null]
  ], [
    ["turno", "turno", "túr-no"], ["descanso", "intervalo", "des-kán-so"], ["herramientas", "ferramentas", "e-rra-miên-tas"]
  ]);

  L("es", "bas", "rot", "Horários, folgas e pagamento", [
    ["¿Quién es mi supervisor?", "Quem é meu supervisor?", "Kién es mi su-per-bi-sór?", "supervisor", null],
    ["Necesito un día libre.", "Preciso de um dia de folga.", "Ne-se-sí-to um dí-a lí-bre.", "libre", null],
    ["Hoy estoy enfermo.", "Estou doente hoje.", "Ói es-tói en-fêr-mo.", "enfermo", "Avise o quanto antes, de preferência por mensagem ou ligação."],
    ["Mañana llegaré tarde.", "Vou chegar atrasado amanhã.", "Ma-nhá-na ie-ga-rê tár-de.", "llegaré", null],
    ["¿Cuándo me pagan?", "Quando eu recebo o pagamento?", "Kuán-do me pá-gan?", "pagan", null],
    ["¿Se pagan las horas extra?", "As horas extras são pagas?", "Se pá-gan las ô-ras êks-tra?", "extra", null]
  ], [
    ["horario", "escala / horário", "o-rá-rio"], ["uniforme", "uniforme", "u-ni-fór-me"], ["seguridad", "segurança (proteção)", "se-gu-ri-dád"]
  ]);

  L("es", "int", "rot", "Instruções e responsabilidade", [
    ["Entiendo las instrucciones.", "Entendo as instruções.", "En-tiên-do las ins-truk-siô-nes.", "instrucciones", null],
    ["¿Podría explicar las normas de seguridad?", "Poderia explicar as regras de segurança?", "Po-drí-a eks-pli-kár las nôr-mas de se-gu-ri-dád?", "normas", null],
    ["Yo me encargo de eso.", "Eu cuido disso.", "Iô me en-kár-go de ê-so.", "encargo", null],
    ["Cometí un error.", "Cometi um erro.", "Ko-me-tí um e-rrôr.", "error", "Assumir o erro rápido é muito bem visto no trabalho."],
    ["¿Hay algo más que pueda hacer?", "Há mais alguma coisa que eu possa fazer?", "Ai ál-go más ke puê-da a-sér?", "algo", null],
    ["Puedo hacer horas extra esta semana.", "Posso fazer horas extras esta semana.", "Puê-do a-sér ô-ras êks-tra ês-ta se-má-na.", "extra", null]
  ], [
    ["maquinaria", "maquinário", "ma-ki-ná-ria"], ["tarea", "tarefa", "ta-rê-a"], ["compañero", "colega de trabalho", "kom-pa-nhê-ro"]
  ]);

  /* ---------- ESPANHOL: Procurar emprego ---------- */
  L("es", "ini", "emp", "Procurando emprego", [
    ["Busco trabajo.", "Estou procurando emprego.", "Bús-ko tra-bá-rro.", null, null],
    ["¿Están contratando?", "Vocês estão contratando?", "Es-tán kon-tra-tán-do?", null, "Pergunta direta e comum ao entregar currículo pessoalmente."],
    ["Tengo experiencia.", "Eu tenho experiência.", "Tên-go eks-pe-riên-sia.", null, null],
    ["Puedo empezar el lunes.", "Posso começar na segunda-feira.", "Puê-do em-pe-sár el lú-nes.", "lunes", null],
    ["Aquí está mi currículum.", "Aqui está meu currículo.", "A-kí es-tá mi ku-rrí-ku-lum.", "currículum", "Também se diz “CV” (ce-uve)."],
    ["¿Tienen un formulario de solicitud?", "Vocês têm um formulário de candidatura?", "Tiê-nen um for-mu-lá-rio de so-li-si-túd?", "formulario", null]
  ], [
    ["entrevista", "entrevista", "en-tre-bís-ta"], ["tiempo completo", "período integral", "tiêm-po kom-plê-to"], ["empleo", "emprego", "em-plê-o"]
  ]);

  L("es", "bas", "emp", "Falando da sua experiência", [
    ["Trabajé como cocinero.", "Trabalhei como cozinheiro.", "Tra-ba-rrê kô-mo ko-si-nê-ro.", "cocinero", null],
    ["Tengo dos años de experiencia.", "Tenho dois anos de experiência.", "Tên-go dos á-nhos de eks-pe-riên-sia.", "años", null],
    ["Soy una persona trabajadora.", "Sou uma pessoa trabalhadora.", "Soi ú-na per-sô-na tra-ba-rrá-do-ra.", "trabajadora", null],
    ["¿El puesto es de tiempo completo?", "A vaga é de período integral?", "El puês-to es de tiêm-po kom-plê-to?", "puesto", null],
    ["¿Cuánto es el sueldo?", "Quanto é o salário?", "Kuán-to es el suél-do?", "sueldo", "Pergunte também se é por hora (“por hora”) ou por mês."],
    ["¿Necesito un permiso de trabajo?", "Preciso de autorização de trabalho?", "Ne-se-sí-to um per-mí-so de tra-bá-rro?", "permiso", null]
  ], [
    ["cocinero", "cozinheiro", "ko-si-nê-ro"], ["conductor", "motorista", "kon-duk-tór"], ["limpieza", "limpeza (faxina)", "lim-piê-sa"]
  ]);

  L("es", "int", "emp", "Entrevista de emprego", [
    ["Quisiera solicitar el puesto.", "Gostaria de me candidatar à vaga.", "Ki-siê-ra so-li-si-tár el puês-to.", "solicitar", null],
    ["¿Podría contarme más sobre el trabajo?", "Poderia me contar mais sobre o trabalho?", "Po-drí-a kon-tár-me más sô-bre el tra-bá-rro?", "contarme", null],
    ["Soy puntual y trabajo en equipo.", "Sou pontual e trabalho em equipe.", "Soi pun-tuál i tra-bá-rro en e-kí-po.", "puntual", "Frase pronta para a pergunta sobre seus pontos fortes."],
    ["Tengo disponibilidad los fines de semana.", "Tenho disponibilidade nos fins de semana.", "Tên-go dis-po-ni-bi-li-dád los fí-nes de se-má-na.", "disponibilidad", null],
    ["¿Podría darme una carta de recomendación?", "Poderia me dar uma carta de recomendação?", "Po-drí-a dár-me ú-na kár-ta de re-ko-men-da-sión?", "recomendación", null],
    ["¿Cuándo puedo esperar una respuesta?", "Quando posso esperar uma resposta?", "Kuán-do puê-do es-pe-rár ú-na res-pués-ta?", "respuesta", null]
  ], [
    ["vacante", "vaga", "ba-kán-te"], ["beneficios", "benefícios", "be-ne-fí-sios"], ["referencias", "referências", "re-fe-rên-sias"]
  ]);

  /* ---------- ESPANHOL: Moradia e serviços ---------- */
  L("es", "ini", "viv", "Casa, mercado e celular", [
    ["Busco un apartamento.", "Estou procurando um apartamento.", "Bús-ko um a-par-ta-mên-to.", "apartamento", "Na Espanha também se diz “piso”; no México, “departamento”."],
    ["¿Cuánto es el alquiler?", "Quanto é o aluguel?", "Kuán-to es el al-ki-lér?", "alquiler", null],
    ["¿Dónde está el supermercado?", "Onde fica o supermercado?", "Dôn-de es-tá el su-per-mer-ká-do?", "supermercado", null],
    ["Necesito una tarjeta de autobús.", "Preciso de um cartão de ônibus.", "Ne-se-sí-to ú-na tar-rrê-ta de au-to-bús.", "tarjeta", null],
    ["¿Dónde puedo comprar una tarjeta SIM?", "Onde posso comprar um chip de celular?", "Dôn-de puê-do kom-prár ú-na tar-rrê-ta sim?", "SIM", null],
    ["¿Cuál es la contraseña del wifi?", "Qual é a senha do Wi-Fi?", "Kuál es la kon-tra-sê-nha del uí-fi?", "contraseña", null]
  ], [
    ["llave", "chave", "iá-be"], ["dirección", "endereço", "di-rek-sión"], ["banco", "banco", "bán-ko"]
  ]);

  L("es", "bas", "viv", "Banco, contas e transporte", [
    ["Quisiera abrir una cuenta bancaria.", "Gostaria de abrir uma conta bancária.", "Ki-siê-ra a-brír ú-na kuên-ta ban-ká-ria.", "cuenta", null],
    ["¿Qué documentos necesito?", "De quais documentos eu preciso?", "Ke do-ku-mên-tos ne-se-sí-to?", "documentos", "Pergunta útil em qualquer repartição ou banco."],
    ["¿Dónde pago la factura de la luz?", "Onde pago a conta de luz?", "Dôn-de pá-go la fak-tú-ra de la lus?", "factura", null],
    ["El internet no funciona.", "A internet não está funcionando.", "El in-ter-nét no fun-sió-na.", "funciona", "Na Espanha se diz “la conexión” ou “internet” sem artigo; ambos são aceitos."],
    ["¿Puedo pedir una cita?", "Posso marcar um horário?", "Puê-do pe-dír ú-na sí-ta?", "cita", "“Cita” é horário marcado em médico, banco ou repartição."],
    ["¿Qué autobús va al centro?", "Qual ônibus vai para o centro?", "Ke au-to-bús ba al sên-tro?", "centro", null]
  ], [
    ["casero", "proprietário (do imóvel)", "ka-sê-ro"], ["fianza", "depósito / caução", "fiân-sa"], ["inquilino", "inquilino", "in-ki-lí-no"]
  ]);

  L("es", "int", "viv", "Documentos e burocracia", [
    ["Quisiera renovar mi visado.", "Gostaria de renovar meu visto.", "Ki-siê-ra re-no-bár mi bi-sá-do.", "renovar", "Na América Latina costuma-se dizer “visa”."],
    ["¿Tengo que firmar un contrato de alquiler?", "Preciso assinar um contrato de aluguel?", "Tên-go ke fir-már um kon-trá-to de al-ki-lér?", "firmar", null],
    ["¿La fianza es reembolsable?", "A caução é reembolsável?", "La fiân-sa es rre-em-bol-sá-ble?", "fianza", null],
    ["Necesito informar de un problema.", "Preciso relatar um problema.", "Ne-se-sí-to in-for-már de um pro-blê-ma.", "informar", null],
    ["¿Cómo configuro los pagos automáticos?", "Como configuro pagamentos automáticos?", "Kô-mo kon-fi-gú-ro los pá-gos au-to-má-ti-kos?", "automáticos", null],
    ["Todavía estoy esperando mis documentos.", "Ainda estou esperando meus documentos.", "To-da-bí-a es-tói es-pe-rán-do mis do-ku-mên-tos.", "esperando", null]
  ], [
    ["suministros", "contas da casa (água, luz)", "su-mi-nís-tros"], ["registro", "cadastro / registro", "rre-rrís-tro"], ["empadronamiento", "registro de residência (Espanha)", "em-pa-dro-na-miên-to"]
  ]);

  /* ---------- ESPANHOL: Saúde e emergências ---------- */
  L("es", "ini", "sau", "Preciso de ajuda médica", [
    ["Necesito un médico.", "Preciso de um médico.", "Ne-se-sí-to um mê-di-ko.", "médico", null],
    ["No me siento bien.", "Não estou me sentindo bem.", "No me siên-to biên.", "siento", null],
    ["Me duele aquí.", "Dói aqui.", "Me duê-le a-kí.", "duele", "Aponte para o local enquanto fala."],
    ["¡Llame a una ambulancia!", "Chame uma ambulância!", "Iá-me a ú-na am-bu-lán-sia!", "ambulancia", "Na Espanha, o número de emergência é 112."],
    ["¿Dónde está la farmacia?", "Onde fica a farmácia?", "Dôn-de es-tá la far-má-sia?", "farmacia", null],
    ["¡Necesito ayuda ahora mismo!", "Preciso de ajuda agora mesmo!", "Ne-se-sí-to a-iú-da a-ô-ra mís-mo!", "mismo", null]
  ], [
    ["dolor", "dor", "do-lór"], ["fiebre", "febre", "fiê-bre"], ["hospital", "hospital", "os-pi-tál"]
  ]);

  L("es", "bas", "sau", "Consulta e remédios", [
    ["Tengo dolor de cabeza.", "Estou com dor de cabeça.", "Tên-go do-lór de ka-bê-sa.", "cabeza", null],
    ["Tengo fiebre y tos.", "Estou com febre e tosse.", "Tên-go fiê-bre i tos.", "fiebre", null],
    ["Necesito pedir una cita.", "Preciso marcar uma consulta.", "Ne-se-sí-to pe-dír ú-na sí-ta.", "cita", null],
    ["¿Tiene seguro médico?", "Você tem plano de saúde?", "Tiê-ne se-gú-ro mê-di-ko?", "seguro", null],
    ["¿Cada cuánto debo tomar este medicamento?", "Com que frequência devo tomar este remédio?", "Ká-da kuán-to dê-bo to-már ês-te me-di-ka-mên-to?", "medicamento", null],
    ["Últimamente me siento mareado.", "Ultimamente tenho me sentido tonto.", "Úl-ti-ma-mên-te me siên-to ma-re-á-do.", "mareado", null]
  ], [
    ["receta", "receita médica", "rre-sê-ta"], ["urgencias", "pronto-socorro", "ur-rrên-sias"], ["dentista", "dentista", "den-tís-ta"]
  ]);

  L("es", "int", "sau", "Explicando sintomas", [
    ["Tengo estos síntomas desde hace tres días.", "Estou com esses sintomas há três dias.", "Tên-go ês-tos sín-to-mas dês-de á-se tres dí-as.", "síntomas", null],
    ["¿Es grave?", "É grave?", "Es grá-be?", null, null],
    ["¿Tengo que estar en ayunas para el análisis?", "Preciso estar em jejum para o exame?", "Tên-go ke es-tár en a-iú-nas pá-ra el a-ná-li-sis?", "ayunas", null],
    ["Tomo medicación para la tensión alta.", "Tomo remédio para pressão alta.", "Tô-mo me-di-ka-sión pá-ra la ten-sión ál-ta.", "tensión", null],
    ["¿Podría darme un justificante médico?", "Poderia me dar um atestado médico?", "Po-drí-a dár-me um rrus-ti-fi-kán-te mê-di-ko?", "justificante", "Necessário para justificar faltas no trabalho."],
    ["¿Dónde están urgencias?", "Onde fica o pronto-socorro?", "Dôn-de es-tán ur-rrên-sias?", "urgencias", null]
  ], [
    ["alergia", "alergia", "a-lêr-rria"], ["lesión", "lesão / ferimento", "le-sión"], ["tratamiento", "tratamento", "tra-ta-miên-to"]
  ]);

  /* ---------- ESPANHOL: Lazer ---------- */
  L("es", "ini", "laz", "Lazer simples", [
    ["¿Te gusta la música?", "Você gosta de música?", "Te gús-ta la mú-si-ka?", "música", null],
    ["Me gusta el fútbol.", "Eu gosto de futebol.", "Me gús-ta el fút-bol.", "fútbol", null],
    ["Vamos al parque.", "Vamos ao parque.", "Bá-mos al pár-ke.", "parque", null],
    ["¿Quieres ver una película?", "Quer assistir a um filme?", "Kiê-res ber ú-na pe-lí-ku-la?", "película", null],
    ["¿Qué te gusta hacer?", "O que você gosta de fazer?", "Ke te gús-ta a-sér?", "gusta", null],
    ["Estoy libre el sábado.", "Estou livre no sábado.", "Es-tói lí-bre el sá-ba-do.", "sábado", null]
  ], [
    ["playa", "praia", "plá-ia"], ["juego", "jogo", "rruê-go"], ["fiesta", "festa", "fiês-ta"]
  ]);

  L("es", "bas", "laz", "Combinar programas", [
    ["¿Qué haces este fin de semana?", "O que você faz neste fim de semana?", "Ke á-ses ês-te fin de se-má-na?", "haces", null],
    ["¿Quieres tomar un café?", "Quer tomar um café?", "Kiê-res to-már um ka-fé?", "tomar", "Convite casual muito comum."],
    ["Juego al fútbol los domingos.", "Eu jogo futebol aos domingos.", "Rruê-go al fút-bol los do-mín-gos.", "domingos", null],
    ["Fue muy divertido.", "Foi muito divertido.", "Fuê mui di-ber-tí-do.", "divertido", null],
    ["¿Quieres unirte a nosotros?", "Quer se juntar a nós?", "Kiê-res u-nír-te a no-sô-tros?", "unirte", null],
    ["El sábado voy a la playa.", "No sábado vou à praia.", "El sá-ba-do bói a la plá-ia.", "playa", null]
  ], [
    ["concierto", "show / concerto", "kon-siêr-to"], ["cine", "cinema", "sí-ne"], ["amigos", "amigos", "a-mí-gos"]
  ]);

  L("es", "int", "laz", "Vida social", [
    ["Me encantan el senderismo y la fotografía.", "Eu adoro trilhas e fotografia.", "Me en-kán-tan el sen-de-rís-mo i la fo-to-gra-fí-a.", "senderismo", null],
    ["Quedamos después del trabajo.", "Vamos nos encontrar depois do trabalho.", "Ke-dá-mos des-puês del tra-bá-rro.", "después", "“Quedar” é combinar de se encontrar."],
    ["Me encantaría, pero estoy ocupado.", "Eu adoraria, mas estou ocupado.", "Me en-kan-ta-rí-a, pê-ro es-tói o-ku-pá-do.", "encantaría", "Jeito educado de recusar um convite."],
    ["¿Has visto esa serie?", "Você já viu aquela série?", "As bís-to ê-sa sê-rie?", "visto", null],
    ["Deberíamos salir más a menudo.", "Deveríamos sair mais vezes.", "De-be-rí-a-mos sa-lír más a me-nú-do.", "menudo", null],
    ["Fue genial ponernos al día.", "Foi ótimo colocar o papo em dia.", "Fuê rre-niál po-nêr-nos al dí-a.", "ponernos", null]
  ], [
    ["senderismo", "trilha", "sen-de-rís-mo"], ["invitación", "convite", "in-bi-ta-sión"], ["vida nocturna", "vida noturna", "bí-da nok-túr-na"]
  ]);

  /* ===================== Montagem ===================== */
  var lessons = { en: [], es: [] };
  Object.keys(RAW).forEach(function (lang) {
    var list = RAW[lang].slice();
    // ordem do currículo: nível -> situação
    list.sort(function (a, b) {
      var la = LEVELS.findIndex(function (l) { return l.key === a.level; });
      var lb = LEVELS.findIndex(function (l) { return l.key === b.level; });
      if (la !== lb) return la - lb;
      return TOPICS.findIndex(function (t) { return t.key === a.topic; }) - TOPICS.findIndex(function (t) { return t.key === b.topic; });
    });
    list.forEach(function (raw, idx) {
      var id = lang + "-" + raw.level + "-" + raw.topic;
      var items = [];
      raw.phrases.forEach(function (p, i) {
        items.push({ id: id + "-p" + i, lesson: id, lang: lang, kind: "p", o: p[0], p: p[1], r: p[2], b: p[3], n: p[4] });
      });
      raw.words.forEach(function (w, i) {
        items.push({ id: id + "-w" + i, lesson: id, lang: lang, kind: "w", o: w[0], p: w[1], r: w[2], b: null, n: null });
      });
      lessons[lang].push({ id: id, lang: lang, level: raw.level, topic: raw.topic, title: raw.title, index: idx, items: items });
    });
  });

  window.MPI_DATA = { LANGS: LANGS, LEVELS: LEVELS, TOPICS: TOPICS, lessons: lessons };
})();
