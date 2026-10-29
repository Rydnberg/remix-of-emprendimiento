import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, FlaskConical, CalendarClock, Dog, ShieldCheck } from "lucide-react";
import { PageHeader, Card } from "@/components/app-ui";
import { Switch } from "@/components/ui/switch";
import { fmtDate, useApp, type AppState } from "@/lib/app-store";
import { useQuakes, timeAgo } from "@/lib/use-quakes";

export const Route = createFileRoute("/_app/notificaciones")({
  head: () => ({
    meta: [
      { title: "Notificaciones — Sismocan" },
      { name: "description", content: "Información oficial, recordatorios y actualizaciones de investigación, claramente separadas." },
      { property: "og:title", content: "Notificaciones — Sismocan" },
      { property: "og:description", content: "Centro de notificaciones." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Notifications,
});

function Notifications() {
  const { t, s, set } = useApp();
  const { data } = useQuakes(30);
  const official = (data?.quakes ?? []).filter((q) => q.mag >= 4).slice(0, 3);
  const prefs: { k: keyof AppState["notif"]; l: string; hide?: boolean }[] = [
    { k: "official", l: t("Información sísmica oficial", "Official seismic info") },
    { k: "reminders", l: t("Recordatorios de preparación", "Preparedness reminders") },
    { k: "research", l: t("Actualizaciones de investigación", "Research updates") },
    { k: "billing", l: t("Avisos de renovación", "Renewal notices") },
    { k: "pet", l: t("Recordatorios de reporte de mascota", "Pet report reminders"), hide: !s.pet },
  ];

  return (
    <div>
      <div className="px-5 pt-4"><Link to="/inicio" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground"><ArrowLeft className="size-4" /> {t("Inicio", "Home")}</Link></div>
      <PageHeader title={t("Notificaciones", "Notifications")} />
      <div className="space-y-5 px-5">
        <section>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary"><BadgeCheck className="size-4" /> {t("Oficial · fuentes reconocidas", "Official · recognized sources")}</h2>
          <ul className="space-y-2">
            {official.map((q) => (
              <li key={q.id} className="rounded-3xl border-l-4 border-primary bg-card p-4 shadow-soft">
                <div className="text-sm font-bold">M{q.mag.toFixed(1)} · {q.place}</div>
                <div className="text-xs text-muted-foreground">{q.source} · {timeAgo(q.time, s.lang)}</div>
              </li>
            ))}
            {!official.length && <li className="rounded-3xl bg-muted p-4 text-sm text-muted-foreground">{t("Sin avisos oficiales recientes.", "No recent official notices.")}</li>}
          </ul>
        </section>
        <section>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">{t("Recordatorios", "Reminders")}</h2>
          <ul className="space-y-2">
            <li className="flex gap-3 rounded-3xl bg-muted p-4 text-sm"><ShieldCheck className="size-5 shrink-0 text-primary" /> {t("Revisa tu mochila de emergencia este mes.", "Check your emergency kit this month.")}</li>
            {s.membership && <li className="flex gap-3 rounded-3xl bg-muted p-4 text-sm"><CalendarClock className="size-5 shrink-0 text-primary" /> {t(`Tu membresía ${s.membership.status === "active" ? "se renueva" : "termina"} el ${fmtDate(s.membership.renewsAt, s.lang)}.`, `Your membership ${s.membership.status === "active" ? "renews" : "ends"} on ${fmtDate(s.membership.renewsAt, s.lang)}.`)}</li>}
            {s.pet && <li className="flex gap-3 rounded-3xl bg-muted p-4 text-sm"><Dog className="size-5 shrink-0 text-primary" /> {t(`¿Cómo estuvo ${s.pet.name} esta semana?`, `How was ${s.pet.name} this week?`)}</li>}
          </ul>
        </section>
        <section>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-warm-foreground"><FlaskConical className="size-4" /> {t("Investigación experimental", "Experimental research")}</h2>
          <div className="rounded-3xl border-2 border-dashed border-warm bg-warm-soft p-4 text-sm text-warm-foreground">
            {t("Nuevo resumen semanal de observaciones disponible. Esto no es una alerta sísmica.", "New weekly observation summary available. This is not an earthquake alert.")}
          </div>
        </section>
        <Card>
          <h2 className="font-bold">{t("Preferencias", "Preferences")}</h2>
          <ul className="mt-2 divide-y">
            {prefs.filter((p) => !p.hide).map((p) => (
              <li key={p.k} className="flex items-center justify-between py-3 text-sm">
                {p.l}
                <Switch checked={s.notif[p.k]} onCheckedChange={(v) => set((st) => ({ notif: { ...st.notif, [p.k]: v } }))} />
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">{t("La app nunca genera alertas sísmicas a partir de datos caninos.", "The app never generates quake alerts from canine data.")}</p>
        </Card>
      </div>
    </div>
  );
}
