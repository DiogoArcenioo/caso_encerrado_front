"use client";

import { useState } from "react";
import { getCluePresentation } from "../systems/cluePresentation";
import { CaseData, GameState } from "../types";
import styles from "./game.module.css";

export function AccusationScreen({
  caseData,
  state,
  onToggleEvidence,
  onAccuse,
}: {
  caseData: CaseData;
  state: GameState;
  onToggleEvidence: (clueId: string) => void;
  onAccuse: (suspectId: string) => void;
}) {
  const [selectedSuspect, setSelectedSuspect] = useState("");
  const availableSuspects = caseData.accusationSuspects.filter(
    (suspect) => state.suspectStates[suspect.characterId] !== "desconhecido",
  );

  return (
    <section className={styles.accusationCard}>
      <h2>Acusação final</h2>
      <p className={styles.statusLine}>
        Escolha um suspeito e apresente as provas que sustentam sua teoria.
      </p>
      <div className={styles.accusationGrid}>
        <div className={styles.evidenceList}>
          {availableSuspects.map((suspect) => (
            <button
              className={`${styles.button} ${
                selectedSuspect === suspect.characterId
                  ? styles.activeButton
                  : ""
              }`}
              key={suspect.characterId}
              type="button"
              onClick={() => setSelectedSuspect(suspect.characterId)}
            >
              {suspect.label}
            </button>
          ))}
        </div>

        <div className={styles.evidenceList}>
          {state.discoveredClues.map((clueId) => {
            const clue = caseData.clues[clueId];
            const presentation = getCluePresentation(clue, state);
            return (
              <button
                className={`${styles.button} ${styles.evidenceButton} ${
                  state.selectedEvidence.includes(clueId)
                    ? styles.selectedEvidence
                    : ""
                }`}
                key={clueId}
                type="button"
                onClick={() => onToggleEvidence(clueId)}
              >
                {presentation.name}
              </button>
            );
          })}
        </div>

        <button
          className={`${styles.button} ${styles.primary}`}
          disabled={!selectedSuspect}
          type="button"
          onClick={() => onAccuse(selectedSuspect)}
        >
          Apresentar acusação
        </button>
      </div>
    </section>
  );
}
