import { GameState, SuspectState } from "../types";

const KNOWLEDGE_VERSION = 4;
const RETIRED_DIALOGUE_FLAGS = new Set([
  "miguel-confronto-1",
  "miguel-confronto-2",
  "confronto-1",
]);

export function migrateCaseKnowledge(state: GameState): GameState {
  const repairedState = repairKnownDestinations(removeRetiredDialogue(state));

  if ((state.knowledgeVersion ?? 0) >= KNOWLEDGE_VERSION) {
    return repairedState;
  }

  if (repairedState.status === "ended") {
    return { ...repairedState, knowledgeVersion: KNOWLEDGE_VERSION };
  }

  const flags = new Set(repairedState.dialogueFlags);
  const suspectStates = {
    ...repairedState.suspectStates,
    "rosa-valente": rosaState(flags),
    "vicente-garza": vicenteState(flags),
    "helena-duarte": helenaState(flags),
    "elias-moretti": eliasState(flags),
  };
  const knowsHelena =
    flags.has("celia_citou_helena_chaves") ||
    flags.has("rosa_citou_helena") ||
    flags.has("policial_indicou_helena");

  return {
    ...repairedState,
    knowledgeVersion: KNOWLEDGE_VERSION,
    suspectStates,
    discoveredCharacters: knowsHelena
      ? repairedState.discoveredCharacters
      : repairedState.discoveredCharacters.filter(
          (characterId) => characterId !== "helena-duarte",
        ),
  };
}

function removeRetiredDialogue(state: GameState): GameState {
  const dialogueFlags = state.dialogueFlags.filter(
    (flag) => !RETIRED_DIALOGUE_FLAGS.has(flag),
  );

  if (dialogueFlags.length === state.dialogueFlags.length) {
    return state;
  }

  return {
    ...state,
    dialogueFlags,
  };
}

function repairKnownDestinations(state: GameState): GameState {
  const flags = new Set(state.dialogueFlags);
  let dialogueFlags = state.dialogueFlags;
  let discoveredCharacters = state.discoveredCharacters;
  let unlockedLocations = state.unlockedLocations;

  if (flags.has("guarda_briefing")) {
    discoveredCharacters = addMany(discoveredCharacters, [
      "alvaro-marconi",
      "dona-celia",
      "miguel",
      "policial-responsavel",
    ]);
    unlockedLocations = addMany(unlockedLocations, [
      "corredor-terceiro-andar",
      "apartamento-dona-celia",
    ]);
  }

  if (flags.has("guarda_citou_vicente")) {
    discoveredCharacters = addUnique(discoveredCharacters, "vicente-garza");
    unlockedLocations = addUnique(unlockedLocations, "sala-policial");
  }

  if (flags.has("clara_desbloqueada")) {
    discoveredCharacters = addUnique(discoveredCharacters, "clara-marconi");
    unlockedLocations = addUnique(unlockedLocations, "casa-clara-marconi");
  }

  if (flags.has("clara_revelou_vicente_rosa")) {
    discoveredCharacters = addMany(discoveredCharacters, [
      "vicente-garza",
      "rosa-valente",
    ]);
    unlockedLocations = addMany(unlockedLocations, [
      "clube-lua-azul",
      "sala-policial",
    ]);
  }

  if (
    flags.has("celia_citou_helena_chaves") ||
    flags.has("rosa_citou_helena") ||
    flags.has("policial_indicou_helena")
  ) {
    discoveredCharacters = addUnique(discoveredCharacters, "helena-duarte");
    unlockedLocations = addUnique(unlockedLocations, "recepcao-predio");
  }

  const knowsElias =
    flags.has("historia_irmao_elias") ||
    discoveredCharacters.includes("elias-moretti") ||
    (state.suspectStates["elias-moretti"] ?? "desconhecido") !== "desconhecido";

  if (knowsElias) {
    dialogueFlags = addUnique(dialogueFlags, "historia_irmao_elias");
    discoveredCharacters = addUnique(discoveredCharacters, "elias-moretti");
    unlockedLocations = addMany(unlockedLocations, [
      "recepcao-predio",
      "apartamento-elias",
    ]);
  }

  return {
    ...state,
    dialogueFlags,
    discoveredCharacters,
    unlockedLocations,
  };
}

function rosaState(flags: Set<string>): SuspectState {
  if (flags.has("rosa_admitiu_visita")) {
    return "suspeito";
  }

  return flags.has("clara_revelou_vicente_rosa")
    ? "mencionado"
    : "desconhecido";
}

function vicenteState(flags: Set<string>): SuspectState {
  if (flags.has("vicente_lama_diferente")) {
    return "inocentado";
  }

  return flags.has("clara_revelou_vicente_rosa")
    ? "suspeito"
    : "desconhecido";
}

function helenaState(flags: Set<string>): SuspectState {
  if (flags.has("helena_admitiu_subida") || flags.has("rosa_citou_helena")) {
    return "suspeito";
  }

  return flags.has("celia_citou_helena_chaves")
    ? "pessoa_de_interesse"
    : "desconhecido";
}

function eliasState(flags: Set<string>): SuspectState {
  if (flags.has("elias_reagiu_relogio") || flags.has("motivo_elias")) {
    return "suspeito";
  }

  return flags.has("historia_irmao_elias")
    ? "pessoa_de_interesse"
    : "desconhecido";
}

function addMany(current: string[], values: string[]) {
  return values.reduce(addUnique, current);
}

function addUnique(current: string[], value: string) {
  return current.includes(value) ? current : [...current, value];
}
