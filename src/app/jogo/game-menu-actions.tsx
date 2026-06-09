"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { case01 } from "@/game/data/case01";
import {
  loadRemoteSave,
  localSaveExists,
} from "@/game/systems/saveApi";
import { useStoredUser } from "@/game/systems/userStore";
import styles from "./page.module.css";

export function GameMenuActions() {
  const user = useStoredUser();
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    let canceled = false;

    async function checkSave() {
      if (!user) {
        return false;
      }

      try {
        const remoteSave = await loadRemoteSave(case01.id, user);

        return Boolean(remoteSave) || localSaveExists(case01.id, user);
      } catch {
        return localSaveExists(case01.id, user);
      }
    }

    void checkSave().then((saveExists) => {
      if (!canceled) {
        setHasSave(saveExists);
      }
    });

    return () => {
      canceled = true;
    };
  }, [user]);

  if (user) {
    return (
      <div className={styles.actions}>
        <p className={styles.sessionLabel}>Jogando como {user.nome}</p>
        <Link
          className={`${styles.button} ${styles.primary}`}
          href="/jogo/caso-01?new=1"
        >
          Criar novo jogo
        </Link>
        {hasSave ? (
          <Link className={styles.button} href="/jogo/caso-01?load=1">
            Carregar jogo
          </Link>
        ) : null}
        <button className={styles.button} type="button">
          Configurações
        </button>
      </div>
    );
  }

  return (
    <div className={styles.actions}>
      <Link
        className={`${styles.button} ${styles.primary}`}
        href="/jogo/caso-01?new=1"
      >
        Jogar como Visitante
      </Link>
      <Link className={styles.button} href="/?auth=login">
        Fazer Login
      </Link>
      <button className={styles.button} type="button">
        Configurações
      </button>
    </div>
  );
}
