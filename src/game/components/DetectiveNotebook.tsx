"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { getCluePresentation } from "../systems/cluePresentation";
import { CaseData, GameState } from "../types";
import styles from "./game.module.css";

type NotebookTab =
  | "resumo"
  | "pistas"
  | "pessoas"
  | "suspeitos"
  | "contradicoes"
  | "locais";

const tabs: Array<{ id: NotebookTab; label: string }> = [
  { id: "resumo", label: "Resumo" },
  { id: "pistas", label: "Pistas" },
  { id: "pessoas", label: "Pessoas" },
  { id: "suspeitos", label: "Suspeitos" },
  { id: "contradicoes", label: "Contradições" },
  { id: "locais", label: "Locais" },
];

export function DetectiveNotebook({
  caseData,
  state,
  open,
  onClose,
}: {
  caseData: CaseData;
  state: GameState;
  open: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<NotebookTab>("resumo");

  if (!open) {
    return null;
  }

  return (
    <div className={styles.drawerBackdrop}>
      <aside className={styles.drawer}>
        <div className={styles.drawerHeader}>
          <div>
            <span>Arquivo pessoal</span>
            <h2>Caderno do detetive</h2>
          </div>
          <button className={styles.iconButton} type="button" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              className={`${styles.button} ${
                activeTab === tab.id ? styles.activeButton : ""
              }`}
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.notebookSection}>
          {activeTab === "resumo" ? (
            <>
              <p className={styles.statusLine}>{caseData.intro}</p>
              <p className={styles.statusLine}>
                Pistas: {state.discoveredClues.length} | Pessoas:{" "}
                {state.discoveredCharacters.length} | Suspeitos ativos:{" "}
                {countActiveSuspects(state)} | Contradições:{" "}
                {state.contradictions.length}
              </p>
            </>
          ) : null}

          {activeTab === "pistas"
            ? renderList(
                state.discoveredClues,
                "Nenhuma pista registrada.",
                (clueId) => {
                  const clue = caseData.clues[clueId];
                  const presentation = getCluePresentation(clue, state);
                  return (
                    <article className={styles.clueItem} key={clueId}>
                      <strong>{presentation.name}</strong>
                      <span>{presentation.detail}</span>
                    </article>
                  );
                },
              )
            : null}

          {activeTab === "pessoas"
            ? renderList(
                state.discoveredCharacters,
                "Nenhuma pessoa registrada.",
                (characterId) => {
                  const character = caseData.characters[characterId];
                  return (
                    <article className={styles.personItem} key={characterId}>
                      <strong>{character.name}</strong>
                      <span>{character.role}</span>
                    </article>
                  );
                },
              )
            : null}

          {activeTab === "suspeitos"
            ? renderList(
                Object.entries(state.suspectStates).filter(
                  ([, status]) => status !== "desconhecido",
                ),
                "Nenhum suspeito ativo.",
                ([characterId, status]) => {
                  const character = caseData.characters[characterId];
                  return (
                    <article className={styles.personItem} key={characterId}>
                      <strong>{character.name}</strong>
                      <span>{status.replaceAll("_", " ")}</span>
                    </article>
                  );
                },
              )
            : null}

          {activeTab === "contradicoes"
            ? renderList(
                state.contradictions,
                "Nenhuma contradição registrada.",
                (contradiction) => (
                  <p className={styles.contradictionItem} key={contradiction}>
                    {contradiction}
                  </p>
                ),
              )
            : null}

          {activeTab === "locais"
            ? renderList(
                state.unlockedLocations,
                "Nenhum local além da fachada.",
                (locationId) => {
                  const location = caseData.locations[locationId];
                  return (
                    <article className={styles.personItem} key={locationId}>
                      <strong>{location.name}</strong>
                      <span>{location.summary}</span>
                    </article>
                  );
                },
              )
            : null}
        </div>
      </aside>
    </div>
  );
}

function countActiveSuspects(state: GameState) {
  return Object.values(state.suspectStates).filter(
    (status) => status === "pessoa_de_interesse" || status === "suspeito",
  ).length;
}

function renderList<T>(
  items: T[],
  emptyText: string,
  renderItem: (item: T) => ReactNode,
) {
  if (!items.length) {
    return <p className={styles.emptyText}>{emptyText}</p>;
  }

  return items.map(renderItem);
}
