"use client";

import Image from "next/image";
import { useRef } from "react";
import { CaseData, GameState, Hotspot } from "../types";
import { canShowHotspot } from "../systems/progression";
import styles from "./game.module.css";

export function SceneView({
  caseData,
  state,
  onInspect,
  onTalk,
}: {
  caseData: CaseData;
  state: GameState;
  onInspect: (hotspot: Hotspot) => void;
  onTalk?: (characterId: string) => void;
}) {
  const location = caseData.locations[state.currentLocation];
  const stageRef = useRef<HTMLDivElement>(null);
  const visibleHotspots = location.hotspots.filter((hotspot) =>
    canShowHotspot(state, hotspot),
  );
  const visibleCharacters = Object.values(caseData.characters).filter(
    (character) =>
      character.locationId === state.currentLocation &&
      character.scenePosition &&
      character.dialogues.length > 0 &&
      state.discoveredCharacters.includes(character.id),
  );

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const rect = stage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    stage.style.setProperty("--pointer-x", `${x}%`);
    stage.style.setProperty("--pointer-y", `${y}%`);
    stage.style.setProperty("--parallax-x", `${(x - 50) / 50}`);
    stage.style.setProperty("--parallax-y", `${(y - 50) / 50}`);
  }

  function handlePointerLeave() {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    stage.style.setProperty("--pointer-x", "50%");
    stage.style.setProperty("--pointer-y", "40%");
    stage.style.setProperty("--parallax-x", "0");
    stage.style.setProperty("--parallax-y", "0");
  }

  return (
    <section className={styles.sceneLayer} aria-label={location.name}>
      <div
        className={styles.sceneStage}
        ref={stageRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className={styles.sceneFrame} key={location.id}>
          <div className={styles.sceneBackdrop} aria-hidden="true">
            <Image
              src={location.image}
              alt={location.name}
              fill
              priority
              sizes="100vw"
            />
          </div>

          {visibleHotspots.map((hotspot) => (
            <button
              aria-label={hotspot.label}
              className={`${styles.hotspot} ${
                state.inspectedHotspots.includes(hotspot.id)
                  ? styles.hotspotInspected
                  : ""
              } ${
                hotspot.alwaysVisible
                  ? styles.hotspotAlwaysVisible
                  : ""
              }`}
              key={hotspot.id}
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                width: `${hotspot.width}%`,
                height: `${hotspot.height}%`,
              }}
              title={hotspot.label}
              type="button"
              onClick={() => onInspect(hotspot)}
            />
          ))}

          {visibleCharacters.map((character, index) => {
            const position = character.scenePosition!;

            return (
              <button
                aria-label={`Conversar com ${character.name}`}
                data-clipped={Boolean(position.clipBottom)}
                className={`${styles.sceneCharacter} ${
                  state.talkedCharacters.includes(character.id)
                    ? styles.sceneCharacterTalked
                    : ""
                }`}
                key={character.id}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  width: `${position.width}%`,
                  zIndex: position.layer ?? 9,
                  animationDelay: `${320 + index * 140}ms`,
                  clipPath: position.clipBottom
                    ? `inset(0 0 ${position.clipBottom}% 0)`
                    : undefined,
                }}
                title={`Conversar com ${character.name}`}
                type="button"
                onClick={() => onTalk?.(character.id)}
              >
                <Image
                  className={position.flipX ? styles.characterFlipped : undefined}
                  src={character.image}
                  alt=""
                  width={941}
                  height={1672}
                  sizes="15vw"
                />
                <span
                  style={
                    position.clipBottom
                      ? { bottom: `${position.clipBottom + 3}%` }
                      : undefined
                  }
                >
                  {character.name}
                </span>
              </button>
            );
          })}

          <div className={styles.sceneLantern} aria-hidden="true" />
          <div className={styles.sceneLight} aria-hidden="true" />
          <div className={styles.sceneGrain} aria-hidden="true" />
          <div className={styles.sceneCut} aria-hidden="true" />
        </div>
      </div>
      <div className={styles.sceneTitle} key={`title-${location.id}`}>
        <span>Local atual</span>
        <h2>{location.name}</h2>
      </div>
      <p className={styles.narration} key={state.narration}>
        {state.narration}
      </p>
    </section>
  );
}
