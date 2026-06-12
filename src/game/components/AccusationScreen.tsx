"use client";

import Image from "next/image";
import { useState } from "react";
import { CaseData } from "../types";
import styles from "./game.module.css";

export function AccusationScreen({
  caseData,
  onAccuse,
  onCancel,
}: {
  caseData: CaseData;
  onAccuse: (suspectId: string) => void;
  onCancel: () => void;
}) {
  const [selectedSuspect, setSelectedSuspect] = useState("");
  const [confirming, setConfirming] = useState(false);
  const accusableCharacters = Object.values(caseData.characters).filter(
    (character) => character.accusable !== false,
  );
  const selected = caseData.characters[selectedSuspect];

  return (
    <section className={styles.accusationCard}>
      <h2>Encerrar o caso</h2>
      <p className={styles.statusLine}>
        Quem matou Álvaro Marconi? Aponte um nome. A cidade não pergunta duas
        vezes — e não devolve inocentes.
      </p>

      <div className={styles.suspectGrid}>
        {accusableCharacters.map((character) => (
          <button
            className={`${styles.suspectCard} ${
              selectedSuspect === character.id ? styles.suspectCardActive : ""
            }`}
            key={character.id}
            type="button"
            onClick={() => {
              setSelectedSuspect(character.id);
              setConfirming(false);
            }}
          >
            <Image
              alt={character.name}
              src={character.image}
              width={152}
              height={152}
            />
            <strong>{character.name}</strong>
            <span>{character.role}</span>
          </button>
        ))}
      </div>

      {confirming && selected ? (
        <div className={styles.accusationConfirm}>
          <p>
            Acusar <strong>{selected.name}</strong>? Depois que o nome sai da
            sua boca, o caso fecha — certo ou errado.
          </p>
          <div className={styles.inlineActions}>
            <button
              className={styles.button}
              type="button"
              onClick={() => setConfirming(false)}
            >
              Repensar
            </button>
            <button
              className={`${styles.button} ${styles.primary}`}
              type="button"
              onClick={() => onAccuse(selectedSuspect)}
            >
              Confirmar acusação
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.inlineActions}>
          <button className={styles.button} type="button" onClick={onCancel}>
            Voltar a investigar
          </button>
          <button
            className={`${styles.button} ${styles.primary}`}
            disabled={!selectedSuspect}
            type="button"
            onClick={() => setConfirming(true)}
          >
            Apresentar acusação
          </button>
        </div>
      )}
    </section>
  );
}
