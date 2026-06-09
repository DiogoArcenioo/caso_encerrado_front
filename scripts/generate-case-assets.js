/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");

const publicDir = path.resolve(__dirname, "..", "public");
const assetsDir = path.join(publicDir, "assets");

const locations = [
  ["fachada-santa-cecilia", "Fachada do Edificio Santa Cecilia", ["predio", "chuva", "letreiro"]],
  ["corredor-terceiro-andar", "Corredor do terceiro andar", ["porta", "tapete", "perfume"]],
  ["apartamento-vitima", "Apartamento da vitima", ["entrada", "fechadura", "sombras"]],
  ["sala-vitima", "Sala da vitima", ["mesa", "janela", "relogio", "quadro"]],
  ["quarto-vitima", "Quarto da vitima", ["mala", "fotografia", "cama"]],
  ["cozinha", "Cozinha da vitima", ["xicara", "pano", "pia"]],
  ["escada-incendio", "Escada de incendio", ["grade", "ferrugem", "lama"]],
  ["apartamento-dona-celia", "Apartamento de Dona Celia", ["poltrona", "janela", "radio"]],
  ["apartamento-elias", "Apartamento de Elias", ["bancada", "relogios", "cafe"]],
  ["clube-lua-azul", "Clube Lua Azul", ["palco", "cortina", "mesa"]],
  ["recepcao-predio", "Recepcao do predio", ["balcao", "chaves", "luminaria"]],
  ["casa-clara-marconi", "Casa de Clara Marconi", ["mesa", "porta-retratos", "carta"]],
  ["sala-policial", "Sala policial", ["mesa", "arquivo", "fumaca"]],
];

const characters = [
  ["alvaro-marconi", "Alvaro Bigode Marconi", "vitima, cobrador de dividas"],
  ["rosa-valente", "Rosa Valente", "cantora do Clube Lua Azul"],
  ["vicente-garza", "Vicente Mao Fria Garza", "capanga ligado as apostas"],
  ["helena-duarte", "Helena Duarte", "senhoria do predio"],
  ["elias-moretti", "Elias Moretti", "relojoeiro do andar de baixo"],
  ["dona-celia", "Dona Celia", "vizinha do lado"],
  ["miguel", "Miguel", "vizinho do predio em frente"],
  ["clara-marconi", "Clara Marconi", "irma da vitima"],
  ["policial-responsavel", "Policial responsavel", "responsavel pela cena"],
];

const items = [
  ["dois-copos", "Dois copos na mesa"],
  ["cinzeiro-tres-cigarros", "Cinzeiro com tres tipos de cigarro"],
  ["cigarro-batom", "Cigarro com marca de batom"],
  ["cigarro-importado", "Cigarro importado"],
  ["quadro-torto", "Quadro torto"],
  ["cofre-vazio", "Cofre vazio"],
  ["relogio-quebrado", "Relogio quebrado"],
  ["janela-aberta", "Janela aberta"],
  ["lama-janela", "Lama perto da janela"],
  ["lama-artificial", "Lama artificial"],
  ["ferrugem-intacta", "Ferrugem intacta"],
  ["botao-grade", "Botao preso na grade"],
  ["chave-reserva", "Chave reserva sob o tapete"],
  ["mala-arrumada", "Mala parcialmente arrumada"],
  ["bilhete-rasgado", "Bilhete rasgado"],
  ["fotografia-riscada", "Fotografia escondida"],
  ["fosforos-lua-azul", "Fosforos do Clube Lua Azul"],
  ["xicara-borra", "Xicara de cafe com borra grossa"],
  ["pano-polvora", "Pano umido com cheiro de polvora"],
  ["perfume-corredor", "Mancha de perfume no corredor"],
  ["sapatos-limpos", "Sapatos limpos da vitima"],
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(relativePath, content) {
  const fullPath = path.join(assetsDir, relativePath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content, "utf8");
}

function svgShell(title, elements) {
  const labels = elements
    .map((label, index) => {
      const x = 90 + index * 210;
      const y = index % 2 === 0 ? 260 : 405;
      return `
        <rect x="${x}" y="${y}" width="150" height="58" fill="rgba(201,169,106,.1)" stroke="#c9a96a" stroke-dasharray="5 6"/>
        <text x="${x + 75}" y="${y + 35}" text-anchor="middle" fill="#e6d7b0" font-family="monospace" font-size="18">${label}</text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="wall" x1="0" x2="1">
      <stop offset="0" stop-color="#0c0907"/>
      <stop offset=".55" stop-color="#21170f"/>
      <stop offset="1" stop-color="#0f0b08"/>
    </linearGradient>
    <radialGradient id="lamp" cx=".66" cy=".24" r=".55">
      <stop offset="0" stop-color="#d7b56e" stop-opacity=".45"/>
      <stop offset=".38" stop-color="#5b3d1e" stop-opacity=".25"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#wall)"/>
  <rect width="1280" height="720" fill="url(#lamp)"/>
  <path d="M0 565h1280v155H0z" fill="#120d09"/>
  <path d="M90 110h350v350H90z" fill="#090706" stroke="#4a3e2c" stroke-width="4"/>
  <path d="M780 90h320v420H780z" fill="#100b08" stroke="#4a3e2c" stroke-width="4"/>
  <path d="M810 120h260v360H810z" fill="#19110b" stroke="#2f261a" stroke-width="2"/>
  <circle cx="690" cy="145" r="70" fill="#c9a96a" opacity=".12"/>
  <path d="M680 150l-90 300h190z" fill="#c9a96a" opacity=".08"/>
  <g opacity=".16" stroke="#e6d7b0">
    <path d="M120 0v720M320 0v720M540 0v720M760 0v720M980 0v720M1180 0v720"/>
    <path d="M0 140h1280M0 330h1280M0 560h1280"/>
  </g>
  ${labels}
  <rect x="42" y="42" width="520" height="62" fill="#15110d" stroke="#4a3e2c"/>
  <text x="62" y="82" fill="#e6d7b0" font-family="monospace" font-size="26">${title}</text>
  <text x="62" y="682" fill="#8a7c60" font-family="monospace" font-size="18">placeholder noir - substitua mantendo o mesmo arquivo para preservar os hotspots</text>
</svg>`;
}

function characterSvg(name, role) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" role="img" aria-label="${name}">
  <rect width="800" height="1000" fill="#100c08"/>
  <radialGradient id="g" cx=".5" cy=".24" r=".58">
    <stop offset="0" stop-color="#c9a96a" stop-opacity=".38"/>
    <stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <rect width="800" height="1000" fill="url(#g)"/>
  <ellipse cx="400" cy="275" rx="128" ry="145" fill="#2c241a" stroke="#4a3e2c" stroke-width="8"/>
  <path d="M250 530c35-90 260-90 300 0l60 330H190z" fill="#211b14" stroke="#4a3e2c" stroke-width="8"/>
  <path d="M285 220c35-120 260-120 310 0H285z" fill="#0b0806"/>
  <rect x="140" y="80" width="520" height="76" fill="#15110d" stroke="#4a3e2c"/>
  <text x="400" y="128" text-anchor="middle" fill="#e6d7b0" font-family="monospace" font-size="34">${name}</text>
  <text x="400" y="925" text-anchor="middle" fill="#8a7c60" font-family="monospace" font-size="26">${role}</text>
</svg>`;
}

function itemSvg(name) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" role="img" aria-label="${name}">
  <rect width="640" height="420" fill="#0f0b08"/>
  <rect x="40" y="42" width="560" height="336" fill="#211b14" stroke="#4a3e2c" stroke-width="4"/>
  <ellipse cx="320" cy="220" rx="150" ry="72" fill="#0d0a07" stroke="#c9a96a" stroke-width="5" opacity=".78"/>
  <path d="M210 220h240M320 145v150" stroke="#e6d7b0" stroke-width="5" opacity=".35"/>
  <text x="320" y="78" text-anchor="middle" fill="#e6d7b0" font-family="monospace" font-size="28">${name}</text>
  <text x="320" y="354" text-anchor="middle" fill="#8a7c60" font-family="monospace" font-size="18">placeholder de item</text>
</svg>`;
}

function locationPrompt(title) {
  return `Imagem final para ${title}.
noir detective game background, 1940s/1950s, rainy night, cinematic lighting, strong shadows, vintage crime scene, semi-realistic painted style, 16:9, high detail, muted colors, dark atmosphere.
Composicao deve manter areas clicaveis claras para hotspots em uma interface web: elementos principais visiveis, sem texto legivel, sem marcas d'agua, sem gore.`;
}

function characterPrompt(name, role) {
  return `Retrato final de personagem para ${name}, ${role}.
1940s noir character portrait, semi-realistic painted style, dramatic shadows, vintage clothing, expressive face, dark background, detective game visual novel style.
Sem texto, sem marca d'agua, enquadramento vertical, paleta escura com sepia e luz cinematografica.`;
}

function itemPrompt(name) {
  return `Imagem final de item investigativo: ${name}.
noir detective game evidence item, 1940s/1950s, cinematic lighting, strong shadows, semi-realistic painted style, high detail, muted sepia colors, dark tabletop background.
Objeto bem legivel para inventario, sem texto extra, sem marca d'agua.`;
}

for (const [slug, title, elements] of locations) {
  writeFile(`images/locations/${slug}.svg`, svgShell(title, elements));
  writeFile(`prompts/locations/${slug}.txt`, locationPrompt(title));
}

for (const [slug, name, role] of characters) {
  writeFile(`images/characters/${slug}.svg`, characterSvg(name, role));
  writeFile(`prompts/characters/${slug}.txt`, characterPrompt(name, role));
}

for (const [slug, name] of items) {
  writeFile(`images/items/${slug}.svg`, itemSvg(name));
  writeFile(`prompts/items/${slug}.txt`, itemPrompt(name));
}

console.log("Assets da missao gerados em frontend/public/assets");
