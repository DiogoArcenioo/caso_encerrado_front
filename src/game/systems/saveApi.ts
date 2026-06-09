import { GameState } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";
const LOCAL_SAVE_PREFIX = "caso-encerrado:save:";

export interface StoredUser {
  id: string;
  nome: string;
  email: string;
  token?: string;
}

export async function loadRemoteSave(
  caseId: string,
  user: StoredUser | null,
): Promise<GameState | null> {
  if (!user?.token) {
    return loadLocalSave(caseId, user);
  }

  const response = await fetch(`${API_URL}/game-saves/${caseId}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar o save.");
  }

  const data = (await response.json()) as {
    save?: { progress?: GameState };
  };

  return data.save?.progress ?? null;
}

export async function saveProgress(
  state: GameState,
  user: StoredUser | null,
): Promise<void> {
  saveLocalProgress(state, user);

  if (!user?.token) {
    return;
  }

  const response = await fetch(`${API_URL}/game-saves/${state.caseId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({
      progress: state,
      completed: state.status === "ended",
    }),
  });

  if (!response.ok) {
    throw new Error("Não foi possível salvar no banco.");
  }
}

export function loadStoredUser(): StoredUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem("caso-encerrado:user");
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function localSaveExists(caseId: string, user: StoredUser | null) {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(localStorage.getItem(localSaveKey(caseId, user)));
}

function saveLocalProgress(state: GameState, user: StoredUser | null) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(localSaveKey(state.caseId, user), JSON.stringify(state));
}

function loadLocalSave(caseId: string, user: StoredUser | null) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(localSaveKey(caseId, user));
    return raw ? (JSON.parse(raw) as GameState) : null;
  } catch {
    return null;
  }
}

function localSaveKey(caseId: string, user: StoredUser | null) {
  return `${LOCAL_SAVE_PREFIX}${user?.id ?? "visitor"}:${caseId}`;
}
