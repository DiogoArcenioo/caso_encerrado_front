import { CaseData } from "../types";
import styles from "./game.module.css";

export function TravelPanel({
  caseData,
  destinationIds,
  open,
  onClose,
  onTravel,
}: {
  caseData: CaseData;
  destinationIds: string[];
  open: boolean;
  onClose: () => void;
  onTravel: (locationId: string) => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.drawerBackdrop}>
      <aside className={`${styles.drawer} ${styles.locationsDrawer}`}>
        <div className={styles.drawerHeader}>
          <div>
            <span>Carro do investigador</span>
            <h2>Escolher destino</h2>
          </div>
          <button className={styles.iconButton} type="button" onClick={onClose}>
            Fechar
          </button>
        </div>

        {destinationIds.length ? (
          <div className={styles.locationList}>
            {destinationIds.map((locationId) => {
              const location = caseData.locations[locationId];

              return (
                <button
                  className={styles.locationButton}
                  key={locationId}
                  type="button"
                  onClick={() => {
                    onTravel(locationId);
                    onClose();
                  }}
                >
                  <strong>{location.name}</strong>
                  <span>{location.summary}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className={styles.emptyText}>
            Nenhum outro endereço foi descoberto ainda.
          </p>
        )}
      </aside>
    </div>
  );
}
