import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Map, ShieldCheck, Dog, User, FlaskConical, BadgeCheck, Activity } from "lucide-react";
import type { ReactNode } from "react";
import { useApp } from "@/lib/app-store";
import { BOUNDS, DOG_OBS, type Quake } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-screen bg-muted/60">
      <div className={cn("mx-auto min-h-screen w-full max-w-md bg-background", className)}>{children}</div>
    </div>
  );
}

export function Logo({ small }: { small?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-display font-bold text-foreground">
      <span className="relative grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
        <Activity className="size-4" />
      </span>
      {!small && <span className="text-lg tracking-tight">Sismocan</span>}
    </span>
  );
}

export function LangToggle() {
  const { s, set } = useApp();
  return (
    <div className="inline-flex rounded-full bg-muted p-0.5 text-xs font-semibold" role="group" aria-label="Idioma / Language">
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => set({ lang: l })}
          aria-pressed={s.lang === l}
          className={cn("rounded-full px-2.5 py-1 uppercase transition", s.lang === l ? "bg-card text-foreground shadow-soft" : "text-muted-foreground")}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string | undefined; right?: ReactNode }) {
  return (
    <header className="flex items-start justify-between gap-3 px-5 pb-4 pt-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-3xl border bg-card p-5 shadow-soft", className)}>{children}</section>;
}

export function VerifiedTag({ source }: { source?: string | undefined }) {
  const { t } = useApp();
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
      <BadgeCheck className="size-3.5" /> {t("Verificado", "Verified")}
      {source ? ` · ${source}` : ""}
    </span>
  );
}

export function ExperimentalTag() {
  const { t } = useApp();
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-warm-soft px-2.5 py-1 text-xs font-semibold text-warm-foreground">
      <FlaskConical className="size-3.5" /> {t("Experimental", "Experimental")}
    </span>
  );
}

export function ResearchNote() {
  const { t } = useApp();
  return (
    <p className="rounded-2xl bg-warm-soft p-3 text-xs leading-relaxed text-warm-foreground">
      {t(
        "Investigación experimental. El comportamiento canino NO es un método validado para predecir sismos y nunca genera alertas.",
        "Experimental research. Canine behavior is NOT a validated earthquake prediction method and never triggers alerts.",
      )}
    </p>
  );
}

export function BottomNav() {
  const { t } = useApp();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const items = [
    { to: "/inicio", icon: Home, label: t("Inicio", "Home") },
    { to: "/mapa", icon: Map, label: t("Mapa", "Map") },
    { to: "/preparacion", icon: ShieldCheck, label: t("Preparación", "Prepare") },
    { to: "/mascota", icon: Dog, label: t("Mi mascota", "My Pet") },
    { to: "/perfil", icon: User, label: t("Perfil", "Profile") },
  ] as const;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t bg-card/95 backdrop-blur" aria-label="Principal">
      <ul className="grid grid-cols-5">
        {items.map(({ to, icon: Icon, label }) => {
          const active = path.startsWith(to);
          return (
            <li key={to}>
              <Link to={to} className={cn("flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold", active ? "text-primary" : "text-muted-foreground")}>
                <span className={cn("grid h-7 w-12 place-items-center rounded-full transition", active && "bg-muted")}>
                  <Icon className="size-5" />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const PERU: [number, number][] = [
  [-81.3, -4.7], [-80.3, -3.4], [-78.4, -3.5], [-75.5, -0.1], [-73.6, -1.3], [-70.0, -2.3], [-70.0, -4.2],
  [-72.9, -5.3], [-73.2, -6.6], [-74.0, -7.5], [-73.0, -9.4], [-70.6, -9.8], [-70.5, -11.0], [-69.0, -11.0],
  [-68.7, -12.5], [-69.4, -15.3], [-69.0, -16.2], [-69.6, -17.3], [-70.4, -18.35], [-71.4, -17.7], [-74.0, -15.8],
  [-76.0, -14.0], [-76.4, -13.0], [-77.2, -12.0], [-78.0, -10.7], [-79.0, -8.5], [-79.9, -6.9], [-81.2, -6.0],
];
const W = 300;
const H = 415;
const px = (lon: number) => ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * W;
const py = (lat: number) => ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * H;

export function QuakeMap({
  quakes,
  showDogs,
  selected,
  onSelect,
  compact,
}: {
  quakes: Quake[];
  showDogs?: boolean;
  selected?: string | null;
  onSelect?: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("w-full rounded-2xl bg-muted", compact ? "max-h-56" : "")} role="img" aria-label="Mapa de sismos">
      <defs>
        <pattern id="grid" width="23" height="23" patternUnits="userSpaceOnUse">
          <path d="M23 0H0V23" fill="none" stroke="var(--color-border)" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#grid)" />
      <polygon points={PERU.map(([lo, la]) => `${px(lo)},${py(la)}`).join(" ")} fill="var(--color-card)" stroke="var(--color-secondary)" strokeWidth="2" strokeLinejoin="round" />
      {showDogs &&
        DOG_OBS.map((d, i) => (
          <rect key={i} x={px(d.lon) - 4 - d.n / 8} y={py(d.lat) - 4 - d.n / 8} width={8 + d.n / 4} height={8 + d.n / 4} rx="3" fill="var(--color-warm)" fillOpacity="0.45" stroke="var(--color-warm)" strokeDasharray="2 2" />
        ))}
      {quakes.map((q) => {
        const r = 3 + Math.max(0, q.mag - 2.5) * 3;
        const sel = selected === q.id;
        return (
          <g key={q.id} onClick={() => onSelect?.(q.id)} className={onSelect ? "cursor-pointer" : ""}>
            {sel && <circle cx={px(q.lon)} cy={py(q.lat)} r={r + 6} fill="none" stroke="var(--color-foreground)" strokeWidth="1.5" />}
            <circle cx={px(q.lon)} cy={py(q.lat)} r={r} fill="var(--color-primary)" fillOpacity={q.mag >= 4.5 ? 0.9 : 0.55} stroke="var(--color-card)" strokeWidth="1" />
          </g>
        );
      })}
    </svg>
  );
}

export function magLabel(m: number) {
  return m.toFixed(1);
}
