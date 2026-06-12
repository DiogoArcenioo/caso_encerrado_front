"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./game.module.css";

export function PauseMenu({
  open,
  locationName,
  saveStatus,
  onClose,
  onSave,
}: {
  open: boolean;
  locationName: string;
  saveStatus: string;
  onClose: () => void;
  onSave: () => Promise<void>;
}) {
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      continueButtonRef.current?.focus();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.pauseMenuBackdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        aria-describedby="pause-menu-description"
        aria-labelledby="pause-menu-title"
        aria-modal="true"
        className={styles.pauseMenuCard}
        role="dialog"
      >
        <p className={styles.pauseMenuEyebrow}>Investigação pausada</p>
        <h2 id="pause-menu-title">Menu do jogo</h2>
        <p className={styles.pauseMenuLocation}>{locationName}</p>
        <p className={styles.pauseMenuDescription} id="pause-menu-description">
          O caso continuará exatamente de onde você parou.
        </p>

        <div className={styles.pauseMenuActions}>
          <button
            className={`${styles.button} ${styles.primary}`}
            ref={continueButtonRef}
            type="button"
            onClick={onClose}
          >
            Continuar investigação
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => void onSave()}
          >
            Salvar progresso
          </button>
          <Link
            className={`${styles.button} ${styles.pauseMenuExit}`}
            href="/"
          >
            Sair do jogo e voltar ao site
          </Link>
        </div>

        {saveStatus ? (
          <p
            className={
              saveStatus.includes("Não")
                ? styles.pauseMenuError
                : styles.pauseMenuStatus
            }
            role="status"
          >
            {saveStatus}
          </p>
        ) : null}

        <p className={styles.pauseMenuHint}>
          Pressione <kbd>Esc</kbd> para continuar
        </p>
      </section>
    </div>
  );
}
