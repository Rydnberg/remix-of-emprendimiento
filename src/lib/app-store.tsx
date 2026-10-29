import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Demo prototype state. Persisted to localStorage only — no real accounts or payments.
 * Replace with a real backend + payment provider when integrating.
 */
export type Lang = "es" | "en";
export type Plan = "monthly" | "annual";
export type Observation = {
  id: string;
  date: string;
  behaviors: string[];
  intensity: number;
  notes: string;
};
export type Pet = {
  name: string;
  age: string;
  breed: string;
  activity: string;
  behavior: string;
  photo?: string;
};
export type AppState = {
  lang: Lang;
  user: { name: string; email: string } | null;
  membership: { plan: Plan; status: "active" | "canceled"; startedAt: string; renewsAt: string } | null;
  petChoice: "pet" | "none" | null;
  pet: Pet | null;
  observations: Observation[];
  checklist: Record<string, boolean>;
  notif: { official: boolean; reminders: boolean; research: boolean; billing: boolean; pet: boolean };
  drillsDone: number;
};

const initial: AppState = {
  lang: "es",
  user: null,
  membership: null,
  petChoice: null,
  pet: null,
  observations: [],
  checklist: {},
  notif: { official: true, reminders: true, research: false, billing: true, pet: true },
  drillsDone: 0,
};

const KEY = "sismocan-demo-v1";
type Ctx = {
  s: AppState;
  set: (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
  ready: boolean;
  reset: () => void;
};
const C = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<AppState>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setS({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(s));
  }, [s, ready]);
  useEffect(() => {
    document.documentElement.lang = s.lang;
  }, [s.lang]);
  const set: Ctx["set"] = (patch) =>
    setS((prev) => ({ ...prev, ...(typeof patch === "function" ? patch(prev) : patch) }));
  const reset = () => setS({ ...initial, lang: s.lang });
  return <C.Provider value={{ s, set, ready, reset }}>{children}</C.Provider>;
}

export function useApp() {
  const c = useContext(C);
  if (!c) throw new Error("useApp outside provider");
  const t = (es: string, en: string) => (c.s.lang === "es" ? es : en);
  return { ...c, t };
}

export function addMonths(d: Date, n: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

export function fmtDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(lang === "es" ? "es-PE" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
