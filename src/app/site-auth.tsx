"use client";

import Link from "next/link";
import {
  FormEvent,
  ReactNode,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import styles from "./page.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";
const STORAGE_KEY = "caso-encerrado:user";
const AUTH_OPEN_EVENT = "caso-encerrado:open-auth";
const USER_CHANGED_EVENT = "caso-encerrado:user-changed";

type AuthMode = "login" | "signup";
type Feedback =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

interface User {
  id: string;
  nome: string;
  email: string;
  token?: string;
}

export function SiteHeader() {
  const userSnapshot = useSyncExternalStore(
    subscribeStoredUser,
    getStoredUserSnapshot,
    getServerUserSnapshot,
  );
  const user = parseStoredUser(userSnapshot);
  const [mode, setMode] = useState<AuthMode | null>(null);

  useEffect(() => {
    function handleOpen(event: Event) {
      const customEvent = event as CustomEvent<{ mode?: AuthMode }>;
      setMode(customEvent.detail?.mode ?? "login");
    }

    window.addEventListener(AUTH_OPEN_EVENT, handleOpen);

    if (new URLSearchParams(window.location.search).get("auth") === "login") {
      window.dispatchEvent(
        new CustomEvent(AUTH_OPEN_EVENT, {
          detail: { mode: "login" },
        }),
      );
    }

    return () => window.removeEventListener(AUTH_OPEN_EVENT, handleOpen);
  }, []);

  function handleAuthenticated(authenticatedUser: User) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
    window.dispatchEvent(new Event(USER_CHANGED_EVENT));
    setMode(null);
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(USER_CHANGED_EVENT));
  }

  return (
    <>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          Caso Encerrado
        </Link>
        <nav className={styles.nav} aria-label="Navegação principal">
          <a href="#projeto">Projeto</a>
          {user ? (
            <div className={styles.userMenu}>
              <span>{user.nome}</span>
              <button className={styles.navButton} type="button" onClick={handleLogout}>
                Sair
              </button>
            </div>
          ) : (
            <div className={styles.authMenu}>
              <button
                className={styles.navButton}
                type="button"
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                className={styles.navButton}
                type="button"
                onClick={() => setMode("signup")}
              >
                Criar usuário
              </button>
            </div>
          )}
        </nav>
      </header>

      {mode ? (
        <AuthModal
          key={mode}
          mode={mode}
          onClose={() => setMode(null)}
          onModeChange={setMode}
          onAuthenticated={handleAuthenticated}
        />
      ) : null}
    </>
  );
}

export function AuthOpenButton({
  children,
  className,
  mode = "login",
}: {
  children: ReactNode;
  className: string;
  mode?: AuthMode;
}) {
  function handleClick() {
    window.dispatchEvent(
      new CustomEvent(AUTH_OPEN_EVENT, {
        detail: { mode },
      }),
    );
  }

  return (
    <button className={className} type="button" onClick={handleClick}>
      {children}
    </button>
  );
}

function AuthModal({
  mode,
  onClose,
  onModeChange,
  onAuthenticated,
}: {
  mode: AuthMode | null;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
  onAuthenticated: (user: User) => void;
}) {
  const [feedback, setFeedback] = useState<Feedback>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const senha = String(formData.get("password") ?? "");

    await submitAuth({
      endpoint: "/usuarios/login",
      payload: { email, senha },
      emptyMessage: "Preencha e-mail e senha para entrar.",
      onSuccess: onAuthenticated,
    });
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const nome = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const senha = String(formData.get("password") ?? "");

    await submitAuth({
      endpoint: "/usuarios",
      payload: { nome, email, senha },
      emptyMessage: "Preencha nome, e-mail e senha para criar o usuário.",
      onSuccess: (user) => {
        form.reset();
        onAuthenticated(user);
      },
    });
  }

  async function submitAuth({
    endpoint,
    payload,
    emptyMessage,
    onSuccess,
  }: {
    endpoint: string;
    payload: { nome?: string; email: string; senha: string };
    emptyMessage: string;
    onSuccess: (user: User) => void;
  }) {
    setFeedback({ type: "idle", message: "" });

    if (!payload.email || !payload.senha || ("nome" in payload && !payload.nome)) {
      setFeedback({ type: "error", message: emptyMessage });
      return;
    }

    if (payload.senha.length < 6) {
      setFeedback({
        type: "error",
        message: "A senha precisa ter pelo menos 6 caracteres.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as User | unknown;

      if (!response.ok) {
        throw new Error(getErrorMessage(data));
      }

      onSuccess(data as User);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível completar a ação agora.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <section
        className={styles.modal}
        aria-labelledby="auth-modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.eyebrow}>Conta do detetive</p>
            <h2 id="auth-modal-title">
              {mode === "login" ? "Fazer Login" : "Criar Usuário"}
            </h2>
          </div>
          <button className={styles.closeButton} type="button" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className={styles.modalTabs}>
          <button
            className={mode === "login" ? styles.activeTab : ""}
            type="button"
            onClick={() => onModeChange("login")}
          >
            Login
          </button>
          <button
            className={mode === "signup" ? styles.activeTab : ""}
            type="button"
            onClick={() => onModeChange("signup")}
          >
            Criar usuário
          </button>
        </div>

        {mode === "login" ? (
          <form className={styles.modalForm} onSubmit={handleLogin}>
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
            />
            <label htmlFor="login-password">Senha</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
            />
            <button
              className={`${styles.button} ${styles.primary}`}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
        ) : (
          <form className={styles.modalForm} onSubmit={handleSignup}>
            <label htmlFor="signup-name">Nome de jogador</label>
            <input
              id="signup-name"
              name="name"
              type="text"
              autoComplete="nickname"
            />
            <label htmlFor="signup-email">E-mail</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
            />
            <label htmlFor="signup-password">Senha</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
            />
            <button
              className={`${styles.button} ${styles.primary}`}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Criando..." : "Criar usuário"}
            </button>
          </form>
        )}

        <FeedbackMessage feedback={feedback} />
      </section>
    </div>
  );
}

function FeedbackMessage({ feedback }: { feedback: Feedback }) {
  if (feedback.type === "idle") {
    return null;
  }

  return (
    <p className={`${styles.feedback} ${styles[feedback.type]}`}>
      {feedback.message}
    </p>
  );
}

function subscribeStoredUser(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(USER_CHANGED_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(USER_CHANGED_EVENT, callback);
  };
}

function getStoredUserSnapshot(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(STORAGE_KEY) ?? "";
}

function getServerUserSnapshot(): string {
  return "";
}

function parseStoredUser(snapshot: string): User | null {
  try {
    return snapshot ? (JSON.parse(snapshot) as User) : null;
  } catch {
    return null;
  }
}

function getErrorMessage(data: unknown): string {
  if (
    typeof data !== "object" ||
    data === null ||
    !("message" in data)
  ) {
    return "Não foi possível completar a ação agora.";
  }

  const message = data.message;

  if (Array.isArray(message)) {
    return message.join(" ");
  }

  return typeof message === "string"
    ? message
    : "Não foi possível completar a ação agora.";
}
