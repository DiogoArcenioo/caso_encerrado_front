import { CaseData, GameState } from "../types";
import styles from "./game.module.css";

export function LocationMap({
  caseData,
  state,
  open,
  onClose,
  onVisit,
}: {
  caseData: CaseData;
  state: GameState;
  open: boolean;
  onClose: () => void;
  onVisit: (locationId: string) => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.drawerBackdrop}>
      <aside className={`${styles.drawer} ${styles.locationsDrawer}`}>
        <div className={styles.drawerHeader}>
          <div>
            <span>Mapa do caso</span>
            <h2>Locais acessíveis</h2>
          </div>
          <button className={styles.iconButton} type="button" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className={styles.locationList}>
          {state.unlockedLocations.map((locationId) => {
            const location = caseData.locations[locationId];
            const presentCharacters = Object.values(caseData.characters)
              .filter(
                (character) =>
                  character.locationId === locationId &&
                  character.dialogues.length > 0 &&
                  state.discoveredCharacters.includes(character.id),
              )
              .map((character) => character.name);
            return (
              <button
                className={`${styles.locationButton} ${
                  state.currentLocation === locationId
                    ? styles.activeLocationButton
                    : ""
                }`}
                key={locationId}
                type="button"
                onClick={() => {
                  onVisit(locationId);
                  onClose();
                }}
              >
                <strong>{location.name}</strong>
                <span>{location.summary}</span>
                {presentCharacters.length ? (
                  <small>Para interrogar: {presentCharacters.join(", ")}</small>
                ) : null}
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
