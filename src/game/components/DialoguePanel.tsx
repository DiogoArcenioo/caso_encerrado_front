"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { canShowDialogue } from "../systems/progression";
import { CaseData, Character, DialogueOption, GameState } from "../types";
import styles from "./game.module.css";

export function DialoguePanel({
  caseData,
  state,
  selectedCharacterId,
  userName,
  onClose,
  onChoose,
}: {
  caseData: CaseData;
  state: GameState;
  selectedCharacterId: string;
  userName?: string;
  onClose: () => void;
  onChoose: (characterId: string, option: DialogueOption) => void;
}) {
  const character = caseData.characters[selectedCharacterId];
  const location = caseData.locations[state.currentLocation];
  const options = useMemo(
    () =>
      character?.dialogues.filter((option) =>
        canShowDialogue(state, option),
      ) ?? [],
    [character, state],
  );
  const greeting = character
    ? getGreeting(character, userName?.trim())
    : "";
  const [spokenText, setSpokenText] = useState(greeting);
  const [displayedText, setDisplayedText] = useState("");
  const [activeOptionId, setActiveOptionId] = useState("");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      const timer = window.setTimeout(() => setDisplayedText(spokenText), 0);
      return () => window.clearTimeout(timer);
    }

    let index = 0;
    let timer = 0;

    function typeNextCharacter() {
      index += 1;
      setDisplayedText(spokenText.slice(0, index));

      if (index >= spokenText.length) {
        return;
      }

      const characterJustTyped = spokenText[index - 1];
      const delay = /[.!?]/.test(characterJustTyped)
        ? 130
        : /[,;:]/.test(characterJustTyped)
          ? 65
          : 19;
      timer = window.setTimeout(typeNextCharacter, delay);
    }

    timer = window.setTimeout(typeNextCharacter, 260);

    return () => window.clearTimeout(timer);
  }, [spokenText]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "Enter" && displayedText !== spokenText) {
        setDisplayedText(spokenText);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [displayedText, onClose, spokenText]);

  if (
    !character ||
    character.locationId !== state.currentLocation ||
    !state.discoveredCharacters.includes(character.id)
  ) {
    return null;
  }

  const position = character.scenePosition;
  const focusX = position ? position.x + position.width / 2 : 50;
  const focusY = position ? Math.min(position.y + 18, 72) : 50;
  const isTyping = displayedText !== spokenText;

  function handleChoose(option: DialogueOption) {
    setActiveOptionId(option.id);
    setDisplayedText("");
    setSpokenText(option.response);
    onChoose(character.id, option);
  }

  return (
    <section
      className={styles.dialogueScene}
      aria-label={`Conversa com ${character.name}`}
    >
      <div
        className={styles.dialogueCamera}
        style={{
          backgroundImage: `url("${location.image}")`,
          backgroundPosition: `${focusX}% ${focusY}%`,
          transformOrigin: `${focusX}% ${focusY}%`,
        }}
        aria-hidden="true"
      />
      <div className={styles.dialogueSceneShade} aria-hidden="true" />

      <button
        className={styles.dialogueClose}
        type="button"
        onClick={onClose}
      >
        Encerrar conversa
        <kbd>Esc</kbd>
      </button>

      <div className={styles.dialoguePortrait} aria-hidden="true">
        <Image
          className={position?.flipX ? styles.dialoguePortraitFlipped : undefined}
          src={character.image}
          alt=""
          width={941}
          height={1672}
          priority
          sizes="(max-width: 700px) 64vw, 360px"
        />
      </div>

      <article className={styles.dialogueConversation}>
        <header className={styles.dialogueSpeaker}>
          <span>{character.role}</span>
          <h2>{character.name}</h2>
        </header>

        <button
          className={styles.typewriterBox}
          type="button"
          aria-label={spokenText}
          onClick={() => setDisplayedText(spokenText)}
        >
          <span aria-hidden="true">
            {displayedText}
            {isTyping ? <i className={styles.typewriterCaret} /> : null}
          </span>
          {isTyping ? <small>Clique ou pressione Enter para completar</small> : null}
        </button>

        <div className={styles.cinematicDialogueOptions}>
          {options.map((option, index) => (
            <button
              className={`${styles.cinematicDialogueOption} ${
                state.dialogueFlags.includes(option.id)
                  ? styles.dialogueOptionSeen
                  : ""
              } ${
                activeOptionId === option.id
                  ? styles.cinematicDialogueOptionActive
                  : ""
              }`}
              disabled={isTyping}
              key={option.id}
              type="button"
              onClick={() => handleChoose(option)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {option.text}
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}

function getGreeting(character: Character, userName?: string) {
  const investigator = userName
    ? `investigador ${userName}`
    : "investigador";

  switch (character.id) {
    case "guarda-policial":
      return `Boa noite, ${investigator}. Em que posso ajudar?`;
    case "policial-responsavel":
      return `${investigator[0].toUpperCase()}${investigator.slice(1)}, mantivemos a cena como encontramos. O que deseja saber?`;
    case "dona-celia":
      return `Boa noite, ${investigator}. Eu sabia que alguém acabaria fazendo perguntas.`;
    case "miguel":
      return `${investigator[0].toUpperCase()}${investigator.slice(1)}... eu conto tudo o que vi, mas foi de longe.`;
    case "clara-marconi":
      return `Boa noite, ${investigator}. Imagino que tenha vindo por causa de Álvaro.`;
    case "rosa-valente":
      return `${investigator[0].toUpperCase()}${investigator.slice(1)}, espero que seja breve. Ainda tenho uma noite para terminar.`;
    case "vicente-garza":
      return `Então você é o ${investigator}. Faça suas perguntas.`;
    case "helena-duarte":
      return `Boa noite, ${investigator}. Este prédio não costuma receber visitas tão tarde.`;
    case "elias-moretti":
      return `${investigator[0].toUpperCase()}${investigator.slice(1)}, relógios e pessoas contam histórias diferentes. Qual delas procura?`;
    default:
      return `Boa noite, ${investigator}. Em que posso ajudar?`;
  }
}
