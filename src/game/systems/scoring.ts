import { CaseData, CaseScore, GameState, ScoreItem } from "../types";

export function computeCaseScore(
  state: GameState,
  caseData: CaseData,
): CaseScore {
  const flags = new Set(state.dialogueFlags);
  const discovered = new Set(state.discoveredClues);
  const items: ScoreItem[] = [];

  for (const clue of Object.values(caseData.clues)) {
    items.push({
      label: clue.name,
      points: clue.points ?? caseData.scoring.cluePoints[clue.relevance],
      kind: "pista",
      earned: discovered.has(clue.id),
    });
  }

  for (const testimony of caseData.scoring.testimonies) {
    items.push({
      label: testimony.label,
      points: testimony.points,
      kind: "depoimento",
      earned: flags.has(testimony.flag),
    });
  }

  const maxPoints = items.reduce((total, item) => total + item.points, 0);
  const earnedPoints = items.reduce(
    (total, item) => (item.earned ? total + item.points : total),
    0,
  );
  const percent = maxPoints
    ? Math.floor((earnedPoints / maxPoints) * 100)
    : 0;
  const rank =
    [...caseData.scoring.ranks]
      .sort((a, b) => b.minPercent - a.minPercent)
      .find((candidate) => percent >= candidate.minPercent) ??
    caseData.scoring.ranks[caseData.scoring.ranks.length - 1];

  return {
    earnedPoints,
    maxPoints,
    percent,
    rankTitle: rank?.title ?? "",
    rankText: rank?.text ?? "",
    items,
  };
}
