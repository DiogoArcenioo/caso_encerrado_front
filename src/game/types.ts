export type Relevance = "baixa" | "media" | "alta" | "decisiva";
export type SuspectState =
  | "desconhecido"
  | "mencionado"
  | "pessoa_de_interesse"
  | "suspeito"
  | "inocentado"
  | "culpado";

export interface GameEffect {
  unlockLocations?: string[];
  discoverCharacters?: string[];
  discoverClues?: string[];
  suspectStates?: Record<string, SuspectState>;
  addContradictions?: string[];
  addFlags?: string[];
  narration?: string;
}

export interface Clue {
  id: string;
  name: string;
  short: string;
  detail: string;
  textVariants?: ClueTextVariant[];
  locationId: string;
  relevance: Relevance;
  points?: number;
  effects?: GameEffect;
}

export interface ClueTextVariant {
  name?: string;
  short?: string;
  detail?: string;
  requiresClues?: string[];
  requiresFlags?: string[];
  requiresTalkedCharacters?: string[];
}

export interface Hotspot {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
  targetLocationId?: string;
  destinationLocationIds?: string[];
  alwaysVisible?: boolean;
  clueId?: string;
  effects?: GameEffect;
  requiresClues?: string[];
  requiresFlags?: string[];
}

export interface Location {
  id: string;
  name: string;
  image: string;
  summary: string;
  initialUnlocked?: boolean;
  entryClueId?: string;
  hotspots: Hotspot[];
}

export interface DialogueOption {
  id: string;
  text: string;
  response: string;
  requiresClues?: string[];
  requiresFlags?: string[];
  effects?: GameEffect;
}

export interface CharacterScenePosition {
  x: number;
  y: number;
  width: number;
  flipX?: boolean;
  layer?: number;
  clipBottom?: number;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  locationId: string;
  scenePosition?: CharacterScenePosition;
  initialDiscovered?: boolean;
  startsAsSuspect?: boolean;
  accusable?: boolean;
  dialogues: DialogueOption[];
}

export interface AccusationSuspect {
  characterId: string;
  label: string;
}

export interface TestimonyScore {
  flag: string;
  label: string;
  points: number;
}

export interface ScoreRank {
  minPercent: number;
  title: string;
  text: string;
}

export interface CaseScoring {
  culpritId: string;
  cluePoints: Record<Relevance, number>;
  testimonies: TestimonyScore[];
  ranks: ScoreRank[];
}

export interface EndingText {
  title: string;
  text: string;
}

export interface WrongEnding extends EndingText {
  type: "parcial" | "errado";
}

export interface CaseEndings {
  correct: EndingText;
  wrong: Record<string, WrongEnding>;
  wrongDefault: EndingText;
}

export interface CaseData {
  id: string;
  title: string;
  intro: string;
  initialLocationId: string;
  locations: Record<string, Location>;
  clues: Record<string, Clue>;
  characters: Record<string, Character>;
  accusationSuspects: AccusationSuspect[];
  scoring: CaseScoring;
  endings: CaseEndings;
}

export interface ScoreItem {
  label: string;
  points: number;
  kind: "pista" | "depoimento";
  earned: boolean;
}

export interface CaseScore {
  earnedPoints: number;
  maxPoints: number;
  percent: number;
  rankTitle: string;
  rankText: string;
  items: ScoreItem[];
}

export interface FinalResult {
  type: "correto" | "parcial" | "errado";
  title: string;
  text: string;
  score?: CaseScore;
}

export interface GameState {
  caseId: string;
  knowledgeVersion?: number;
  status: "intro" | "investigating" | "accusation" | "ended";
  currentLocation: string;
  discoveredClues: string[];
  discoveredCharacters: string[];
  suspectStates: Record<string, SuspectState>;
  unlockedLocations: string[];
  dialogueFlags: string[];
  contradictions: string[];
  visitedLocations: string[];
  talkedCharacters: string[];
  talkedSuspects: string[];
  inspectedHotspots: string[];
  selectedEvidence: string[];
  accusationUnlocked: boolean;
  finalResult?: FinalResult;
  narration: string;
  updatedAt: string;
}
