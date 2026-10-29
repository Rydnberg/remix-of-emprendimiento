import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Card, ResearchNote, ExperimentalTag, QuakeMap } from "@/components/app-ui";
import { useApp } from "@/lib/app-store";
import { BEHAVIOR_SHARE, SOURCES, WEEKLY_TREND } from "@/lib/demo-data";

export const Route = createFileRoute("/_app/investigacion")({
  head: () => ({
    meta: [
      { title: "Investigación canina — Sismocan" },
      { name: "description", content: "Observaciones caninas agregadas comparadas con la actividad sísmica histórica. Experimental." },
      { property: "og:title", content: "Investigación canina — Sismocan" },
      { property: "og:description", content: "Tendencias experimentales de comportamiento canino." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Research,
});

function Research() {
  const { t } = useApp();
  return (
    <div>
      <div className="px-5 pt-4">
        <Link to="/inicio" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground"><ArrowLeft className="size-4" /> {t("Inicio", "Home")}</Link>
      </div>
      <PageHeader title={t("Investigación canina", "Canine research")} subtitle={t("Datos agregados y anónimos · demostración", "Aggregated anonymous data · demo")} right={<ExperimentalTag />} />
      <div className="space-y-4 px-5">
        <ResearchNote />
        <Card>
          <h2 className="font-bold">{t("Reportes vs. sismos M3+ por semana", "Reports vs. M3+ quakes per week")}</h2>
          <p className="text-xs text-muted-foreground">{t("Comparación histórica, sin relación causal demostrada.", "Historical comparison, no proven causal link.")}</p>
          <div className="mt-3 h-52">
            <ResponsiveContainer>
              <ComposedChart data={WEEKLY_TREND}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="week" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="a" fontSize={11} tickLine={false} axisLine={false} width={30} />
                <YAxis yAxisId="b" orientation="right" fontSize={11} tickLine={false} axisLine={false} width={20} />
                <Tooltip />
                <Bar yAxisId="a" dataKey="obs" name={t("Reportes", "Reports")} fill="var(--color-warm)" radius={[6, 6, 0, 0]} />
                <Line yAxisId="b" dataKey="quakes" name={t("Sismos", "Quakes")} stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="font-bold">{t("Tipos de comportamiento reportado", "Reported behavior types")}</h2>
          <div className="mt-3 h-44">
            <ResponsiveContainer>
              <BarChart data={BEHAVIOR_SHARE.map((b) => ({ name: t(b.es, b.en), v: b.v }))} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={120} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="v" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-3">
          <h2 className="px-2 pb-2 font-bold">{t("Distribución geográfica", "Geographic distribution")}</h2>
          <QuakeMap quakes={[]} showDogs compact />
        </Card>
        <Card>
          <h2 className="font-bold">{t("Fuentes de datos (con consentimiento)", "Data sources (consent-based)")}</h2>
          <ul className="mt-3 space-y-3">
            {SOURCES.map((x) => (
              <li key={x.es}>
                <div className="flex justify-between text-sm"><span>{t(x.es, x.en)}</span><span className="font-semibold">{x.v}%</span></div>
                <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-secondary" style={{ width: `${x.v}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
