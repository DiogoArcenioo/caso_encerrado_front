"use client";

import { useMemo, useSyncExternalStore } from "react";
import { StoredUser } from "./saveApi";

const USER_STORAGE_KEY = "caso-encerrado:user";

export function useStoredUser(): StoredUser | null {
  const snapshot = useSyncExternalStore(
    subscribeStoredUser,
    getStoredUserSnapshot,
    getServerSnapshot,
  );

  return useMemo(() => parseStoredUser(snapshot), [snapshot]);
}

function parseStoredUser(snapshot: string): StoredUser | null {
  try {
    return snapshot ? (JSON.parse(snapshot) as StoredUser) : null;
  } catch {
    return null;
  }
}

function subscribeStoredUser(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);

  return () => window.removeEventListener("storage", callback);
}

function getStoredUserSnapshot() {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(USER_STORAGE_KEY) ?? "";
}

function getServerSnapshot() {
  return "";
}
