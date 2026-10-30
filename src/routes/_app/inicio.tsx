import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, PlayCircle, Lightbulb, ChevronRight, Crown, FlaskConical } from "lucide-react";
import { Card, QuakeMap, VerifiedTag, ExperimentalTag, LangToggle } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { fmtDate, useApp } from "@/lib/app-store";
import { useQuakes, timeAgo } from "@/lib/use-quakes";
import { WEEKLY_TREND } from "@/lib/demo-data";

export const Route = createFileRoute("/_app/inicio")({
  head: () => ({
    meta: [
      { title: "Inicio — Sismocan" },
      { name: "description", content: "Tu panel: sismos recientes, mapa, observaciones y preparación." },
      { property: "og:title", content: "Inicio — Sismocan" },
      { property: "og:description", content: "Panel de monitoreo sísmico." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomePage,
});

const TIPS: [string, string][] = [
  ["Revisa las pilas de tu linterna una vez al mes.", "Check your flashlight batteries monthly."],
  ["Guarda copias de tus documentos en una bolsa impermeable.", "Keep document copies in a waterproof bag."],
  ["Practica tu ruta de evacuación con toda la familia.", "Practice your evacuation route with your family."],
  ["Ten 4 litros de agua por persona por día, para 3 días.", "Store 4 liters of water per person per day, for 3 days."],
];

function HomePage() {
  const { t, s } = useApp();
  const { data, isLoading } = useQuakes(30);
  const quakes = data?.quakes ?? [];
  const latest = quakes[0];
  const tip = TIPS[new Date().getDate() % TIPS.length]!;
  const lastWeek = WEEKLY_TREND[WEEKLY_TREND.length - 1]!;
  const m = s.membership!;
  const hour = new Date().getHours();
  const greet = hour < 12 ? t("Buenos días", "Good morning") : hour < 19 ? t("Buenas tardes", "Good afternoon") : t("Buenas noches", "Good evening");

  return (
    <div className="space-y-4 px-5 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{greet}</p>
          <h1 className="text-2xl font-bold">{s.user?.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LangToggle />
          <Link to="/notificaciones" aria-label={t("Notificaciones", "Notifications")} className="grid size-10 place-items-center rounded-full bg-muted">
            <Bell className="size-5" />
          </Link>
        </div>
      </header>

      <Link to="/perfil" className="flex items-center gap-3 rounded-3xl bg-primary p-4 text-primary-foreground">
        <Crown className="size-5" />
        <div className="flex-1 text-sm">
          <div className="font-bold">
            {m.status === "active" ? t("Membresía activa", "Active membership") : t("Membresía cancelada", "Membership canceled")} · {m.plan === "annual" ? t("Anual", "Annual") : t("Mensual", "Monthly")}
          </div>
          <div className="opacity-90">
            {m.status === "active" ? t("Se renueva el", "Renews on") : t("Acceso hasta el", "Access until")} {fmtDate(m.renewsAt, s.lang)}
          </div>
        </div>
        <ChevronRight className="size-5" />
      </Link>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="font-bold">{t("Último sismo verificado", "Latest verified quake")}</h2>
          <VerifiedTag source={latest?.source} />
        </div>
        {isLoading || !latest ? (
          <div className="mt-4 h-16 animate-pulse rounded-2xl bg-muted" />
        ) : (
          <div className="mt-4 flex items-center gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-muted">
              <span className="font-display text-2xl font-bold text-primary">{latest.mag.toFixed(1)}</span>
            </div>
            <div className="min-w-0 text-sm">
              <div className="truncate font-semibold">{latest.place}</div>
              <div className="text-muted-foreground">
                {t("Profundidad", "Depth")} {latest.depth} km · {timeAgo(latest.time, s.lang)}
              </div>
            </div>
          </div>
        )}
        {data && !data.live && <p className="mt-3 text-xs text-muted-foreground">{t("Mostrando datos de demostración (sin conexión a USGS).", "Showing demo data (USGS unavailable).")}</p>}
      </Card>

      <Link to="/mapa" className="block">
        <Card className="p-3">
          <QuakeMap quakes={quakes.slice(0, 30)} compact />
          <div className="flex items-center justify-between px-2 pt-3 text-sm font-semibold">
            {t(`${quakes.length} sismos en 30 días`, `${quakes.length} quakes in 30 days`)}
            <span className="inline-flex items-center text-primary">{t("Abrir mapa", "Open map")} <ChevronRight className="size-4" /></span>
          </div>
        </Card>
      </Link>

      <Card className="bg-warm-soft">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold"><FlaskConical className="size-4" /> {t("Observaciones caninas", "Canine observations")}</h2>
          <ExperimentalTag />
        </div>
        <p className="mt-3 text-sm">
          {t(`${lastWeek.obs} reportes agregados esta semana en todo el país. Tendencia estable.`, `${lastWeek.obs} aggregated reports this week nationwide. Stable trend.`)}
        </p>
        <p className="mt-2 text-xs text-warm-foreground">{t("No es una predicción de sismos.", "Not an earthquake prediction.")}</p>
        <Link to="/investigacion" className="mt-3 inline-flex items-center text-sm font-semibold">{t("Ver investigación", "View research")} <ChevronRight className="size-4" /></Link>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/preparacion" search={{ tab: "drill" }} className="rounded-3xl bg-foreground p-4 text-background">
          <PlayCircle className="size-7" />
          <div className="mt-6 font-display font-bold">{t("Iniciar simulacro", "Start a drill")}</div>
          <div className="text-xs opacity-80">{t("3 minutos", "3 minutes")}</div>
        </Link>
        <div className="rounded-3xl bg-muted p-4">
          <Lightbulb className="size-7 text-warm" />
          <div className="mt-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("Consejo", "Tip")}</div>
          <div className="text-sm font-medium">{t(tip[0], tip[1])}</div>
        </div>
      </div>

      <Button asChild variant="soft" size="lg" className="w-full">
        <Link to="/investigacion">{t("Explorar funciones avanzadas", "Explore advanced features")}</Link>
      </Button>
    </div>
  );
}
