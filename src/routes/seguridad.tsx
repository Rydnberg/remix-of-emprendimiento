import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Shell, PageHeader } from "@/components/app-ui";
import { SafetySteps, EmergencyContacts } from "@/components/safety-content";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-store";

export const Route = createFileRoute("/seguridad")({
  head: () => ({
    meta: [
      { title: "Seguridad ante sismos — Sismocan" },
      { name: "description", content: "Qué hacer antes, durante y después de un sismo, y números de emergencia en Perú. Gratis." },
      { property: "og:title", content: "Seguridad ante sismos — Sismocan" },
      { property: "og:description", content: "Instrucciones básicas y contactos oficiales de emergencia, gratis." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Safety,
});

function Safety() {
  const { t, s } = useApp();
  return (
    <Shell className="pb-12">
      <div className="px-5 pt-4">
        <Link to={s.user ? "/preparacion" : "/"} className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
          <ArrowLeft className="size-4" /> {t("Volver", "Back")}
        </Link>
      </div>
      <PageHeader title={t("Seguridad básica", "Basic safety")} subtitle={t("Siempre gratis, para todos.", "Always free, for everyone.")} />
      <div className="space-y-6 px-5">
        <SafetySteps />
        <div>
          <h2 className="mb-2 text-lg font-bold">{t("Números de emergencia", "Emergency numbers")}</h2>
          <EmergencyContacts />
        </div>
        <div className="grid gap-2">
          <a className="inline-flex items-center justify-between rounded-2xl bg-muted px-4 py-3 text-sm font-semibold" href="https://www.igp.gob.pe" target="_blank" rel="noreferrer">
            {t("Instituto Geofísico del Perú (IGP)", "Geophysical Institute of Peru (IGP)")} <ExternalLink className="size-4" />
          </a>
          <a className="inline-flex items-center justify-between rounded-2xl bg-muted px-4 py-3 text-sm font-semibold" href="https://www.gob.pe/indeci" target="_blank" rel="noreferrer">
            INDECI <ExternalLink className="size-4" />
          </a>
        </div>
        {!s.membership && (
          <Button asChild size="lg" className="w-full">
            <Link to="/membresia">{t("Conocer la membresía", "Explore membership")}</Link>
          </Button>
        )}
      </div>
    </Shell>
  );
}
