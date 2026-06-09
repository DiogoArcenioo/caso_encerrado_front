import styles from "./page.module.css";
import { GameMenuActions } from "./game-menu-actions";

const rainDrops = Array.from({ length: 64 }, (_, index) => ({
  id: index,
  left: (index * 37) % 101,
  duration: 0.42 + ((index * 13) % 34) / 100,
  delay: ((index * 17) % 180) / 100,
  height: 58 + ((index * 11) % 52),
}));

export default function GameMenu() {
  return (
    <div className={styles.page}>
      <div className={styles.rain} aria-hidden="true">
        {rainDrops.map((drop) => (
          <span
            key={drop.id}
            style={{
              left: `${drop.left}%`,
              animationDuration: `${drop.duration}s`,
              animationDelay: `${drop.delay}s`,
              height: `${drop.height}px`,
            }}
          />
        ))}
      </div>
      <div className={styles.vignette} aria-hidden="true" />

      <main className={styles.shell}>
        <header className={styles.topbar}>
          <h1>Caso Encerrado</h1>
          <span>A morte de Augusto Vilar - 1948</span>
        </header>

        <section className={styles.menuStage} aria-labelledby="main-menu-title">
          <div className={styles.caseFile} aria-hidden="true">
            <div className={styles.fileStamp}>Confidencial</div>
            <div className={styles.fileLines}>
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className={styles.evidenceGrid}>
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className={styles.menuPanel}>
            <p className={styles.eyebrow}>Arquivo aberto</p>
            <h2 id="main-menu-title">Menu Principal</h2>
            <GameMenuActions />
          </div>
        </section>
      </main>
    </div>
  );
}
