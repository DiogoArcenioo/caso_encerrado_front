import Link from "next/link";
import { AuthOpenButton, SiteHeader } from "./site-auth";
import styles from "./page.module.css";

const rainDrops = Array.from({ length: 56 }, (_, index) => ({
  id: index,
  left: (index * 41) % 101,
  duration: 0.46 + ((index * 11) % 32) / 100,
  delay: ((index * 19) % 190) / 100,
  height: 54 + ((index * 7) % 48),
}));

const notes = [
  "Casos curtos para jogar sem compromisso.",
  "Investigação baseada em texto, imagens e escolhas.",
  "Conta opcional para salvar o progresso e continuar depois.",
];

export default function Home() {
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

      <SiteHeader />

      <main>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Jogo web casual de investigação</p>
            <h1 id="hero-title">Caso Encerrado</h1>
            <p className={styles.heroText}>
              Um jogo de mistério para abrir quando não tem mais nada para fazer
              enquanto assiste algo, espera uma partida ou só quer resolver um
              caso rápido. Leia, observe imagens, junte pistas e volte depois
              quando quiser.
            </p>
            <div className={styles.heroActions}>
              <Link className={`${styles.button} ${styles.primary}`} href="/jogo">
                Iniciar Caso Encerrado
              </Link>
              <AuthOpenButton className={styles.button} mode="login">
                Salvar progresso
              </AuthOpenButton>
            </div>
          </div>
        </section>

        <section className={styles.section} id="projeto">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Intuito do projeto</p>
            <h2>Um passatempo noir, leve e persistente.</h2>
          </div>
          <div className={styles.noteGrid}>
            {notes.map((note) => (
              <article className={styles.noteCard} key={note}>
                <span />
                <p>{note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.launchSection}`}>
          <article className={styles.launchCard}>
            <div>
              <p className={styles.eyebrow}>Arquivo disponível</p>
              <h2>O primeiro caso já está na mesa.</h2>
              <p>
                Comece como visitante agora ou volte aqui depois para conectar
                sua conta quando o salvamento estiver integrado ao banco.
              </p>
            </div>
            <Link className={`${styles.button} ${styles.primary}`} href="/jogo">
              Iniciar Caso Encerrado
            </Link>
          </article>
        </section>
      </main>
    </div>
  );
}
