/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");

const promptsDir = path.resolve(
  __dirname,
  "..",
  "public",
  "assets",
  "prompts",
  "locations",
);

const baseStyle = `
Estilo visual obrigatório:
- noir detective game background, 1940s/1950s, rainy night, cinematic lighting, strong shadows, vintage crime scene, semi-realistic painted style, 16:9, high detail, muted colors, dark atmosphere.
- Paleta escura com marrom, preto, cinza molhado, sépia, amarelo gasto de lâmpada antiga e pequenos acentos de vermelho ou azul quando fizer sentido.
- Pintura semi-realista para visual novel investigativa, sem aparência cartunesca.
- Sem texto legível, sem letreiros legíveis, sem marcas d'água, sem UI, sem personagens principais em primeiro plano, sem gore.
- Composição precisa funcionar como imagem de fundo para hotspots clicáveis. Deixe os objetos importantes bem visíveis e separados.
- Enquadramento 16:9, câmera fixa, perspectiva levemente cinematográfica, com profundidade e sombras fortes.
`;

const prompts = {
  "fachada-santa-cecilia.txt": `
Imagem final para: Fachada do Edifício Santa Cecília.

Cena:
Fachada decadente de um prédio residencial antigo chamado Edifício Santa Cecília, em uma rua urbana perigosa dos anos 40/50 durante uma madrugada chuvosa. Calçada molhada refletindo luzes fracas, carros antigos desfocados ao fundo, fumaça de bueiro, janelas escuras, uma entrada estreita com marquise gasta e uma lâmpada piscando. O prédio deve parecer velho, úmido, cansado e cheio de segredos.

Composição para hotspots:
- Entrada principal visível na região central inferior.
- Letreiro ou placa do prédio sugerido na parte superior esquerda, mas sem texto legível.
- Janelas e chuva visíveis ao fundo.
- Área de calçada molhada no primeiro plano.

${baseStyle}
`,
  "corredor-terceiro-andar.txt": `
Imagem final para: Corredor velho do terceiro andar.

Cena:
Corredor estreito e decadente no terceiro andar de um prédio antigo. Papel de parede descascado, portas de madeira envelhecida, lâmpada fraca no teto, piso gasto, sombras compridas e atmosfera abafada. A porta do apartamento da vítima deve parecer importante. O corredor tem sensação de silêncio depois de uma discussão.

Composição para hotspots:
- Porta do apartamento em destaque no lado direito ou centro direito.
- Tapete pequeno diante da porta, visível no chão para a pista da chave reserva.
- Fechadura visível o bastante para investigação.
- Pequena mancha discreta no piso perto da porta para perfume no corredor.

${baseStyle}
`,
  "apartamento-vitima.txt": `
Imagem final para: Entrada do apartamento da vítima.

Cena:
Entrada de um apartamento antigo, sombrio e parcialmente iluminado pela luz do corredor. Porta de madeira pesada, fechadura antiga, paredes manchadas, cabideiro com casaco escuro, sapatos da vítima próximos à entrada e sombras projetadas pela chuva da janela de outro cômodo. Deve parecer que alguém entrou e saiu com calma.

Composição para hotspots:
- Porta e fechadura visíveis no centro ou centro esquerdo.
- Sapatos limpos da vítima no chão, separados e fáceis de notar.
- Caminho visual levando para a sala da vítima.
- Sem corpo explícito, sem gore.

${baseStyle}
`,
  "sala-vitima.txt": `
Imagem final para: Sala da vítima.

Cena:
Sala principal do apartamento de Álvaro Marconi, cenário central da investigação. Ambiente decadente com mesa baixa, dois copos usados, cinzeiro cheio, janela aberta com chuva entrando de lado, lama perto da janela, relógio quebrado na parede marcando 23h40 e quadro torto escondendo um cofre. Tudo deve parecer uma cena montada para enganar a polícia.

Composição para hotspots:
- Mesa com dois copos e cinzeiro na região central inferior.
- Cigarros distinguíveis o suficiente para sugerir tipos diferentes, sem texto.
- Janela aberta no lado direito, com chuva e lama perto dela.
- Relógio quebrado visível na parte superior ou parede central.
- Quadro torto no lado esquerdo com espaço para imaginar o cofre atrás.
- Objetos separados para hotspots não se sobreporem.

${baseStyle}
`,
  "quarto-vitima.txt": `
Imagem final para: Quarto da vítima.

Cena:
Quarto pequeno e bagunçado de um homem que planejava fugir. Cama desarrumada, mala parcialmente arrumada aberta sobre uma cadeira ou no chão, roupas dobradas pela metade, gaveta aberta, bilhete rasgado em uma superfície e fotografia antiga escondida parcialmente sob papéis. Luz amarelada de abajur e sombras de persiana.

Composição para hotspots:
- Mala aberta bem visível na parte inferior esquerda ou central.
- Bilhete rasgado em cima de mesa ou criado-mudo, destacado por luz.
- Fotografia escondida parcialmente visível perto da cama ou gaveta.
- Atmosfera de pressa, sem personagem em foco.

${baseStyle}
`,
  "cozinha.txt": `
Imagem final para: Cozinha pequena da vítima.

Cena:
Cozinha estreita e antiga, azulejos manchados, pia de metal, armário velho, luz fria misturada com lâmpada amarelada. Sobre a mesa ou balcão há uma xícara de café com borra grossa. Perto da pia, um pano úmido usado para limpar algo, com aparência suspeita. A cozinha deve parecer limpa às pressas, não naturalmente limpa.

Composição para hotspots:
- Xícara de café com borra bem visível no primeiro plano ou centro.
- Pano úmido perto da pia, separado da xícara.
- Pia e bancada no lado direito ou fundo.
- Superfícies escuras com reflexos discretos.

${baseStyle}
`,
  "escada-incendio.txt": `
Imagem final para: Escada de incêndio enferrujada.

Cena:
Escada de incêndio externa, velha e enferrujada, presa à lateral do prédio em noite de chuva. Metal escuro molhado, grades antigas, cidade desfocada ao fundo, luzes de janela e vapor. A cena deve sugerir que a fuga pela escada foi encenada. Degraus com ferrugem intacta e pouca lama artificial em pontos convenientes.

Composição para hotspots:
- Degraus enferrujados bem visíveis no centro.
- Lama artificial em um ponto do piso ou degrau inferior.
- Grade lateral com um botão preso visível em um ponto isolado.
- Profundidade vertical da escada, mas sem poluir os objetos clicáveis.

${baseStyle}
`,
  "apartamento-dona-celia.txt": `
Imagem final para: Apartamento de Dona Célia.

Cena:
Sala pequena e antiga de uma vizinha idosa, com poltrona gasta, rádio antigo, cortina pesada, mesa com xícara simples, crucifixo ou retratos de família sem rostos detalhados. A iluminação deve ser quente, fraca e doméstica, contrastando com a chuva fria do lado de fora. O ambiente deve sugerir alguém que ouviu demais atrás da parede.

Composição para hotspots:
- Rádio antigo visível em uma mesa lateral.
- Poltrona perto da parede compartilhada com o apartamento da vítima.
- Janela ou cortina com chuva ao fundo.
- Espaço vazio para personagem/dialogue overlay se necessário.

${baseStyle}
`,
  "apartamento-elias.txt": `
Imagem final para: Apartamento de Elias com bancada de relojoeiro.

Cena:
Apartamento silencioso de um relojoeiro melancólico. Bancada de trabalho com ferramentas pequenas, relógios desmontados, lupas, engrenagens, caixas de madeira, xícara de café forte com borra, paredes cobertas por relógios antigos. A atmosfera deve ser calma, precisa e inquietante, como se o tempo fosse uma obsessão.

Composição para hotspots:
- Bancada de relojoeiro em destaque no centro.
- Relógios na parede, alguns parados, alguns abertos.
- Xícara de café com borra em canto visível.
- Ferramentas finas separadas para leitura visual.
- Sem personagem em primeiro plano.

${baseStyle}
`,
  "clube-lua-azul.txt": `
Imagem final para: Clube Lua Azul.

Cena:
Clube noturno noir dos anos 40/50, palco pequeno com cortina pesada, microfone antigo, fumaça de cigarro, mesas redondas, copos, luz azul escura e amarela, atmosfera de jazz decadente. Deve sugerir que Rosa Valente se apresenta ali, mas sem colocar uma cantora claramente em primeiro plano. O clube deve parecer bonito e perigoso ao mesmo tempo.

Composição para hotspots:
- Palco e microfone no fundo central.
- Mesa com caixa de fósforos em primeiro plano ou centro inferior.
- Cortinas e fumaça criando profundidade.
- Luz azul discreta, sem neon moderno exagerado.

${baseStyle}
`,
  "recepcao-predio.txt": `
Imagem final para: Recepção decadente do prédio.

Cena:
Recepção antiga do Edifício Santa Cecília, balcão gasto, quadro de chaves na parede, livro de registros, lâmpada fraca, piso de madeira ou ladrilho gasto, sombras de grades e chuva refletida pela porta de entrada. O ambiente deve sugerir controle, segredos e acesso a apartamentos.

Composição para hotspots:
- Balcão na parte inferior ou centro.
- Quadro de chaves visível na parede, sem números legíveis.
- Livro de registros ou papéis sobre o balcão.
- Entrada chuvosa ao fundo.

${baseStyle}
`,
  "casa-clara-marconi.txt": `
Imagem final para: Casa simples de Clara Marconi.

Cena:
Casa humilde e silenciosa de Clara Marconi. Mesa simples, fotografias antigas de família, toalha gasta, carta dobrada, parede com rachaduras, luz de abajur e janela com chuva. Deve transmitir luto, pobreza digna e rancor familiar. A cena precisa ser íntima e menos urbana que o prédio, mas ainda noir.

Composição para hotspots:
- Mesa central com carta ou papéis.
- Porta-retratos antigo visível em destaque.
- Janela com chuva lateral.
- Espaço escuro nas laterais para interface.

${baseStyle}
`,
  "sala-policial.txt": `
Imagem final para: Sala policial esfumaçada.

Cena:
Sala de investigador policial dos anos 40/50, mesa pesada, arquivos empilhados, cinzeiro cheio, luminária de mesa, mapa da cidade na parede, persianas projetando sombras, fumaça no ar e clima de pressa burocrática. Deve parecer o lugar onde um caso pode ser fechado errado por conveniência.

Composição para hotspots:
- Mesa do investigador no centro.
- Arquivos e documentos empilhados em um lado.
- Mapa ou quadro de investigação no fundo, sem texto legível.
- Luminária criando cone de luz dramático.

${baseStyle}
`,
};

fs.mkdirSync(promptsDir, { recursive: true });

for (const [fileName, content] of Object.entries(prompts)) {
  fs.writeFileSync(path.join(promptsDir, fileName), content.trim() + "\n", "utf8");
}

console.log(`Prompts detalhados gerados: ${Object.keys(prompts).length}`);
