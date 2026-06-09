import { CaseData } from "../types";

export const case01: CaseData = {
  id: "ultimo-trem-madrugada",
  title: "O Último Trem da Madrugada",
  intro:
    "Chovia como se a cidade tentasse lavar os próprios pecados. Às 00h17, um corpo foi encontrado no terceiro andar do Edifício Santa Cecília. A polícia chamou de execução. Mas execuções não costumam trancar portas por dentro.",
  initialLocationId: "fachada-santa-cecilia",
  locations: {
    "fachada-santa-cecilia": {
      id: "fachada-santa-cecilia",
      name: "Fachada do Edifício Santa Cecília",
      image: "/assets/images/locations/fachada-santa-cecilia.png",
      summary:
        "A fachada estreita parece encolher sob a chuva. O letreiro falha como uma testemunha nervosa.",
      initialUnlocked: true,
      hotspots: [
        {
          id: "fachada-letreiro",
          label: "Letreiro",
          x: 10,
          y: 8,
          width: 16,
          height: 19,
          description:
            "Santa Cecília. Um prédio velho demais para segredos novos, mas ainda assim cheio deles.",
        },
        {
          id: "fachada-entrada",
          label: "Entrada",
          x: 42,
          y: 38,
          width: 11,
          height: 36,
          description:
            "Você atravessa a porta do Santa Cecília e chega à recepção. A chuva fica para trás, mas o cheiro de problema entra junto.",
          targetLocationId: "recepcao-predio",
          effects: {
            unlockLocations: ["recepcao-predio"],
          },
        },
        {
          id: "fachada-carro",
          label: "Carro do investigador",
          x: 79,
          y: 56,
          width: 14,
          height: 21,
          description:
            "O carro espera junto ao meio-fio. Pela cidade, outros endereços começam a se ligar ao caso.",
          destinationLocationIds: [
            "casa-clara-marconi",
            "clube-lua-azul",
            "sala-policial",
          ],
        },
      ],
    },
    "corredor-terceiro-andar": {
      id: "corredor-terceiro-andar",
      name: "Corredor do terceiro andar",
      image: "/assets/images/locations/corredor-terceiro-andar.png",
      summary:
        "O corredor tem papel de parede descascado, lâmpadas cansadas e cheiro de chuva trazida nos casacos.",
      hotspots: [
        {
          id: "corredor-descer-recepcao",
          label: "Descer para a recepção",
          x: 0,
          y: 13,
          width: 14,
          height: 57,
          description:
            "A escadaria desce até a recepção. O som da chuva cresce a cada lance.",
          targetLocationId: "recepcao-predio",
          effects: {
            unlockLocations: ["recepcao-predio"],
          },
        },
        {
          id: "corredor-porta-32",
          label: "Porta do apartamento 32",
          x: 29,
          y: 7,
          width: 8,
          height: 55,
          description:
            "A porta do 32 está fechada, mas a luz embaixo dela indica que alguém está acordado.",
          targetLocationId: "apartamento-dona-celia",
          requiresFlags: ["guarda_briefing"],
        },
        {
          id: "corredor-porta-31",
          label: "Porta do apartamento 31",
          x: 62.5,
          y: 7,
          width: 13.5,
          height: 75,
          description:
            "A porta do 31 range como se soubesse que vai ser lembrada. O apartamento de Álvaro está logo depois dela.",
          targetLocationId: "apartamento-vitima",
          effects: {
            unlockLocations: ["apartamento-vitima"],
          },
          requiresFlags: ["guarda_briefing"],
        },
        {
          id: "corredor-tapete",
          label: "Tapete",
          x: 48,
          y: 77,
          width: 18,
          height: 13,
          description:
            "Debaixo do tapete há uma chave reserva. Conveniente demais para um prédio cheio de portas trancadas.",
          clueId: "chave_reserva",
        },
        {
          id: "corredor-fechadura",
          label: "Fechadura",
          x: 68,
          y: 26,
          width: 5,
          height: 25,
          description:
            "A fechadura tem arranhões antigos, mas nada indica arrombamento recente.",
          clueId: "fechadura_arranhoes",
        },
        {
          id: "corredor-perfume",
          label: "Perfume",
          x: 66,
          y: 72,
          width: 16,
          height: 11,
          description:
            "Uma mancha úmida no assoalho exala perfume doce. Não combina com o cheiro de pólvora do apartamento.",
          clueId: "perfume_corredor",
          requiresFlags: ["mulher_misteriosa"],
        },
      ],
    },
    "apartamento-vitima": {
      id: "apartamento-vitima",
      name: "Apartamento da vítima",
      image: "/assets/images/locations/apartamento-vitima.png",
      summary:
        "A entrada do apartamento está limpa demais. A porta parece mais testemunha do que obstáculo.",
      hotspots: [
        {
          id: "apartamento-voltar-corredor",
          label: "Voltar para o corredor",
          x: 18.5,
          y: 6,
          width: 22,
          height: 70,
          description:
            "Você deixa o apartamento por um instante. O corredor parece ouvir junto.",
          targetLocationId: "corredor-terceiro-andar",
        },
        {
          id: "apartamento-entrada-sala",
          label: "Entrar na sala",
          x: 67,
          y: 14,
          width: 18,
          height: 67,
          description:
            "Você passa pela entrada e chega à sala onde a noite foi montada como teatro.",
          targetLocationId: "sala-vitima",
          effects: {
            unlockLocations: ["sala-vitima"],
          },
        },
        {
          id: "apartamento-porta",
          label: "Porta",
          x: 31,
          y: 10,
          width: 9,
          height: 45,
          description:
            "A porta foi trancada por fora depois do crime. Quem saiu sabia exatamente o que estava fazendo.",
          requiresClues: ["chave_reserva", "fechadura_arranhoes"],
        },
        {
          id: "apartamento-sapatos",
          label: "Sapatos",
          x: 70,
          y: 76,
          width: 11,
          height: 12,
          description:
            "Os sapatos de Álvaro estão limpos. Estranho para um homem que teria encarado uma fuga pela janela.",
          clueId: "sapatos_limpos",
        },
      ],
    },
    "sala-vitima": {
      id: "sala-vitima",
      name: "Sala da vítima",
      image: "/assets/images/locations/sala-vitima.png",
      summary:
        "A sala está montada como uma fotografia de jornal: copos, fumaça fria, janela aberta e um relógio parado.",
      hotspots: [
        {
          id: "sala-voltar-apartamento",
          label: "Voltar para a entrada",
          x: 0,
          y: 15,
          width: 8,
          height: 60,
          description:
            "Você volta para a entrada do apartamento. A porta continua parecendo uma resposta incompleta.",
          targetLocationId: "apartamento-vitima",
        },
        {
          id: "sala-ir-quarto",
          label: "Ir para o quarto",
          x: 51,
          y: 17,
          width: 7,
          height: 42,
          description:
            "O quarto de Álvaro fica além da porta escura. Se ele planejava fugir, alguma coisa deve ter ficado para trás.",
          targetLocationId: "quarto-vitima",
          requiresClues: ["cofre_vazio"],
        },
        {
          id: "sala-ir-cozinha",
          label: "Ir para a cozinha",
          x: 40,
          y: 10,
          width: 7,
          height: 38,
          description:
            "A cozinha guarda o tipo de sujeira que alguém esquece quando limpa uma cena depressa.",
          targetLocationId: "cozinha",
          requiresClues: ["cofre_vazio"],
        },
        {
          id: "sala-mesa",
          label: "Mesa",
          x: 33,
          y: 65,
          width: 14,
          height: 15,
          description:
            "Dois copos na mesa. Um deles ainda tem uma meia-lua de batom na borda.",
          clueId: "dois_copos",
        },
        {
          id: "sala-cinzeiro",
          label: "Cinzeiro",
          x: 45,
          y: 66,
          width: 9,
          height: 12,
          description:
            "Três tipos de cigarro no cinzeiro. Um barato, um com batom e um importado.",
          clueId: "cinzeiro_tres_cigarros",
        },
        {
          id: "sala-batom",
          label: "Batom",
          x: 51,
          y: 76,
          width: 6,
          height: 6,
          description:
            "O cigarro tem uma marca de batom escuro. A mulher misteriosa deixou algo além de perfume.",
          clueId: "cigarro_batom",
          requiresClues: ["cinzeiro_tres_cigarros"],
        },
        {
          id: "sala-importado",
          label: "Importado",
          x: 44,
          y: 77,
          width: 6,
          height: 6,
          description:
            "O cigarro importado é caro. Coisa de gente que gosta de deixar medo no ar.",
          clueId: "cigarro_importado",
          requiresClues: ["cinzeiro_tres_cigarros"],
        },
        {
          id: "sala-relogio",
          label: "Relógio",
          x: 31,
          y: 11,
          width: 5,
          height: 27,
          description:
            "Parado às 23h40. O vidro quebrou para fora, não para dentro. Isso não foi acidente.",
          clueId: "relogio_quebrado",
        },
        {
          id: "sala-janela",
          label: "Janela",
          x: 66,
          y: 4,
          width: 18,
          height: 55,
          description:
            "A janela está aberta e a chuva entra de lado. A moldura tem lama, mas a cena parece forçada.",
          effects: {
            unlockLocations: ["escada-incendio"],
          },
          targetLocationId: "escada-incendio",
        },
        {
          id: "sala-lama",
          label: "Lama",
          x: 67,
          y: 67,
          width: 8,
          height: 8,
          description:
            "Há lama perto da janela, mas pouca. Estranho para alguém que teria fugido correndo.",
          clueId: "lama_janela",
          requiresClues: ["janela_aberta"],
        },
        {
          id: "sala-quadro",
          label: "Quadro",
          x: 6,
          y: 15,
          width: 15,
          height: 25,
          description:
            "O quadro está torto demais para ser acaso. Atrás dele, uma parede não muito honesta.",
          clueId: "quadro_torto",
        },
        {
          id: "sala-cofre",
          label: "Cofre",
          x: 23,
          y: 25,
          width: 4,
          height: 22,
          description:
            "Um cofre vazio atrás do quadro. O dinheiro saiu antes da polícia entrar.",
          clueId: "cofre_vazio",
          requiresClues: ["quadro_torto"],
        },
      ],
    },
    "quarto-vitima": {
      id: "quarto-vitima",
      name: "Quarto da vítima",
      image: "/assets/images/locations/quarto-vitima.png",
      summary:
        "O quarto tem cheiro de pressa. Algumas roupas foram dobradas, outras abandonadas.",
      hotspots: [
        {
          id: "quarto-voltar-sala",
          label: "Voltar para a sala",
          x: 2,
          y: 12,
          width: 15,
          height: 45,
          description:
            "Você volta para a sala. O relógio parado continua marcando a mentira.",
          targetLocationId: "sala-vitima",
        },
        {
          id: "quarto-mala",
          label: "Mala",
          x: 10,
          y: 48,
          width: 32,
          height: 35,
          description:
            "A mala estava parcialmente arrumada. Álvaro planejava sair antes do sol.",
          clueId: "mala_arrumada",
        },
        {
          id: "quarto-bilhete",
          label: "Bilhete",
          x: 71,
          y: 39,
          width: 11,
          height: 12,
          description:
            "O bilhete rasgado diz: '...não esqueça a chave. Depois do último trem.'",
          clueId: "bilhete_ultimo_trem",
        },
        {
          id: "quarto-foto",
          label: "Foto",
          x: 72,
          y: 52,
          width: 9,
          height: 12,
          description:
            "Uma fotografia escondida mostra uma mulher com o rosto riscado com raiva.",
          clueId: "fotografia_riscada",
        },
      ],
    },
    cozinha: {
      id: "cozinha",
      name: "Cozinha da vítima",
      image: "/assets/images/locations/cozinha.png",
      summary:
        "A cozinha é pequena, amarelada e metódica. Alguém limpou parte da noite, mas não toda.",
      hotspots: [
        {
          id: "cozinha-voltar-sala",
          label: "Voltar para a sala",
          x: 0,
          y: 18,
          width: 7,
          height: 46,
          description:
            "Você deixa a cozinha e retorna à sala, levando o cheiro de café e pólvora na cabeça.",
          targetLocationId: "sala-vitima",
        },
        {
          id: "cozinha-xicara",
          label: "Xícara",
          x: 22,
          y: 62,
          width: 12,
          height: 16,
          description:
            "A xícara tem uma borra de café incomumente grossa. O preparo pode ajudar a identificar quem esteve na cozinha.",
          clueId: "xicara_borra",
        },
        {
          id: "cozinha-pano",
          label: "Pano",
          x: 52,
          y: 39,
          width: 17,
          height: 13,
          description:
            "Um pano úmido tem cheiro de pólvora. Quem limpou a arma não foi cuidadoso o bastante.",
          clueId: "pano_polvora",
        },
      ],
    },
    "escada-incendio": {
      id: "escada-incendio",
      name: "Escada de incêndio",
      image: "/assets/images/locations/escada-incendio.png",
      summary:
        "A escada geme com a chuva, mas não com passos recentes. A mentira enferrujou menos que o metal.",
      entryClueId: "janela_aberta",
      hotspots: [
        {
          id: "escada-voltar-sala",
          label: "Voltar para a sala",
          x: 8,
          y: 4,
          width: 17,
          height: 49,
          description:
            "Você volta pela janela. A escada parece menos saída do que desculpa.",
          targetLocationId: "sala-vitima",
        },
        {
          id: "escada-lama",
          label: "Lama",
          x: 31,
          y: 60,
          width: 19,
          height: 13,
          description:
            "A lama parece aplicada, quase teatral. Não há marcas consistentes de subida ou descida.",
          clueId: "lama_artificial",
        },
        {
          id: "escada-ferrugem",
          label: "Ferrugem",
          x: 37,
          y: 17,
          width: 24,
          height: 33,
          description:
            "A ferrugem dos degraus está intacta. Ninguém correu por aqui naquela chuva.",
          clueId: "ferrugem_intacta",
        },
        {
          id: "escada-botao",
          label: "Botão",
          x: 72,
          y: 39,
          width: 7,
          height: 8,
          description:
            "Um botão preso na grade. Parece prova demais para um criminoso apressado.",
          clueId: "botao_grade",
        },
      ],
    },
    "apartamento-dona-celia": {
      id: "apartamento-dona-celia",
      name: "Apartamento de Dona Célia",
      image: "/assets/images/locations/apartamento-dona-celia.png",
      summary:
        "O apartamento cheira a naftalina, café fraco e medo de falar demais.",
      hotspots: [
        {
          id: "celia-voltar-corredor",
          label: "Voltar para o corredor",
          x: 0,
          y: 20,
          width: 7,
          height: 45,
          description:
            "Você deixa Dona Célia com o rádio baixo e volta para o corredor.",
          targetLocationId: "corredor-terceiro-andar",
        },
        {
          id: "celia-radio",
          label: "Rádio",
          x: 83,
          y: 48,
          width: 14,
          height: 20,
          description:
            "O rádio estava baixo quando ela ouviu a discussão. Dona Célia lembra mais do que gostaria.",
        },
      ],
    },
    "apartamento-elias": {
      id: "apartamento-elias",
      name: "Apartamento de Elias",
      image: "/assets/images/locations/apartamento-elias.png",
      summary:
        "Relógios cobrem as paredes. Cada tic-tac parece medir uma culpa diferente.",
      hotspots: [
        {
          id: "elias-sair-recepcao",
          label: "Sair para a recepção",
          x: 91,
          y: 13,
          width: 9,
          height: 68,
          description:
            "Você deixa o apartamento de Elias e retorna ao saguão do prédio.",
          targetLocationId: "recepcao-predio",
        },
        {
          id: "elias-bancada",
          label: "Bancada",
          x: 27,
          y: 39,
          width: 31,
          height: 24,
          description:
            "A bancada de relojoeiro tem ferramentas finas. Elias poderia manipular um relógio quebrado sem esforço.",
          clueId: "profissao_elias",
        },
        {
          id: "elias-cafe",
          label: "Café",
          x: 16,
          y: 67,
          width: 12,
          height: 17,
          description:
            "O café dele é forte, grosso e deixa a mesma borra encontrada na cozinha de Álvaro.",
          requiresClues: ["xicara_borra"],
        },
      ],
    },
    "clube-lua-azul": {
      id: "clube-lua-azul",
      name: "Clube Lua Azul",
      image: "/assets/images/locations/clube-lua-azul.png",
      summary:
        "O palco é azul, a fumaça é espessa e ninguém ali canta de graça.",
      hotspots: [
        {
          id: "clube-saida",
          label: "Sair do clube",
          x: 78,
          y: 17,
          width: 8,
          height: 45,
          description:
            "Você atravessa a porta do Lua Azul e volta para o carro, deixando a música abafada pela chuva.",
          targetLocationId: "fachada-santa-cecilia",
        },
        {
          id: "clube-fosforos",
          label: "Fósforos",
          x: 47,
          y: 79,
          width: 7,
          height: 7,
          description:
            "Uma caixa de fósforos do Clube Lua Azul. O mesmo nome sussurrado por Clara.",
          clueId: "fosforos_lua_azul",
        },
      ],
    },
    "recepcao-predio": {
      id: "recepcao-predio",
      name: "Recepção do prédio",
      image: "/assets/images/locations/recepcao-predio.png",
      summary:
        "O balcão guarda um quadro de chaves e a sensação de que todo mundo já mentiu aqui.",
      hotspots: [
        {
          id: "recepcao-sair-fachada",
          label: "Sair para a fachada",
          x: 70,
          y: 11,
          width: 21,
          height: 53,
          description:
            "As portas de vidro devolvem você à calçada molhada do Santa Cecília.",
          targetLocationId: "fachada-santa-cecilia",
        },
        {
          id: "recepcao-subir-corredor",
          label: "Subir para o terceiro andar",
          x: 40,
          y: 6,
          width: 8,
          height: 49,
          description:
            "A escadaria estreita leva ao terceiro andar e ao apartamento de Álvaro.",
          targetLocationId: "corredor-terceiro-andar",
          requiresFlags: ["guarda_briefing"],
        },
        {
          id: "recepcao-ir-elias",
          label: "Caixas de correio — Apartamento de Elias",
          x: 89,
          y: 19,
          width: 11,
          height: 39,
          description:
            "A caixa de correio revela o número do apartamento de Elias. Você segue pelo corredor do andar de baixo até a porta dele.",
          targetLocationId: "apartamento-elias",
          alwaysVisible: true,
          effects: {
            unlockLocations: ["apartamento-elias"],
          },
          requiresFlags: ["historia_irmao_elias"],
        },
        {
          id: "recepcao-chaves",
          label: "Chaves",
          x: 5,
          y: 6,
          width: 29,
          height: 39,
          description:
            "Helena mantém chaves demais para alguém que jura não abrir portas alheias.",
          requiresClues: ["chave_reserva"],
          requiresFlags: ["celia_citou_helena_chaves"],
        },
      ],
    },
    "casa-clara-marconi": {
      id: "casa-clara-marconi",
      name: "Casa de Clara Marconi",
      image: "/assets/images/locations/casa-clara-marconi.png",
      summary:
        "A casa de Clara tem móveis simples e um silêncio que só família reconhece.",
      hotspots: [
        {
          id: "clara-saida",
          label: "Sair da casa de Clara",
          x: 0,
          y: 10,
          width: 8,
          height: 62,
          description:
            "Você se despede de Clara e retorna ao carro sob a chuva.",
          targetLocationId: "fachada-santa-cecilia",
        },
        {
          id: "clara-retrato",
          label: "Retrato",
          x: 61,
          y: 46,
          width: 14,
          height: 18,
          description:
            "Um retrato antigo dos irmãos Marconi. Clara olha para a foto como quem já perdeu Álvaro antes.",
        },
      ],
    },
    "sala-policial": {
      id: "sala-policial",
      name: "Sala do investigador policial",
      image: "/assets/images/locations/sala-policial.png",
      summary:
        "A sala policial é fumaça, arquivo e pressa. O caso pode ser fechado ali, certo ou não.",
      hotspots: [
        {
          id: "policia-saida",
          label: "Sair da delegacia",
          x: 92,
          y: 10,
          width: 8,
          height: 63,
          description:
            "Você deixa os arquivos e retorna ao Santa Cecília para conferir o que ainda não encaixa.",
          targetLocationId: "fachada-santa-cecilia",
        },
        {
          id: "policia-arquivo",
          label: "Arquivo",
          x: 31,
          y: 23,
          width: 14,
          height: 26,
          description:
            "O arquivo confirma: Vicente é violento, mas matar Álvaro antes de achar o dinheiro não fazia sentido.",
        },
      ],
    },
  },
  clues: {
    dois_copos: {
      id: "dois_copos",
      name: "Dois copos na mesa",
      short: "Álvaro recebeu alguém antes de morrer.",
      detail:
        "Dois copos foram usados. A polícia pensou em visita casual, mas a noite tinha pressa demais para casualidade.",
      locationId: "sala-vitima",
      relevance: "media",
    },
    cinzeiro_tres_cigarros: {
      id: "cinzeiro_tres_cigarros",
      name: "Cinzeiro com três tipos de cigarro",
      short: "Havia mais de um visitante ou alguém tentando sugerir isso.",
      detail:
        "Um cigarro barato, um com batom e um importado. A cena aponta para gente demais.",
      locationId: "sala-vitima",
      relevance: "media",
    },
    cigarro_batom: {
      id: "cigarro_batom",
      name: "Cigarro com marca de batom",
      short: "Uma mulher esteve na sala.",
      detail:
        "A marca escura de batom confirma que uma mulher fumou na sala, mas ainda não revela quem ela era.",
      textVariants: [
        {
          detail:
            "O batom combina com o relato de Dona Célia sobre voz feminina, salto alto e perfume no corredor.",
          requiresFlags: ["mulher_misteriosa"],
        },
      ],
      locationId: "sala-vitima",
      relevance: "alta",
      effects: {
        discoverCharacters: ["mulher-misteriosa"],
        addFlags: ["batom_na_cena"],
      },
    },
    cigarro_importado: {
      id: "cigarro_importado",
      name: "Cigarro importado",
      short: "Um fumante de gosto caro passou pela sala.",
      detail:
        "O papel, o filtro e o tabaco são caros. Sem um relato ou confronto, não há como atribuí-lo a alguém.",
      textVariants: [
        {
          detail:
            "O policial associa cigarros caros a Vicente Garza. Pode ser dele ou uma pista conveniente demais.",
          requiresFlags: ["guarda_citou_vicente"],
        },
      ],
      locationId: "sala-vitima",
      relevance: "media",
      effects: {
        addFlags: ["cigarro_importado"],
      },
    },
    quadro_torto: {
      id: "quadro_torto",
      name: "Quadro torto",
      short: "Alguém mexeu na parede da sala.",
      detail:
        "O quadro foi deslocado sem cuidado. Atrás dele havia um segredo mais vazio que escondido.",
      locationId: "sala-vitima",
      relevance: "media",
    },
    cofre_vazio: {
      id: "cofre_vazio",
      name: "Cofre vazio atrás do quadro",
      short: "O dinheiro de Álvaro desapareceu.",
      detail:
        "O cofre está aberto e vazio. Quem matou ou quem visitou Álvaro sabia que havia dinheiro ali.",
      locationId: "sala-vitima",
      relevance: "alta",
      effects: {
        addFlags: ["cofre_vazio"],
        unlockLocations: ["quarto-vitima", "cozinha"],
      },
    },
    relogio_quebrado: {
      id: "relogio_quebrado",
      name: "Relógio quebrado marcando 23h40",
      short: "A hora da morte pode ter sido encenada.",
      detail:
        "O relógio parou às 23h40, mas o vidro quebrou para fora. Um relojoeiro perceberia a diferença.",
      locationId: "sala-vitima",
      relevance: "decisiva",
      effects: {
        addContradictions: ["O relógio quebrado pode ter sido manipulado."],
      },
    },
    janela_aberta: {
      id: "janela_aberta",
      name: "Janela aberta",
      short: "A fuga pela janela parece possível.",
      detail:
        "A janela aberta sustenta a versão policial, mas a chuva e as marcas não contam a mesma história.",
      locationId: "sala-vitima",
      relevance: "media",
      effects: {
        unlockLocations: ["escada-incendio"],
      },
    },
    lama_janela: {
      id: "lama_janela",
      name: "Lama perto da janela",
      short: "Há lama demais para acaso e pouca demais para fuga.",
      detail:
        "A lama foi deixada no lugar certo, mas não na quantidade certa. Parece cenário, não rastro.",
      locationId: "sala-vitima",
      relevance: "alta",
    },
    chave_reserva: {
      id: "chave_reserva",
      name: "Chave reserva sob o tapete",
      short: "A porta trancada não impede quem conhece o prédio.",
      detail:
        "A chave estava escondida no corredor. Quem conhecia a rotina do prédio podia entrar e sair sem arrombar nada.",
      locationId: "corredor-terceiro-andar",
      relevance: "decisiva",
      effects: {
        unlockLocations: ["recepcao-predio"],
        addContradictions: ["A porta não foi arrombada."],
      },
    },
    fechadura_arranhoes: {
      id: "fechadura_arranhoes",
      name: "Fechadura com arranhões antigos",
      short: "Não há arrombamento recente.",
      detail:
        "Os riscos são velhos. A versão de invasão forçada perdeu força no mesmo instante.",
      locationId: "corredor-terceiro-andar",
      relevance: "alta",
      effects: {
        addContradictions: ["A porta não foi arrombada."],
      },
    },
    perfume_corredor: {
      id: "perfume_corredor",
      name: "Mancha de perfume no corredor",
      short: "O perfume confirma a presença feminina.",
      detail:
        "O perfume doce fica perto da porta de Álvaro e reforça o relato sobre uma visitante, mas ainda não identifica a mulher.",
      textVariants: [
        {
          detail:
            "Depois de admitir a visita, Rosa Valente passa a ser a ligação mais direta com o perfume deixado no corredor.",
          requiresFlags: ["rosa_admitiu_visita"],
        },
      ],
      locationId: "corredor-terceiro-andar",
      relevance: "media",
    },
    mala_arrumada: {
      id: "mala_arrumada",
      name: "Mala parcialmente arrumada",
      short: "Álvaro planejava fugir.",
      detail:
        "Roupas, dinheiro faltando e pressa. Álvaro queria sair da cidade antes de alguém acertar as contas.",
      locationId: "quarto-vitima",
      relevance: "alta",
      effects: {
        addFlags: ["alvaro_fugiria"],
      },
    },
    bilhete_ultimo_trem: {
      id: "bilhete_ultimo_trem",
      name: "Bilhete rasgado",
      short: "'...não esqueça a chave. Depois do último trem.'",
      detail:
        "A frase amarra chave, horário e fuga. O último trem vira mais que ruído de fundo.",
      locationId: "quarto-vitima",
      relevance: "decisiva",
      effects: {
        addFlags: ["ultimo_trem"],
      },
    },
    fotografia_riscada: {
      id: "fotografia_riscada",
      name: "Fotografia escondida com rosto feminino riscado",
      short: "Álvaro guardava uma mulher em segredo.",
      detail:
        "O rosto riscado sugere amor, chantagem ou os dois. No noir, quase sempre são os dois.",
      locationId: "quarto-vitima",
      relevance: "media",
    },
    fosforos_lua_azul: {
      id: "fosforos_lua_azul",
      name: "Fósforos do Clube Lua Azul",
      short: "O clube se conecta à vítima.",
      detail:
        "A caixa liga Álvaro ao Clube Lua Azul, mas não diz com quem ele se encontrava ali.",
      textVariants: [
        {
          detail:
            "Depois do relato de Clara, os fósforos encurtam o caminho entre Álvaro e Rosa Valente.",
          requiresFlags: ["clara_revelou_vicente_rosa"],
        },
      ],
      locationId: "clube-lua-azul",
      relevance: "media",
    },
    lama_artificial: {
      id: "lama_artificial",
      name: "Lama artificial na escada",
      short: "A escada de incêndio foi encenada.",
      detail:
        "A lama não marca degraus, só pontos convenientes. Foi plantada para vender uma fuga falsa.",
      locationId: "escada-incendio",
      relevance: "decisiva",
      effects: {
        addContradictions: ["A lama da janela não combina com uma fuga real."],
        addFlags: ["lama_artificial"],
      },
    },
    ferrugem_intacta: {
      id: "ferrugem_intacta",
      name: "Ferrugem intacta nos degraus",
      short: "Ninguém desceu pela escada naquela noite.",
      detail:
        "A ferrugem continuou inteira nos degraus. Uma fuga real deixaria a escada marcada.",
      locationId: "escada-incendio",
      relevance: "decisiva",
      effects: {
        addContradictions: ["A escada de incêndio parece encenada."],
        addFlags: ["ferrugem_intacta"],
      },
    },
    botao_grade: {
      id: "botao_grade",
      name: "Botão preso na grade da escada",
      short: "Uma pista plantada com pouca sutileza.",
      detail:
        "O botão parece deslocado demais para ser descuido. O assassino queria uma trilha óbvia.",
      locationId: "escada-incendio",
      relevance: "media",
    },
    xicara_borra: {
      id: "xicara_borra",
      name: "Xícara de café com borra grossa",
      short: "O preparo incomum pode identificar uma visita.",
      detail:
        "A borra é mais grossa do que a de um café comum. Ainda falta comparar o preparo com alguém do prédio.",
      textVariants: [
        {
          short: "A borra combina com o café de Elias.",
          detail:
            "Confrontado com a xícara, Elias Moretti reconhece o preparo, mas nega ter levado café ao apartamento.",
          requiresFlags: ["elias_reagiu_cafe"],
        },
      ],
      locationId: "cozinha",
      relevance: "alta",
      effects: {
        addFlags: ["cafe_elias"],
      },
    },
    pano_polvora: {
      id: "pano_polvora",
      name: "Pano úmido com cheiro de pólvora",
      short: "A arma foi limpa às pressas.",
      detail:
        "O pano tinha pólvora e água demais. Alguém limpou vestígios sem sair do prédio.",
      locationId: "cozinha",
      relevance: "alta",
      effects: {
        addFlags: ["pano_polvora"],
      },
    },
    sapatos_limpos: {
      id: "sapatos_limpos",
      name: "Sapatos limpos da vítima",
      short: "Álvaro não correu pela janela.",
      detail:
        "Os sapatos limpos sabotam a ideia de luta, fuga ou perseguição pela escada chuvosa.",
      locationId: "apartamento-vitima",
      relevance: "media",
    },
    profissao_elias: {
      id: "profissao_elias",
      name: "Profissão de Elias como relojoeiro",
      short: "Elias poderia manipular o relógio.",
      detail:
        "Entre todas as pessoas do prédio, Elias é o único que trataria um relógio quebrado como linguagem.",
      locationId: "apartamento-elias",
      relevance: "decisiva",
      effects: {
        addContradictions: [
          "O assassino provavelmente conhecia a rotina do prédio.",
        ],
      },
    },
  },
  characters: {
    "guarda-policial": {
      id: "guarda-policial",
      name: "Guarda da polícia",
      role: "Policial na entrada",
      description:
        "Capa molhada, lanterna baixa e a paciência curta de quem passou a madrugada guardando uma porta.",
      image: "/assets/images/characters/policial-responsavel.png",
      locationId: "fachada-santa-cecilia",
      scenePosition: { x: 51, y: 49.5, width: 11.5, layer: 10 },
      initialDiscovered: true,
      dialogues: [
        {
          id: "guarda_briefing",
          text: "Me diga, o que aconteceu aqui?",
          response:
            "Às 00h17 chamaram a polícia para o terceiro andar. Álvaro Marconi apareceu morto no apartamento 31. Porta trancada, janela aberta, uma história fácil demais. Comece por quem está perto: Miguel está aqui na calçada, ao lado da entrada. Dona Célia mora no apartamento 32; entre no prédio, suba pela escada da recepção e procure a porta dela no corredor do terceiro andar. O policial responsável está dentro do apartamento 31. Eu procuraria pistas também. Gente assustada mente; objeto não ensaia.",
          effects: {
            discoverCharacters: [
              "alvaro-marconi",
              "dona-celia",
              "miguel",
              "policial-responsavel",
            ],
            unlockLocations: ["corredor-terceiro-andar", "apartamento-dona-celia"],
            addFlags: ["guarda_briefing"],
          },
        },
        {
          id: "guarda_cena",
          text: "A polícia já fechou uma versão?",
          response:
            "O delegado gosta de Vicente Garza para culpado. Capanga, dívida, cigarro caro. Serve bonito no relatório. Ele está retido na sala policial. Para encontrá-lo, volte à fachada, clique no carro do investigador e escolha a delegacia. Mas a porta trancada por dentro e a janela aberta estão brigando uma com a outra.",
          requiresFlags: ["guarda_briefing"],
          effects: {
            discoverCharacters: ["vicente-garza"],
            unlockLocations: ["sala-policial"],
            addFlags: ["guarda_citou_vicente"],
          },
        },
        {
          id: "guarda_testemunhas",
          text: "Quem devo ouvir primeiro?",
          response:
            "Você pode falar com Miguel, ele que está aqui do lado e me contou que ouviu um tiro. Sempre que você investigar alguma área e descobrir pistas novas, é bom voltar a falar com as testemunhas. Talvez você consiga confrontar elas com novas informações.",
          requiresFlags: ["guarda_briefing"],
          effects: {
            addFlags: ["guarda_listou_testemunhas", "guarda_listou_tiro"],
          },
        },
      ],
    },
    "policial-responsavel": {
      id: "policial-responsavel",
      name: "Policial responsável",
      role: "Responsável pela cena",
      description:
        "Sobretudo molhado, cansaço nos olhos e pressa de fechar o caso como execução de gangue.",
      image: "/assets/images/characters/policial-responsavel.png",
      locationId: "sala-vitima",
      scenePosition: { x: 50, y: 20, width: 18.5, flipX: false },
      dialogues: [
        {
          id: "policial-basico",
          text: "O que a polícia sabe?",
          response:
            "A vítima é Álvaro 'Bigode' Marconi. Cobrador de dívidas, apostas ilegais, inimigos demais. Porta trancada, janela aberta. Execução de gangue, se quiser minha opinião.",
          effects: {
            discoverCharacters: ["alvaro-marconi"],
            addFlags: ["policial_basico"],
          },
        },
        {
          id: "policial-cofre",
          text: "O cofre está vazio e a mala estava pronta.",
          response:
            "Então o Bigode ia fugir. Ele cobrava para gente ruim. A irmã, Clara Marconi, talvez saiba para onde ele queria ir. Para encontrá-la, saia do prédio até a fachada, clique no carro do investigador e escolha a casa de Clara.",
          requiresClues: ["cofre_vazio", "mala_arrumada"],
          effects: {
            discoverCharacters: ["clara-marconi"],
            unlockLocations: ["casa-clara-marconi"],
            addFlags: ["clara_desbloqueada"],
          },
        },
        {
          id: "policial-escada",
          text: "A escada de incêndio foi encenada.",
          response:
            "Se a janela é teatro, o assassino conhecia o prédio. Isso tira metade da cidade e coloca os vizinhos no palco.",
          requiresClues: ["ferrugem_intacta", "lama_artificial"],
          effects: {
            addContradictions: [
              "A escada de incêndio parece encenada.",
              "O assassino provavelmente conhecia a rotina do prédio.",
            ],
            addFlags: ["policial_aceita_escada_falsa"],
          },
        },
        {
          id: "policial-cena-preservada",
          text: "Quem entrou na cena antes de mim?",
          response:
            "Eu, dois homens da perícia e Helena Duarte, a senhoria. Ela fica na recepção do prédio. Para encontrá-la, volte ao corredor pela entrada do apartamento e desça a escada até o térreo. Ninguém assume ter mexido em nada. É sempre assim: todo mundo respeita a cena até a cena respeitar alguém de volta.",
          requiresFlags: ["guarda_briefing"],
          effects: {
            discoverCharacters: ["helena-duarte"],
            unlockLocations: ["recepcao-predio"],
            addFlags: ["policial_listou_entrada", "policial_indicou_helena"],
          },
        },
        {
          id: "policial-porta-janela",
          text: "Porta trancada e janela aberta não combinam.",
          response:
            "Também acho. Se alguém fugiu pela janela, deixou a porta explicar sozinha. Se saiu pela porta, a janela virou figurante com papel grande demais.",
          requiresClues: ["janela_aberta", "fechadura_arranhoes"],
          effects: {
            addContradictions: [
              "A janela aberta não explica a porta trancada sem arrombamento.",
            ],
            addFlags: ["policial_duvida_janela"],
          },
        },
      ],
    },
    "dona-celia": {
      id: "dona-celia",
      name: "Dona Célia",
      role: "Vizinha do lado",
      description:
        "Uma senhora de robe escuro e olhos atentos. Ela finge fragilidade, mas ouve como profissional.",
      image: "/assets/images/characters/dona-celia.png",
      locationId: "apartamento-dona-celia",
      scenePosition: { x: 20, y: 12, width: 22 },
      dialogues: [
        {
          id: "celia-mulher",
          text: "A senhora ouviu algo antes do crime?",
          response:
            "Uma discussão. Voz de mulher, salto alto, perfume caro. Eu não vi o rosto, mas o corredor ficou cheirando a pecado doce.",
          effects: {
            discoverCharacters: ["mulher-misteriosa"],
            addFlags: ["mulher_misteriosa"],
          },
        },
        {
          id: "celia-trem",
          text: "A senhora ouviu o tiro antes ou depois do trem?",
          response:
            "Depois. O trem passou fazendo aquele berro nos trilhos. Só então veio o estampido. Por isso esse relógio das 23h40 me incomoda.",
          requiresClues: ["relogio_quebrado", "bilhete_ultimo_trem"],
          effects: {
            addContradictions: [
              "O tiro foi ouvido depois do trem, mas o relógio marca antes.",
            ],
            addFlags: ["tiro_depois_trem"],
          },
        },
        {
          id: "celia-elias",
          text: "Quem mais conhecia a rotina do prédio?",
          response:
            "O vizinho de baixo, Elias. Homem educado, relojoeiro. O irmão dele se perdeu em dívida de jogo. Álvaro cobrava esse tipo de dívida. Para encontrá-lo, volte ao corredor, desça até a recepção e clique nas caixas de correio; elas indicam o apartamento dele no andar de baixo.",
          requiresClues: ["chave_reserva", "relogio_quebrado"],
          effects: {
            discoverCharacters: ["elias-moretti"],
            unlockLocations: ["apartamento-elias"],
            suspectStates: { "elias-moretti": "pessoa_de_interesse" },
            addFlags: ["historia_irmao_elias"],
          },
        },
        {
          id: "celia-porta",
          text: "A porta do apartamento fazia barulho?",
          response:
            "Fazia. Um gemido comprido. Naquela noite eu ouvi a porta uma vez antes do trem e outra depois. Quem saiu depois sabia andar sem pressa.",
          requiresFlags: ["mulher_misteriosa"],
          effects: {
            addContradictions: [
              "Alguém saiu do apartamento depois de uma primeira visita.",
            ],
            addFlags: ["celia_ouviu_duas_portas"],
          },
        },
        {
          id: "celia-helena",
          text: "Helena costuma guardar chaves?",
          response:
            "Helena guarda chave como padre guarda segredo. Diz que é para emergência. Neste prédio, emergência é só outro nome para curiosidade. Ela fica na recepção: saia do apartamento, volte ao corredor e desça pela escada até o térreo.",
          requiresClues: ["chave_reserva"],
          effects: {
            discoverCharacters: ["helena-duarte"],
            unlockLocations: ["recepcao-predio"],
            suspectStates: { "helena-duarte": "pessoa_de_interesse" },
            addFlags: ["celia_citou_helena_chaves"],
          },
        },
      ],
    },
    "miguel": {
      id: "miguel",
      name: "Miguel",
      role: "Vizinho do prédio em frente",
      description:
        "Um homem magro, molhado até os ossos, olhando tudo como quem se arrepende de ter visto.",
      image: "/assets/images/characters/miguel.png",
      locationId: "fachada-santa-cecilia",
      scenePosition: { x: 33, y: 55, width: 9.5 },
      initialDiscovered: true,
      dialogues: [
        {
          id: "miguel-vulto",
          text: "Me conte, o que você viu?",
          response:
            "Vi um vulto perto da janela. Ou achei que vi. Chovia muito. A gente completa o medo com a imaginação.",
          effects: {
            addFlags: ["vulto_escada"],
          },
        },
        {
          id: "miguel-recuo",
          text: "Tem certeza que viu alguém descendo a escada?",
          response:
            "Descendo, não. Agora que você fala... talvez só tenha aparecido perto da janela. Como se quisesse ser visto.",
          requiresClues: ["ferrugem_intacta", "lama_artificial"],
          effects: {
            addContradictions: ["A escada de incêndio parece encenada."],
            addFlags: ["miguel_recuou"],
          },
        },
        {
          id: "miguel-carro",
          text: "Alguém saiu do prédio depois do tiro?",
          response:
            "Um carro escuro ficou parado na esquina. Motor ligado, faróis apagados. Não vi quem entrou, mas vi a pressa que ficou no ar.",
          requiresFlags: ["guarda_briefing", "guarda_listou_tiro"],
          effects: {
            addFlags: ["miguel_viu_carro"],
          },
        },
        {
          id: "miguel-janela",
          text: "O vulto parecia fugir ou posar?",
          response:
            "Posar. Essa é a palavra. Ficou tempo demais perto da janela para alguém com medo. Eu devia ter dito isso antes.",
          requiresClues: ["janela_aberta"],
          effects: {
            addContradictions: ["O vulto na janela parecia querer ser visto."],
            addFlags: ["miguel_vulto_posado"],
          },
        },
      ],
    },
    "clara-marconi": {
      id: "clara-marconi",
      name: "Clara Marconi",
      role: "Irmã da vítima",
      description:
        "Clara fala de Álvaro como quem ama alguém que desaprendeu a ser amado.",
      image: "/assets/images/characters/clara-marconi.png",
      locationId: "casa-clara-marconi",
      scenePosition: { x: 26, y: 40, width: 10.5 },
      dialogues: [
        {
          id: "clara-revela",
          text: "Álvaro estava com medo?",
          response:
            "Ele falava de Vicente Garza, de Rosa Valente, a cantora do Lua Azul, e de um último trem. Também disse que tinha dinheiro escondido. Meu irmão era ruim, detetive, mas estava apavorado. Vicente está na sala policial e Rosa está no Clube Lua Azul. Para encontrar qualquer um deles, volte ao carro na fachada e escolha o destino correspondente.",
          effects: {
            discoverCharacters: ["vicente-garza", "rosa-valente"],
            unlockLocations: ["clube-lua-azul", "sala-policial"],
            suspectStates: {
              "vicente-garza": "suspeito",
              "rosa-valente": "mencionado",
            },
            addFlags: ["clara_revelou_vicente_rosa"],
          },
        },
        {
          id: "clara-dinheiro",
          text: "Que dinheiro era esse?",
          response:
            "Dinheiro de aposta, chantagem, cobrança. Álvaro dizia que se ele sumisse, metade da cidade respirava melhor e a outra metade procurava o cofre.",
          requiresClues: ["cofre_vazio"],
          effects: {
            addFlags: ["clara_explica_dinheiro"],
          },
        },
        {
          id: "clara-trem",
          text: "Por que o último trem importava?",
          response:
            "Ele marcou de fugir depois do último trem porque a rua ficava vazia e a estação engolia nomes. Mas Álvaro nunca conseguiu sair de si mesmo.",
          requiresClues: ["bilhete_ultimo_trem"],
          effects: {
            addFlags: ["clara_falou_trem"],
          },
        },
      ],
    },
    "rosa-valente": {
      id: "rosa-valente",
      name: "Rosa Valente",
      role: "Cantora do Clube Lua Azul",
      description:
        "Voz baixa, luvas pretas e uma reputação que ela protege como se fosse pele.",
      image: "/assets/images/characters/rosa-valente.png",
      locationId: "clube-lua-azul",
      scenePosition: { x: 40, y: 19, width: 11.5 },
      dialogues: [
        {
          id: "rosa-nega",
          text: "Você viu Álvaro naquela noite?",
          response:
            "Álvaro vinha ao clube. Muita gente vinha. Isso não faz de mim uma assassina nem de você um bom cliente.",
        },
        {
          id: "rosa-batom",
          text: "Encontramos um cigarro com batom no apartamento.",
          response:
            "Está bem. Eu fui lá. Discutimos por cartas. Saí antes do tiro. Se eu quisesse matar Álvaro, não deixaria meu batom fazendo pose no cinzeiro.",
          requiresClues: ["cigarro_batom"],
          effects: {
            suspectStates: { "rosa-valente": "suspeito" },
            addFlags: ["rosa_admitiu_visita"],
          },
        },
        {
          id: "rosa-pressionados",
          text: "Quem mais pressionava Álvaro?",
          response:
            "Vicente queria dinheiro. Helena queria o prédio quieto e o dinheiro escondido. Álvaro colecionava inimigos como outros colecionam discos. Vicente está na sala policial; volte à fachada, use o carro e escolha a delegacia. Helena fica na recepção do Santa Cecília; entre no prédio pela porta da frente.",
          requiresFlags: ["rosa_admitiu_visita"],
          effects: {
            discoverCharacters: ["helena-duarte"],
            unlockLocations: ["sala-policial", "recepcao-predio"],
            suspectStates: {
              "helena-duarte": "suspeito",
              "vicente-garza": "suspeito",
            },
            addFlags: ["rosa_citou_helena"],
          },
        },
        {
          id: "rosa-cartas",
          text: "Que cartas fizeram você procurar Álvaro?",
          response:
            "Cartas minhas. Cartas que ele comprou de alguém e queria vender de volta. Álvaro chamava chantagem de oportunidade.",
          requiresFlags: ["rosa_admitiu_visita"],
          effects: {
            addFlags: ["rosa_cartas_chantagem"],
          },
        },
        {
          id: "rosa-cigarro-importado",
          text: "O cigarro importado era seu?",
          response:
            "Não. Eu fumo barato quando estou nervosa e caro quando estou mentindo. Naquela noite eu não tinha dinheiro para nenhuma das duas coisas.",
          requiresClues: ["cigarro_importado"],
          effects: {
            addFlags: ["rosa_nega_importado"],
          },
        },
      ],
    },
    "vicente-garza": {
      id: "vicente-garza",
      name: "Vicente “Mão Fria” Garza",
      role: "Capanga ligado às apostas",
      description:
        "Casaco escuro, cigarro importado e mãos que parecem prometer dor antes de tocar em alguém.",
      image: "/assets/images/characters/vicente-garza.png",
      locationId: "sala-policial",
      scenePosition: {
        x: 70,
        y: 25,
        width: 11.5,
        flipX: true,
        clipBottom: 28,
      },
      dialogues: [
        {
          id: "vicente-bruto",
          text: "Você esteve perto do prédio?",
          response:
            "Estive. Ia cobrar o Bigode. Eu ia quebrar os dedos dele, detetive. Não gastar uma bala antes de saber onde estava o dinheiro.",
          requiresFlags: ["clara_revelou_vicente_rosa"],
          effects: {
            addFlags: ["vicente_admitiu_predio"],
          },
        },
        {
          id: "vicente-lama",
          text: "A lama da janela não combina com seus sapatos.",
          response:
            "Porque não é minha. Eu tenho pecados suficientes, não preciso calçar os dos outros.",
          requiresClues: ["lama_artificial", "ferrugem_intacta"],
          effects: {
            suspectStates: { "vicente-garza": "inocentado" },
            addFlags: ["vicente_lama_diferente"],
          },
        },
        {
          id: "vicente-dinheiro",
          text: "Você queria o dinheiro do cofre?",
          response:
            "Eu queria o dinheiro antes de Álvaro morrer. Depois dele morto, dinheiro escondido vira armadilha. Quem matou sabia onde procurar ou sabia que o cofre já estava vazio.",
          requiresClues: ["cofre_vazio"],
          effects: {
            addFlags: ["vicente_falou_cofre"],
          },
        },
        {
          id: "vicente-rosa",
          text: "Rosa Valente estava envolvida?",
          response:
            "Rosa tinha raiva, não plano. Ela arranha, detetive. Quem fez isso calculou cada rangido de porta. Se ainda quiser confrontá-la, volte ao carro diante do Santa Cecília e siga para o Clube Lua Azul.",
          requiresFlags: ["rosa_admitiu_visita"],
          effects: {
            addFlags: ["vicente_definiu_rosa"],
          },
        },
      ],
    },
    "helena-duarte": {
      id: "helena-duarte",
      name: "Helena Duarte",
      role: "Senhoria do prédio",
      description:
        "Elegância dura, olhar de inventário e a chave certa para portas erradas.",
      image: "/assets/images/characters/helena-duarte.png",
      locationId: "recepcao-predio",
      scenePosition: {
        x: 54,
        y: 25,
        width: 10.5,
        flipX: true,
        clipBottom: 20,
      },
      dialogues: [
        {
          id: "helena-chave",
          text: "Quem sabia da chave embaixo do tapete?",
          response:
            "Moradores antigos. Eu... também. Subi para falar com Álvaro, sim. Ele me chantageava. Mas quando saí, ele ainda respirava.",
          requiresClues: ["chave_reserva"],
          effects: {
            suspectStates: { "helena-duarte": "suspeito" },
            addFlags: ["helena_admitiu_subida"],
          },
        },
        {
          id: "helena-porta",
          text: "Então a porta trancada não prova invasão pela janela.",
          response:
            "Não. Prova apenas que alguém sabia sair parecendo sombra.",
          requiresClues: ["fechadura_arranhoes", "chave_reserva"],
          effects: {
            addContradictions: ["A porta não foi arrombada."],
          },
        },
        {
          id: "helena-chantagem",
          text: "Álvaro chantageava a senhora com o quê?",
          response:
            "Com recibos antigos. Aluguéis por fora, favores para gente errada. Nada que mereça sangue, mas o bastante para destruir uma viúva.",
          requiresFlags: ["helena_admitiu_subida"],
          effects: {
            addFlags: ["helena_motivo_chantagem"],
          },
        },
        {
          id: "helena-elias",
          text: "Elias costumava subir ao terceiro andar?",
          response:
            "Às vezes. Dizia que consertava relógio de morador. Homem educado demais faz barulho só quando quer. O apartamento dele fica no andar de baixo; aqui na recepção, clique nas caixas de correio para seguir até a porta.",
          requiresFlags: ["historia_irmao_elias"],
          effects: {
            addFlags: ["helena_viu_elias_subir"],
          },
        },
      ],
    },
    "elias-moretti": {
      id: "elias-moretti",
      name: "Elias Moretti",
      role: "Vizinho de baixo e relojoeiro",
      description:
        "Calmo, educado, melancólico. O tipo de homem que mede a dor em segundos.",
      image: "/assets/images/characters/elias-moretti.png",
      locationId: "apartamento-elias",
      scenePosition: {
        x: 67,
        y: 25,
        width: 11,
        flipX: true,
        clipBottom: 39,
      },
      dialogues: [
        {
          id: "elias-calmo",
          text: "Você conhecia Álvaro?",
          response:
            "Todos no prédio conheciam. Alguns por nome, outros por dívida. Eu preferia distância.",
          effects: {
            addFlags: ["elias_falou_alvaro"],
          },
        },
        {
          id: "elias-relogio",
          text: "O relógio da vítima foi quebrado numa hora conveniente demais.",
          response:
            "Relógios quebram, detetive. Homens também. A diferença é que relógios ainda podem ser consertados.",
          requiresClues: ["relogio_quebrado", "profissao_elias"],
          effects: {
            suspectStates: { "elias-moretti": "suspeito" },
            addFlags: ["elias_reagiu_relogio"],
          },
        },
        {
          id: "elias-irmao",
          text: "Seu irmão morreu por dívidas de jogo cobradas por Álvaro.",
          response:
            "Meu irmão puxou o gatilho. Álvaro só vendeu o desespero. É assim que a cidade absolve monstros.",
          requiresFlags: ["historia_irmao_elias"],
          effects: {
            addFlags: ["motivo_elias"],
            suspectStates: { "elias-moretti": "suspeito" },
          },
        },
        {
          id: "elias-cafe",
          text: "Encontrei café igual ao seu na cozinha de Álvaro.",
          response:
            "Meu café não é segredo. Metade do prédio pede quando falta coragem para dormir. Mas eu não subi com xícara nenhuma naquela noite.",
          requiresClues: ["xicara_borra"],
          effects: {
            addFlags: ["elias_reagiu_cafe"],
          },
        },
        {
          id: "elias-horario",
          text: "Dona Célia diz que o tiro veio depois do trem.",
          response:
            "Então alguém mentiu para o relógio. Relógio não mente sozinho, detetive. Ele só repete a mão que mexe nele. Se quiser confirmar o relato, Dona Célia continua no apartamento 32: volte à recepção, suba ao terceiro andar e entre na porta dela.",
          requiresFlags: ["tiro_depois_trem"],
          effects: {
            addContradictions: [
              "O relógio foi manipulado para deslocar a hora do tiro.",
            ],
            addFlags: ["elias_admitiu_relogio_pode_mentir"],
          },
        },
      ],
    },
    "alvaro-marconi": {
      id: "alvaro-marconi",
      name: "Álvaro “Bigode” Marconi",
      role: "Vítima",
      description:
        "Cobrador de dívidas. Vivo, era ameaça. Morto, virou mapa.",
      image: "/assets/images/characters/alvaro-marconi.png",
      locationId: "sala-vitima",
      dialogues: [],
    },
    "mulher-misteriosa": {
      id: "mulher-misteriosa",
      name: "Mulher misteriosa",
      role: "Pessoa mencionada",
      description:
        "Uma voz feminina, salto alto, perfume doce e rastros que levam ao Clube Lua Azul.",
      image: "/assets/images/characters/rosa-valente.png",
      locationId: "clube-lua-azul",
      dialogues: [],
    },
  },
  accusationSuspects: [
    { characterId: "rosa-valente", label: "Rosa Valente" },
    { characterId: "vicente-garza", label: "Vicente Garza" },
    { characterId: "helena-duarte", label: "Helena Duarte" },
    { characterId: "elias-moretti", label: "Elias Moretti" },
  ],
  decisiveEvidence: [
    "relogio_quebrado",
    "ferrugem_intacta",
    "lama_artificial",
    "chave_reserva",
    "xicara_borra",
    "profissao_elias",
  ],
};
