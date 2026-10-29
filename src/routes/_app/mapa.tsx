import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Card, QuakeMap, VerifiedTag, ExperimentalTag, ResearchNote } from "@/components/app-ui";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/app-store";
import { useQuakes, timeAgo } from "@/lib/use-quakes";
import { REGIONS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa sísmico — Sismocan" },
      { name: "description", content: "Sismos verificados en el Perú con filtros por región, magnitud y periodo." },
      { property: "og:title", content: "Mapa sísmico — Sismocan" },
      { property: "og:description", content: "Sismos verificados y capa experimental de observaciones caninas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { t, s } = useApp();
  const [days, setDays] = useState(30);
  const [region, setRegion] = useState<(typeof REGIONS)[number]["id"]>("all");
  const [minMag, setMinMag] = useState(3);
  const [dogs, setDogs] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const { data, isLoading } = useQuakes(days);
  const r = REGIONS.find((x) => x.id === region)!;
  const list = useMemo(
    () => (data?.quakes ?? []).filter((q) => q.mag >= minMag && q.lat >= r.lat[0] && q.lat <= r.lat[1]),
    [data, minMag, r],
  );
  const selected = list.find((q) => q.id === sel);
  const chip = (on: boolean) => cn("rounded-full px-3 py-1.5 text-xs font-semibold transition", on ? "bg-primary text-primary-foreground" : "bg-muted");

  return (
    <div>
      <PageHeader title={t("Mapa sísmico", "Earthquake map")} subtitle={data?.live ? t("Datos en vivo · USGS", "Live data · USGS") : t("Datos de demostración", "Demo data")} />
      <div className="space-y-4 px-5">
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((x) => (
            <button key={x.id} className={chip(region === x.id)} onClick={() => setRegion(x.id)}>{t(x.es, x.en)}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {[7, 30, 90].map((d) => (
            <button key={d} className={chip(days === d)} onClick={() => setDays(d)}>{d} {t("días", "days")}</button>
          ))}
          {[3, 4, 5].map((m) => (
            <button key={m} className={chip(minMag === m)} onClick={() => setMinMag(m)}>M{m}+</button>
          ))}
        </div>
        <Card className="p-3">
          {isLoading ? <div className="aspect-[3/4] animate-pulse rounded-2xl bg-muted" /> : <QuakeMap quakes={list} showDogs={dogs} selected={sel} onSelect={setSel} />}
          <div className="flex flex-wrap items-center gap-4 px-2 pt-3 text-xs">
            <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-full bg-primary" /> {t("Sismo verificado", "Verified quake")}</span>
            {dogs && <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded border border-dashed border-warm bg-warm/40" /> {t("Observación canina (experimental)", "Canine observation (experimental)")}</span>}
          </div>
        </Card>
        <label className="flex items-center justify-between rounded-3xl bg-warm-soft p-4">
          <span>
            <span className="block text-sm font-bold">{t("Capa de observaciones caninas", "Canine observation layer")}</span>
            <span className="text-xs text-warm-foreground">{t("Separada de los datos verificados", "Separate from verified data")}</span>
          </span>
          <Switch checked={dogs} onCheckedChange={setDogs} />
        </label>
        {dogs && <ResearchNote />}
        {selected && (
          <Card className="animate-rise">
            <div className="flex items-center justify-between"><VerifiedTag source={selected.source} /><button className="text-xs font-semibold text-muted-foreground" onClick={() => setSel(null)}>{t("Cerrar", "Close")}</button></div>
            <div className="mt-3 font-display text-3xl font-bold text-primary">M {selected.mag.toFixed(1)}</div>
            <div className="font-semibold">{selected.place}</div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-2xl bg-muted p-3"><dt className="text-xs text-muted-foreground">{t("Profundidad", "Depth")}</dt><dd className="font-bold">{selected.depth} km</dd></div>
              <div className="rounded-2xl bg-muted p-3"><dt className="text-xs text-muted-foreground">{t("Fecha", "Date")}</dt><dd className="font-bold">{new Date(selected.time).toLocaleString(s.lang === "es" ? "es-PE" : "en-US", { dateStyle: "medium", timeStyle: "short" })}</dd></div>
            </dl>
          </Card>
        )}
        <div>
          <h2 className="mb-2 flex items-center justify-between font-bold">{t("Historial", "History")} <span className="text-sm font-medium text-muted-foreground">{list.length}</span></h2>
          <ul className="divide-y rounded-3xl border bg-card">
            {list.slice(0, 25).map((q) => (
              <li key={q.id}>
                <button onClick={() => { setSel(q.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex w-full items-center gap-3 px-4 py-3 text-left">
                  <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl font-display font-bold", q.mag >= 4.5 ? "bg-primary text-primary-foreground" : "bg-muted text-primary")}>{q.mag.toFixed(1)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{q.place}</span>
                    <span className="text-xs text-muted-foreground">{q.depth} km · {timeAgo(q.time, s.lang)}</span>
                  </span>
                </button>
              </li>
            ))}
            {!list.length && !isLoading && <li className="p-4 text-sm text-muted-foreground">{t("Sin sismos con estos filtros.", "No quakes for these filters.")}</li>}
          </ul>
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground"><ExperimentalTag /> {t("Los datos caninos nunca se muestran como predicción.", "Canine data is never shown as a prediction.")}</div>
      </div>
    </div>
  );
}
