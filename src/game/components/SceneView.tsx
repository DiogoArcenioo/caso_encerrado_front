import Image from "next/image";
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

  return (
    <section className={styles.sceneLayer} aria-label={location.name}>
      <div className={styles.sceneStage}>
        <Image
          src={location.image}
          alt={location.name}
          fill
          priority
          sizes="100vw"
        />
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
        {visibleCharacters.map((character) => {
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
                style={
                  position.clipBottom
                    ? { clipPath: `inset(0 0 ${position.clipBottom}% 0)` }
                    : undefined
                }
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
      </div>
      <div className={styles.sceneTitle}>
        <span>Local atual</span>
        <h2>{location.name}</h2>
      </div>
      <p className={styles.narration}>{state.narration}</p>
    </section>
  );
}
