import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Shell, PageHeader } from "@/components/app-ui";
import { PlanPicker, Comparison } from "@/components/plans";
import { Button } from "@/components/ui/button";
import { useApp, type Plan } from "@/lib/app-store";

export const Route = createFileRoute("/membresia")({
  head: () => ({
    meta: [
      { title: "Membresía — Sismocan" },
      { name: "description", content: "Planes mensual y anual: mapas sísmicos, análisis histórico, simulacros e investigación canina." },
      { property: "og:title", content: "Membresía Sismocan" },
      { property: "og:description", content: "Compara los planes y hazte miembro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Membership,
});

function Membership() {
  const { t, s } = useApp();
  const [plan, setPlan] = useState<Plan>("annual");
  const nav = useNavigate();
  return (
    <Shell className="pb-32">
      <div className="px-5 pt-4">
        <Link to={s.user ? "/perfil" : "/"} className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
          <ArrowLeft className="size-4" /> {t("Volver", "Back")}
        </Link>
      </div>
      <PageHeader title={t("Membresía Sismocan", "Sismocan Membership")} subtitle={t("Todo lo que necesitas para entender y prepararte ante sismos.", "Everything to understand and prepare for earthquakes.")} />
      <div className="space-y-6 px-5">
        <div className="flex items-start gap-3 rounded-3xl bg-primary p-5 text-primary-foreground">
          <Sparkles className="mt-0.5 size-5 shrink-0" />
          <p className="text-sm">
            {t("No necesitas tener perro. Registrar una mascota es opcional y solo apoya la investigación.", "No dog required. Registering a pet is optional and only supports research.")}
          </p>
        </div>
        <PlanPicker value={plan} onChange={setPlan} />
        <Comparison />
        <div className="rounded-2xl bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">{t("Términos", "Terms")}: </strong>
          {t(
            "La membresía se renueva automáticamente al final de cada periodo. Puedes cancelar cuando quieras desde Perfil; mantienes el acceso hasta la fecha de renovación. Los precios mostrados son marcadores pendientes de aprobación.",
            "Membership renews automatically each period. Cancel anytime from Profile; access continues until the renewal date. Prices shown are placeholders pending approval.",
          )}
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t bg-card/95 p-4 backdrop-blur">
        <Button size="lg" className="w-full" onClick={() => nav({ to: "/registro", search: { plan } })}>
          {s.membership?.status === "active" ? t("Cambiar a este plan", "Switch to this plan") : t("Hazte miembro", "Become a Member")}
        </Button>
      </div>
    </Shell>
  );
}
