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
import { computeCaseScore } from "./scoring";

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
    accusationUnlocked: true,
    narration:
      "A chuva bate no Edificio Santa Cecilia. Um guarda segura a porta e espera seu primeiro movimento.",
    updatedAt: new Date().toISOString(),
  };
}

export function startInvestigation(state: GameState) {
  return touch({
    ...state,
    status: "investigating" as const,
    narration:
      "Você sai do carro e fecha o casaco. O Santa Cecília espera do outro lado da chuva.",
    accusationUnlocked: true,
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
    next = applyEffect(next, clue.effects, caseData);
  }

  return finalize(next);
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

  next = applyEffect(next, hotspot.effects, caseData);

  if (hotspot.clueId && !state.discoveredClues.includes(hotspot.clueId)) {
    const clue = caseData.clues[hotspot.clueId];
    const presentation = getCluePresentation(clue, next);
    next = {
      ...next,
      discoveredClues: addUnique(next.discoveredClues, clue.id),
      narration: `${hotspot.description}\n\nPista coletada: ${presentation.name}. ${presentation.short}`,
    };
    next = applyEffect(next, clue.effects, caseData);
  }

  return finalize(next);
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
    caseData,
  );

  return finalize(next);
}

export function canShowHotspot(state: GameState, hotspot: Hotspot): boolean {
  return meetsRequirements(
    state,
    hotspot.requiresClues,
    hotspot.clueId ? [] : hotspot.requiresFlags,
  );
}

export function canShowDialogue(
  state: GameState,
  option: DialogueOption,
): boolean {
  return meetsRequirements(state, option.requiresClues, option.requiresFlags);
}

export function openAccusation(state: GameState): GameState {
  return touch({
    ...state,
    status: "accusation",
    accusationUnlocked: true,
    narration:
      "Hora de apontar um nome. A cidade aceita qualquer culpado — sua consciência, não.",
  });
}

export function cancelAccusation(state: GameState): GameState {
  return touch({
    ...state,
    status: "investigating",
    narration:
      "Você guarda a acusação no bolso. Ainda há perguntas sem dono nesse prédio.",
  });
}

export function accuse(
  state: GameState,
  suspectId: string,
  caseData: CaseData,
): GameState {
  const isCorrect = suspectId === caseData.scoring.culpritId;
  let finalResult: FinalResult;

  if (isCorrect) {
    finalResult = {
      type: "correto",
      title: caseData.endings.correct.title,
      text: caseData.endings.correct.text,
      score: computeCaseScore(state, caseData),
    };
  } else {
    const wrongEnding = caseData.endings.wrong[suspectId];
    finalResult = wrongEnding
      ? {
          type: wrongEnding.type,
          title: wrongEnding.title,
          text: wrongEnding.text,
        }
      : {
          type: "errado",
          title: caseData.endings.wrongDefault.title,
          text: caseData.endings.wrongDefault.text,
        };
  }

  return touch({
    ...state,
    status: "ended",
    finalResult,
    narration: finalResult.text,
    suspectStates: {
      ...state.suspectStates,
      [suspectId]: isCorrect ? "culpado" : "suspeito",
    },
  });
}

function applyEffect(
  state: GameState,
  effect: GameEffect | undefined,
  caseData: CaseData,
): GameState {
  if (!effect) {
    return state;
  }

  let next: GameState = {
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

  for (const clueId of effect.discoverClues ?? []) {
    const clue = caseData.clues[clueId];

    if (!clue || next.discoveredClues.includes(clueId)) {
      continue;
    }

    next = {
      ...next,
      discoveredClues: addUnique(next.discoveredClues, clueId),
    };
    next = applyEffect(next, clue.effects, caseData);
  }

  return next;
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

function finalize(state: GameState): GameState {
  return touch({
    ...state,
    accusationUnlocked: true,
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
