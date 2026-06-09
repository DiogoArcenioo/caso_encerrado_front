"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./game.module.css";

type CutsceneSlide = {
  image: string;
  eyebrow: string;
  title: string;
  text: string;
  objectPosition?: string;
  motion: "push" | "pull" | "drift-left" | "drift-right";
};

const slides: CutsceneSlide[] = [
  {
    image: "/assets/images/locations/sala-policial.png",
    eyebrow: "Delegacia Central · 00h03",
    title: "O telefone tocou quando a cidade já devia estar dormindo.",
    text: "Você terminava um relatório atrasado quando o plantão recebeu uma chamada do Edifício Santa Cecília. Um homem havia sido encontrado morto no terceiro andar.",
    motion: "push",
  },
  {
    image: "/assets/images/cutscenes/chamada-delegacia.png",
    eyebrow: "Plantão de Homicídios · 00h07",
    title: "A vítima era Álvaro Marconi.",
    text: "A porta estava trancada por dentro. O disparo parecera simples demais, e casos simples não costumavam chamar um investigador no meio da madrugada.",
    motion: "drift-left",
  },
  {
    image: "/assets/images/cutscenes/trajeto-chuva.png",
    eyebrow: "Centro da cidade · 00h12",
    title: "Você cruzou a tempestade sem sirene.",
    text: "Enquanto os limpadores lutavam contra a chuva, uma informação se repetia no rádio: ninguém entrara, ninguém saíra, e todos no prédio tinham uma versão diferente.",
    motion: "drift-right",
  },
  {
    image: "/assets/images/locations/fachada-santa-cecilia.png",
    eyebrow: "Edifício Santa Cecília · 00h21",
    title: "O guarda esperava diante da porta.",
    text: "As luzes ainda estavam acesas no terceiro andar. Você desligou o motor, fechou o casaco e saiu para a chuva. A investigação começava ali.",
    motion: "pull",
  },
];

const rainDrops = Array.from({ length: 72 }, (_, index) => ({
  id: index,
  left: (index * 43) % 103,
  delay: ((index * 19) % 210) / 100,
  duration: 0.48 + ((index * 11) % 32) / 100,
  length: 54 + ((index * 17) % 74),
}));

const SLIDE_DURATION = 6800;

export function OpeningCutscene({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const completeRef = useRef(onComplete);
  const activeSlide = slides[activeIndex];
  const isLastSlide = activeIndex === slides.length - 1;

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (isLastSlide) {
        completeRef.current();
      } else {
        setActiveIndex((current) => current + 1);
      }
    }, SLIDE_DURATION);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isLastSlide]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        completeRef.current();
      }

      if (event.key === "ArrowRight") {
        if (isLastSlide) {
          completeRef.current();
        } else {
          setActiveIndex((current) => current + 1);
        }
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => Math.max(0, current - 1));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLastSlide]);

  return (
    <section
      className={styles.cutscene}
      aria-label="Introdução do caso"
      aria-live="polite"
    >
      <div className={styles.cutsceneFrame} key={activeSlide.image}>
        <Image
          src={activeSlide.image}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: activeSlide.objectPosition }}
          data-motion={activeSlide.motion}
        />
      </div>

      <div className={styles.cutsceneRain} aria-hidden="true">
        {rainDrops.map((drop) => (
          <span
            key={drop.id}
            style={{
              left: `${drop.left}%`,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${drop.duration}s`,
              height: `${drop.length}px`,
            }}
          />
        ))}
      </div>

      <div className={styles.cutsceneGrain} aria-hidden="true" />
      <div className={styles.cutsceneShade} aria-hidden="true" />

      <header className={styles.cutsceneHeader}>
        <span>O Último Trem da Madrugada</span>
        <button type="button" onClick={() => completeRef.current()}>
          Pular introdução
          <kbd>Esc</kbd>
        </button>
      </header>

      <article className={styles.cutsceneCaption} key={activeSlide.title}>
        <p>{activeSlide.eyebrow}</p>
        <h1>{activeSlide.title}</h1>
        <span>{activeSlide.text}</span>
      </article>

      <footer className={styles.cutsceneFooter}>
        <div className={styles.cutsceneProgress} aria-label="Progresso da cena">
          {slides.map((slide, index) => (
            <button
              aria-label={`Ir para o plano ${index + 1}: ${slide.title}`}
              aria-current={index === activeIndex ? "step" : undefined}
              className={index <= activeIndex ? styles.cutsceneSeen : undefined}
              key={slide.title}
              type="button"
              onClick={() => setActiveIndex(index)}
            >
              <span />
            </button>
          ))}
        </div>

        <div className={styles.cutsceneControls}>
          <button
            disabled={activeIndex === 0}
            type="button"
            onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
          >
            Anterior
          </button>
          <button
            className={styles.cutscenePrimary}
            type="button"
            onClick={() => {
              if (isLastSlide) {
                completeRef.current();
              } else {
                setActiveIndex((current) => current + 1);
              }
            }}
          >
            {isLastSlide ? "Começar investigação" : "Próximo"}
          </button>
        </div>
      </footer>
    </section>
  );
}
