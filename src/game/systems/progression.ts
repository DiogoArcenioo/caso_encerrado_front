import {
  CaseData,
  DialogueOption,
  FinalResult,
  GameEffect,
  GameState,
  Hotspot,
  SuspectState,
} from "../types";
import { getCluePresentation } from "./cluePresentation";

export function createInitialState(caseData: CaseData): GameState {
  const unlockedLocations = Object.values(caseData.locations)
    .filter((location) => location.initialUnlocked)
    .map((location) => location.id);
  const discoveredCharacters = Object.values(caseData.characters)
    .filter((character) => character.initialDiscovered)
    .map((character) => character.id);
  const suspectStates = caseData.accusationSuspects.reduce<
    Record<string, SuspectState>
  >((acc, suspect) => {
    acc[suspect.characterId] = "desconhecido";
    return acc;
  }, {});

  return {
    caseId: caseData.id,
    knowledgeVersion: 4,
    status: "investigating",
    currentLocation: caseData.initialLocationId,
    discoveredClues: [],
    discoveredCharacters,
    suspectStates,
    unlockedLocations,
    dialogueFlags: [],
    contradictions: [],
    visitedLocations: [caseData.initialLocationId],
    talkedCharacters: [],
    talkedSuspects: [],
    inspectedHotspots: [],
    selectedEvidence: [],
    accusationUnlocked: false,
    narration:
      "A chuva bate no Edificio Santa Cecilia. Um guarda segura a porta e espera seu primeiro movimento.",
    updatedAt: new Date().toISOString(),
  };
}

export function startInvestigation(state: GameState, caseData: CaseData) {
  return touch({
    ...state,
    status: "investigating" as const,
    narration:
      "Você sai do carro e fecha o casaco. O Santa Cecília espera do outro lado da chuva.",
    accusationUnlocked: isAccusationUnlocked(state, caseData),
  });
}

export function visitLocation(
  state: GameState,
  locationId: string,
  caseData: CaseData,
): GameState {
  if (!state.unlockedLocations.includes(locationId)) {
    return state;
  }

  const location = caseData.locations[locationId];
  let next: GameState = {
    ...state,
    currentLocation: locationId,
    visitedLocations: addUnique(state.visitedLocations, locationId),
    narration: location.summary,
  };

  if (
    location.entryClueId &&
    !state.discoveredClues.includes(location.entryClueId)
  ) {
    const clue = caseData.clues[location.entryClueId];
    const presentation = getCluePresentation(clue, next);
    next = {
      ...next,
      discoveredClues: addUnique(next.discoveredClues, clue.id),
      narration: `${location.summary}\n\nPista coletada: ${presentation.name}. ${presentation.short}`,
    };
    next = applyEffect(next, clue.effects);
  }

  return finalize(next, caseData);
}

export function inspectHotspot(
  state: GameState,
  hotspot: Hotspot,
  caseData: CaseData,
): GameState {
  let next = {
    ...state,
    inspectedHotspots: addUnique(state.inspectedHotspots, hotspot.id),
    narration: hotspot.description,
  };

  next = applyEffect(next, hotspot.effects);

  if (hotspot.clueId && !state.discoveredClues.includes(hotspot.clueId)) {
    const clue = caseData.clues[hotspot.clueId];
    const presentation = getCluePresentation(clue, next);
    next = {
      ...next,
      discoveredClues: addUnique(next.discoveredClues, clue.id),
      narration: `${hotspot.description}\n\nPista coletada: ${presentation.name}. ${presentation.short}`,
    };
    next = applyEffect(next, clue.effects);
  }

  return finalize(next, caseData);
}

export function chooseDialogue(
  state: GameState,
  characterId: string,
  option: DialogueOption,
  caseData: CaseData,
): GameState {
  const currentSuspectState = state.suspectStates[characterId];
  const talkedSuspects =
    currentSuspectState &&
    currentSuspectState !== "desconhecido" &&
    currentSuspectState !== "mencionado"
      ? addUnique(state.talkedSuspects, characterId)
      : state.talkedSuspects;
  const next = applyEffect(
    {
      ...state,
      talkedCharacters: addUnique(state.talkedCharacters, characterId),
      talkedSuspects,
      dialogueFlags: addUnique(state.dialogueFlags, option.id),
      narration: option.response,
    },
    option.effects,
  );

  return finalize(next, caseData);
}

export function canShowHotspot(state: GameState, hotspot: Hotspot): boolean {
  return meetsRequirements(state, hotspot.requiresClues, hotspot.requiresFlags);
}

export function canShowDialogue(
  state: GameState,
  option: DialogueOption,
): boolean {
  return meetsRequirements(state, option.requiresClues, option.requiresFlags);
}

export function unlockAccusation(
  state: GameState,
  caseData: CaseData,
): GameState {
  if (!isAccusationUnlocked(state, caseData)) {
    return {
      ...state,
      narration:
        "Ainda falta material para sustentar uma acusação. A cidade adora culpados fáceis.",
    };
  }

  return touch({
    ...state,
    status: "accusation",
    accusationUnlocked: true,
    narration:
      "As peças finalmente rangem no lugar. Agora é possível levar uma acusação ao investigador.",
  });
}

export function toggleEvidence(state: GameState, clueId: string): GameState {
  const selectedEvidence = state.selectedEvidence.includes(clueId)
    ? state.selectedEvidence.filter((id) => id !== clueId)
    : [...state.selectedEvidence, clueId];

  return touch({ ...state, selectedEvidence });
}

export function accuse(
  state: GameState,
  suspectId: string,
  caseData: CaseData,
): GameState {
  const decisiveCount = state.selectedEvidence.filter((clueId) =>
    caseData.decisiveEvidence.includes(clueId),
  ).length;
  let finalResult: FinalResult;

  if (suspectId === "elias-moretti" && decisiveCount >= 4) {
    finalResult = {
      type: "correto",
      title: "Caso Encerrado",
      text:
        "Elias é preso. Ele não nega completamente. “Engraçado, detetive. Nesta cidade, um homem como Álvaro mata dez pessoas sem puxar um gatilho. Mas quando alguém finalmente derruba um monstro, vocês chamam de assassinato.”\n\nA cidade não ficou mais limpa naquela noite. Só um pouco menos mentirosa.",
    };
  } else if (suspectId === "rosa-valente" || suspectId === "helena-duarte") {
    finalResult = {
      type: "parcial",
      title: "Uma verdade torta",
      text:
        "A polícia aceita a acusação por enquanto. Rosa ou Helena tinham motivos para mentir, mas a hora do tiro e a escada encenada continuam arranhando sua cabeça.",
    };
  } else {
    finalResult = {
      type: "errado",
      title: "O culpado conveniente",
      text:
        "Vicente Garza é criminoso o bastante para caber no relatório. A polícia fecha o caso rápido. A verdade, como o último trem, passa sem parar.",
    };
  }

  return touch({
    ...state,
    status: "ended",
    finalResult,
    narration: finalResult.text,
    suspectStates: {
      ...state.suspectStates,
      [suspectId]: finalResult.type === "correto" ? "culpado" : "suspeito",
    },
  });
}

export function isAccusationUnlocked(
  state: GameState,
  caseData: CaseData,
): boolean {
  const relevantClues = state.discoveredClues.filter(
    (clueId) => caseData.clues[clueId]?.relevance !== "baixa",
  ).length;
  const unlockedSuspects = Object.values(state.suspectStates).filter(
    (status) => status === "pessoa_de_interesse" || status === "suspeito",
  ).length;
  const requiredTalks = [
    "policial-responsavel",
    "dona-celia",
    "miguel",
  ].every((characterId) => state.talkedCharacters.includes(characterId));

  return (
    relevantClues >= 8 &&
    unlockedSuspects >= 3 &&
    state.contradictions.length >= 3 &&
    requiredTalks &&
    state.talkedSuspects.length >= 2
  );
}

function applyEffect(state: GameState, effect?: GameEffect): GameState {
  if (!effect) {
    return state;
  }

  return {
    ...state,
    unlockedLocations: addMany(state.unlockedLocations, effect.unlockLocations),
    discoveredCharacters: addMany(
      state.discoveredCharacters,
      effect.discoverCharacters,
    ),
    contradictions: addMany(state.contradictions, effect.addContradictions),
    dialogueFlags: addMany(state.dialogueFlags, effect.addFlags),
    suspectStates: {
      ...state.suspectStates,
      ...mergeSuspectStates(state.suspectStates, effect.suspectStates),
    },
    narration: effect.narration ?? state.narration,
  };
}

function mergeSuspectStates(
  current: Record<string, SuspectState>,
  incoming: Record<string, SuspectState> = {},
) {
  const rank: Record<SuspectState, number> = {
    desconhecido: 0,
    mencionado: 1,
    pessoa_de_interesse: 2,
    suspeito: 3,
    inocentado: 4,
    culpado: 5,
  };

  return Object.entries(incoming).reduce<Record<string, SuspectState>>(
    (acc, [characterId, status]) => {
      const currentStatus = current[characterId] ?? "desconhecido";
      acc[characterId] =
        rank[status] > rank[currentStatus] ? status : currentStatus;
      return acc;
    },
    {},
  );
}

function finalize(state: GameState, caseData: CaseData): GameState {
  return touch({
    ...state,
    accusationUnlocked: isAccusationUnlocked(state, caseData),
  });
}

function meetsRequirements(
  state: GameState,
  requiredClues: string[] = [],
  requiredFlags: string[] = [],
) {
  return (
    requiredClues.every((clueId) => state.discoveredClues.includes(clueId)) &&
    requiredFlags.every((flag) => state.dialogueFlags.includes(flag))
  );
}

function addMany(current: string[], values: string[] = []) {
  return values.reduce(addUnique, current);
}

function addUnique(current: string[], value: string) {
  return current.includes(value) ? current : [...current, value];
}

function touch<T extends GameState>(state: T): T {
  return {
    ...state,
    updatedAt: new Date().toISOString(),
  };
}
