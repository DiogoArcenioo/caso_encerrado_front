"use client";

import { useEffect, useState } from "react";
import { case01 } from "../data/case01";
import {
  accuse,
  cancelAccusation,
  chooseDialogue,
  createInitialState,
  inspectHotspot,
  openAccusation,
  startInvestigation,
  visitLocation,
} from "../systems/progression";
import { getCluePresentation } from "../systems/cluePresentation";
import { loadRemoteSave, saveProgress } from "../systems/saveApi";
import { migrateCaseKnowledge } from "../systems/stateMigration";
import { useStoredUser } from "../systems/userStore";
import {
  CaseData,
  CaseScore,
  DialogueOption,
  GameState,
  Hotspot,
} from "../types";
import { AccusationScreen } from "./AccusationScreen";
import { DetectiveNotebook } from "./DetectiveNotebook";
import { DialoguePanel } from "./DialoguePanel";
import { LocationMap } from "./LocationMap";
import { OpeningCutscene } from "./OpeningCutscene";
import { PauseMenu } from "./PauseMenu";
import { SceneView } from "./SceneView";
import { TravelPanel } from "./TravelPanel";
import styles from "./game.module.css";

type Notice = {
  id: string;
  text: string;
};

export function MissionGame({ startMode }: { startMode: "new" | "load" }) {
  const user = useStoredUser();
  const [state, setState] = useState<GameState>(() =>
    migrateCaseKnowledge(createInitialState(case01)),
  );
  const [saveStatus, setSaveStatus] = useState("");
  const [loadStatus, setLoadStatus] = useState(
    startMode === "new" ? "Novo jogo iniciado." : "Procurando save...",
  );
  const [notices, setNotices] = useState<Notice[]>([]);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState("");
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [mindOpen, setMindOpen] = useState(false);
  const [pauseMenuOpen, setPauseMenuOpen] = useState(false);
  const [openingVisible, setOpeningVisible] = useState(startMode === "new");
  const [travelDestinationIds, setTravelDestinationIds] = useState<string[]>(
    [],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key !== "Escape" ||
        event.repeat ||
        openingVisible
      ) {
        return;
      }

      event.preventDefault();
      setPauseMenuOpen((open) => !open);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openingVisible]);

  useEffect(() => {
    if (startMode === "new") {
      return;
    }

    let canceled = false;

    async function loadSave() {
      try {
        const save = await loadRemoteSave(case01.id, user);

        if (canceled) {
          return;
        }

        if (save) {
          setState(migrateCaseKnowledge(save));
          setLoadStatus("Progresso carregado.");
          setDialogueOpen(false);
        } else {
          setLoadStatus("Nenhum progresso salvo encontrado.");
          setDialogueOpen(false);
        }
      } catch {
        if (!canceled) {
          setLoadStatus("Não foi possível carregar do banco.");
          setDialogueOpen(false);
        }
      }
    }

    void loadSave();

    return () => {
      canceled = true;
    };
  }, [startMode, user]);

  function commit(nextState: GameState) {
    const migratedState = migrateCaseKnowledge(nextState);
    const discoveryNotices = buildDiscoveryNotices(
      state,
      migratedState,
      case01,
    );
    setState(migratedState);
    setSaveStatus("");
    pushNotices(discoveryNotices);
  }

  function pushNotices(texts: string[]) {
    if (!texts.length) {
      return;
    }

    const nextNotices = texts.map((text, index) => ({
      id: `${Date.now()}-${index}-${text}`,
      text,
    }));

    setNotices((current) => [...current, ...nextNotices].slice(-5));
    window.setTimeout(() => {
      setNotices((current) =>
        current.filter(
          (notice) =>
            !nextNotices.some((nextNotice) => nextNotice.id === notice.id),
        ),
      );
    }, 4200);
  }

  async function handleSave() {
    try {
      await saveProgress(state, user);
      setSaveStatus(
        user?.token
          ? "Progresso salvo no banco."
          : "Progresso salvo localmente como visitante.",
      );
    } catch {
      setSaveStatus("Não foi possível salvar no banco. Mantive um backup local.");
    }
  }

  function handleInspect(hotspot: Hotspot) {
    if (
      hotspot.id === "fachada-entrada" &&
      !state.dialogueFlags.includes("guarda_briefing")
    ) {
      setSelectedCharacterId("guarda-policial");
      setDialogueOpen(true);
      return;
    }

    const inspectedState = inspectHotspot(state, hotspot, case01);

    if (hotspot.destinationLocationIds) {
      setTravelDestinationIds(
        hotspot.destinationLocationIds.filter((locationId) =>
          inspectedState.unlockedLocations.includes(locationId),
        ),
      );
      commit(inspectedState);
      return;
    }

    if (
      hotspot.targetLocationId &&
      inspectedState.unlockedLocations.includes(hotspot.targetLocationId)
    ) {
      commit(visitLocation(inspectedState, hotspot.targetLocationId, case01));
      return;
    }

    commit(inspectedState);
  }

  function handleDialogue(characterId: string, option: DialogueOption) {
    commit(chooseDialogue(state, characterId, option, case01));
  }

  function handleTalk(characterId: string) {
    setSelectedCharacterId(characterId);
    setDialogueOpen(true);
  }

  function handleVisit(locationId: string) {
    commit(visitLocation(state, locationId, case01));
  }

  function handleReset() {
    setPauseMenuOpen(false);
    setDialogueOpen(false);
    setSelectedCharacterId("");
    setNotebookOpen(false);
    setLocationsOpen(false);
    setMindOpen(false);
    setTravelDestinationIds([]);
    setOpeningVisible(true);
    commit(createInitialState(case01));
  }

  const location = case01.locations[state.currentLocation];

  if (state.status === "intro") {
    return (
      <div className={styles.gameShell}>
        <SceneView caseData={case01} state={state} onInspect={() => null} />
        <section className={styles.caseStartOverlay}>
          <p>Primeira missão</p>
          <h1>{case01.title}</h1>
          <span>{case01.intro}</span>
          <button
            className={`${styles.button} ${styles.primary}`}
            type="button"
            onClick={() => {
              commit(startInvestigation(state));
              setDialogueOpen(false);
            }}
          >
            Entrar no caso
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.gameShell}>
      {openingVisible ? (
        <OpeningCutscene
          onComplete={() => {
            setOpeningVisible(false);
            commit(startInvestigation(state));
            setDialogueOpen(false);
          }}
        />
      ) : null}

      <SceneView
        caseData={case01}
        state={state}
        onInspect={handleInspect}
        onTalk={handleTalk}
      />

      <header className={styles.topHud}>
        <div>
          <span>{case01.title}</span>
          <h1>{location.name}</h1>
        </div>
        <p>{user ? `Investigador: ${user.nome}` : "Modo visitante"}</p>
      </header>

      <nav className={styles.actionDock} aria-label="Ações do caso">
        <button
          className={`${styles.button} ${styles.pauseMenuTrigger}`}
          type="button"
          onClick={() => setPauseMenuOpen(true)}
        >
          Menu
          <kbd>Esc</kbd>
        </button>
        <button
          className={styles.button}
          type="button"
          onClick={() => setNotebookOpen(true)}
        >
          Caderno
        </button>
        <button
          className={styles.button}
          type="button"
          onClick={() => setLocationsOpen(true)}
        >
          Locais
        </button>
        <button
          className={`${styles.button} ${styles.primarySoft}`}
          type="button"
          onClick={() => setMindOpen(true)}
        >
          Organizar a mente
        </button>
        <button className={styles.button} type="button" onClick={handleSave}>
          Salvar
        </button>
        <button
          className={styles.button}
          type="button"
          onClick={() => commit(openAccusation(state))}
        >
          Encerrar caso
        </button>
      </nav>

      <div className={styles.caseMeta}>
        <span>{loadStatus}</span>
        {saveStatus ? (
          <span
            className={
              saveStatus.includes("Não") ? styles.errorText : styles.successText
            }
          >
            {saveStatus}
          </span>
        ) : null}
        <button type="button" onClick={handleReset}>
          Resetar caso
        </button>
      </div>

      <div className={styles.noticeStack} aria-live="polite">
        {notices.map((notice) => (
          <div className={styles.discoveryNotice} key={notice.id}>
            <span>Arquivo atualizado</span>
            <strong>{notice.text}</strong>
          </div>
        ))}
      </div>

      {state.status === "ended" && state.finalResult ? (
        <section className={styles.finalOverlay}>
          <p>{state.finalResult.type}</p>
          <h2>{state.finalResult.title}</h2>
          <span>{state.finalResult.text}</span>
          {state.finalResult.score ? (
            <ScoreReport score={state.finalResult.score} />
          ) : null}
          <div className={styles.inlineActions}>
            <button className={styles.button} type="button" onClick={handleSave}>
              Salvar final
            </button>
            <button
              className={`${styles.button} ${styles.primary}`}
              type="button"
              onClick={handleReset}
            >
              Reiniciar caso
            </button>
          </div>
        </section>
      ) : null}

      {state.status === "accusation" ? (
        <div className={styles.accusationOverlay}>
          <AccusationScreen
            caseData={case01}
            onAccuse={(suspectId) => commit(accuse(state, suspectId, case01))}
            onCancel={() => commit(cancelAccusation(state))}
          />
        </div>
      ) : null}

      {dialogueOpen && state.status !== "accusation" ? (
        <DialoguePanel
          caseData={case01}
          key={selectedCharacterId}
          state={state}
          selectedCharacterId={selectedCharacterId}
          userName={user?.nome}
          onClose={() => setDialogueOpen(false)}
          onChoose={handleDialogue}
        />
      ) : null}

      <DetectiveNotebook
        caseData={case01}
        state={state}
        open={notebookOpen}
        onClose={() => setNotebookOpen(false)}
      />

      <LocationMap
        caseData={case01}
        state={state}
        open={locationsOpen}
        onClose={() => setLocationsOpen(false)}
        onVisit={handleVisit}
      />

      <TravelPanel
        caseData={case01}
        destinationIds={travelDestinationIds}
        open={travelDestinationIds.length > 0}
        onClose={() => setTravelDestinationIds([])}
        onTravel={handleVisit}
      />

      {mindOpen ? (
        <MindOrganizer
          caseData={case01}
          state={state}
          onClose={() => setMindOpen(false)}
        />
      ) : null}

      <PauseMenu
        locationName={location.name}
        open={pauseMenuOpen}
        saveStatus={saveStatus}
        onClose={() => setPauseMenuOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

function buildDiscoveryNotices(
  previous: GameState,
  next: GameState,
  caseData: CaseData,
) {
  const notices: string[] = [];
  const accusationSuspects = new Set(
    caseData.accusationSuspects.map((suspect) => suspect.characterId),
  );
  const suspectNoticeIds = new Set<string>();

  next.discoveredClues
    .filter((clueId) => !previous.discoveredClues.includes(clueId))
    .forEach((clueId) => {
      notices.push(`Nova pista adicionada ao caderno: ${caseData.clues[clueId].name}`);
    });

  Object.entries(next.suspectStates).forEach(([characterId, status]) => {
    const previousStatus = previous.suspectStates[characterId];
    const becameRelevant =
      status === "pessoa_de_interesse" || status === "suspeito";

    if (becameRelevant && previousStatus !== status) {
      suspectNoticeIds.add(characterId);
      notices.push(
        `Novo suspeito adicionado ao caderno: ${caseData.characters[characterId].name}`,
      );
    }
  });

  next.discoveredCharacters
    .filter((characterId) => !previous.discoveredCharacters.includes(characterId))
    .filter(
      (characterId) =>
        !accusationSuspects.has(characterId) || !suspectNoticeIds.has(characterId),
    )
    .forEach((characterId) => {
      notices.push(
        `Nova pessoa adicionada ao caderno: ${caseData.characters[characterId].name}`,
      );
    });

  next.contradictions
    .filter((item) => !previous.contradictions.includes(item))
    .forEach((item) => {
      notices.push(`Nova contradição adicionada ao caderno: ${item}`);
    });

  next.unlockedLocations
    .filter((locationId) => !previous.unlockedLocations.includes(locationId))
    .forEach((locationId) => {
      notices.push(`Novo local liberado: ${caseData.locations[locationId].name}`);
    });

  return notices;
}

function ScoreReport({ score }: { score: CaseScore }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const earnedItems = score.items.filter((item) => item.earned);
  const missedItems = score.items.filter((item) => !item.earned);

  return (
    <div className={styles.scoreReport}>
      <div className={styles.scoreHeadline}>
        <strong>{score.percent}%</strong>
        <div>
          <h3>{score.rankTitle}</h3>
          <p>{score.rankText}</p>
        </div>
      </div>
      <p className={styles.scorePoints}>
        {score.earnedPoints} de {score.maxPoints} pontos — {earnedItems.length}{" "}
        de {score.items.length} descobertas
      </p>
      <button
        className={styles.button}
        type="button"
        onClick={() => setDetailsOpen((open) => !open)}
      >
        {detailsOpen ? "Ocultar relatório" : "Ver relatório da investigação"}
      </button>
      {detailsOpen ? (
        <div className={styles.scoreDetails}>
          <section>
            <h4>O que você descobriu</h4>
            {earnedItems.map((item) => (
              <p key={`${item.kind}-${item.label}`}>
                <span>+{item.points}</span> {item.label}
              </p>
            ))}
          </section>
          {missedItems.length ? (
            <section>
              <h4>O que ficou na sombra</h4>
              {missedItems.map((item) => (
                <p className={styles.scoreMissed} key={`${item.kind}-${item.label}`}>
                  <span>{item.points}</span>{" "}
                  {item.kind === "pista" ? "Uma pista" : "Um depoimento"} que
                  você não encontrou
                </p>
              ))}
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function MindOrganizer({
  caseData,
  state,
  onClose,
}: {
  caseData: CaseData;
  state: GameState;
  onClose: () => void;
}) {
  const mind = buildMindSummary(caseData, state);

  return (
    <div className={styles.drawerBackdrop}>
      <aside className={`${styles.drawer} ${styles.mindDrawer}`}>
        <div className={styles.drawerHeader}>
          <div>
            <span>Organizar a mente</span>
            <h2>Quadro mental</h2>
          </div>
          <button className={styles.iconButton} type="button" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className={styles.mindGrid}>
          <MindSection title="Pistas fortes" items={mind.strongClues} />
          <MindSection title="Contradições" items={mind.contradictions} />
          <MindSection title="Suspeitos" items={mind.suspects} />
          <MindSection title="Conversas feitas" items={mind.conversations} />
        </div>

        <section className={styles.nextSteps}>
          <h3>Próximos passos prováveis</h3>
          {mind.recommendations.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </section>
      </aside>
    </div>
  );
}

function MindSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className={styles.mindSection}>
      <h3>{title}</h3>
      {items.length ? (
        items.map((item) => <p key={item}>{item}</p>)
      ) : (
        <p>Nada relevante registrado ainda.</p>
      )}
    </section>
  );
}

function buildMindSummary(caseData: CaseData, state: GameState) {
  const strongClues = state.discoveredClues
    .map((clueId) => caseData.clues[clueId])
    .filter((clue) => clue.relevance === "alta" || clue.relevance === "decisiva")
    .map((clue) => {
      const presentation = getCluePresentation(clue, state);
      return `${presentation.name}: ${presentation.short}`;
    })
    .slice(-6);

  const suspects = Object.entries(state.suspectStates)
    .filter(([, status]) => status !== "desconhecido")
    .map(([characterId, status]) => {
      const character = caseData.characters[characterId];
      return `${character.name}: ${status.replaceAll("_", " ")}`;
    });

  const conversations = state.talkedCharacters
    .map((characterId) => caseData.characters[characterId]?.name)
    .filter((name): name is string => Boolean(name));

  return {
    strongClues,
    contradictions: state.contradictions,
    suspects,
    conversations,
    recommendations: buildRecommendations(state),
  };
}

function buildRecommendations(state: GameState) {
  const recommendations: string[] = [];

  if (!state.dialogueFlags.includes("guarda_briefing")) {
    recommendations.push(
      "Fale com o guarda na entrada para receber o briefing e liberar a porta do prédio.",
    );
  }

  if (!state.visitedLocations.includes("corredor-terceiro-andar")) {
    recommendations.push(
      "Depois do briefing, clique na entrada da fachada para subir ao corredor.",
    );
  }

  if (
    state.visitedLocations.includes("corredor-terceiro-andar") &&
    (!state.discoveredClues.includes("chave_reserva") ||
      !state.discoveredClues.includes("fechadura_arranhoes"))
  ) {
    recommendations.push(
      "No corredor, procure algo que explique a porta trancada sem arrombamento.",
    );
  }

  if (
    state.visitedLocations.includes("sala-vitima") &&
    !state.discoveredClues.includes("cofre_vazio")
  ) {
    recommendations.push(
      "Na sala, observe objetos fora do lugar antes de aceitar a janela como rota de fuga.",
    );
  }

  if (
    state.discoveredClues.includes("janela_aberta") &&
    !state.discoveredClues.includes("ferrugem_intacta")
  ) {
    recommendations.push(
      "A janela aponta para a escada de incêndio. Compare a fuga com marcas reais no metal.",
    );
  }

  if (
    state.discoveredClues.includes("relogio_quebrado") &&
    !state.dialogueFlags.includes("tiro_depois_trem")
  ) {
    recommendations.push(
      "O relógio quebrado precisa de uma testemunha de ouvido: pergunte a Dona Célia se o tiro veio antes ou depois do último trem.",
    );
  }

  if (
    state.discoveredClues.includes("cofre_vazio") &&
    (!state.discoveredClues.includes("mala_arrumada") ||
      !state.discoveredClues.includes("bilhete_ultimo_trem"))
  ) {
    recommendations.push(
      "O cofre vazio aponta para fuga. O quarto de Álvaro guarda a mala e um bilhete que explicam o plano — e abrem conversas novas.",
    );
  }

  if (
    state.dialogueFlags.includes("historia_irmao_elias") &&
    !state.talkedCharacters.includes("elias-moretti")
  ) {
    recommendations.push(
      "Elias entrou na história pelo relógio e pelo irmão. Desça até a recepção e clique nas caixas de correio para chegar ao apartamento dele.",
    );
  }

  if (
    state.talkedCharacters.includes("policial-responsavel") &&
    !state.dialogueFlags.includes("policial_laudo")
  ) {
    recommendations.push(
      "O policial responsável tem o laudo da perícia. Pergunte pela causa da morte e pela arma do crime.",
    );
  }

  if (
    state.discoveredClues.includes("arma_ausente") &&
    state.discoveredCharacters.includes("clara-marconi") &&
    !state.dialogueFlags.includes("clara_confirmou_revolver")
  ) {
    recommendations.push(
      "A arma do crime sumiu. Clara conhecia a casa do irmão: pergunte se Álvaro tinha um revólver.",
    );
  }

  if (
    state.discoveredClues.includes("xicara_borra") &&
    !state.dialogueFlags.includes("celia_cheiro_cafe")
  ) {
    recommendations.push(
      "A borra grossa na xícara é um preparo raro. Dona Célia conhece os cheiros do prédio: pergunte sobre aquela madrugada.",
    );
  }

  if (
    state.unlockedLocations.includes("apartamento-elias") &&
    !state.discoveredClues.includes("relogio_irmao")
  ) {
    recommendations.push(
      "A bancada de Elias guarda mais que ferramentas: examine também a gaveta entreaberta.",
    );
  }

  if (!recommendations.length) {
    recommendations.push(
      "Você já cruzou horários, porta, janela e motivos. Quando sentir que o caso está sólido, use o botão Encerrar caso e aponte um nome.",
    );
  }

  return recommendations.slice(0, 4);
}
