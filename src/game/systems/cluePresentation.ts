import { Clue, GameState } from "../types";

export interface CluePresentation {
  name: string;
  short: string;
  detail: string;
}

export function getCluePresentation(
  clue: Clue,
  state: GameState,
): CluePresentation {
  return (clue.textVariants ?? []).reduce<CluePresentation>(
    (presentation, variant) => {
      if (!canRevealVariant(variant, state)) {
        return presentation;
      }

      return {
        name: variant.name ?? presentation.name,
        short: variant.short ?? presentation.short,
        detail: variant.detail ?? presentation.detail,
      };
    },
    {
      name: clue.name,
      short: clue.short,
      detail: clue.detail,
    },
  );
}

function canRevealVariant(
  variant: NonNullable<Clue["textVariants"]>[number],
  state: GameState,
) {
  return (
    (variant.requiresClues ?? []).every((clueId) =>
      state.discoveredClues.includes(clueId),
    ) &&
    (variant.requiresFlags ?? []).every((flag) =>
      state.dialogueFlags.includes(flag),
    ) &&
    (variant.requiresTalkedCharacters ?? []).every((characterId) =>
      state.talkedCharacters.includes(characterId),
    )
  );
}
