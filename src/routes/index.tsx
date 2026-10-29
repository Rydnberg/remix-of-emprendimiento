import { createFileRoute, Link } from "@tanstack/react-router";
import { Map, ShieldCheck, FlaskConical, LineChart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell, Logo, LangToggle } from "@/components/app-ui";
import { useApp } from "@/lib/app-store";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sismocan — Monitoreo sísmico y preparación ante sismos" },
      { name: "description", content: "Membresía con mapas sísmicos, herramientas de preparación e investigación canina experimental. No necesitas tener perro." },
      { property: "og:title", content: "Sismocan — Monitoreo sísmico y preparación" },
      { property: "og:description", content: "Mapas sísmicos, simulacros y preparación, con investigación canina experimental." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Intro,
});

function Intro() {
  const { t, s } = useApp();
  const benefits = [
    { icon: Map, title: t("Mapa sísmico interactivo", "Interactive quake map"), body: t("Sismos verificados con magnitud, profundidad y ubicación.", "Verified quakes with magnitude, depth and location.") },
    { icon: ShieldCheck, title: t("Preparación guiada", "Guided preparedness"), body: t("Simulacros interactivos, mochila de emergencia y plan familiar.", "Interactive drills, emergency kit and family plan.") },
    { icon: LineChart, title: t("Análisis histórico", "Historical analysis"), body: t("Compara la actividad sísmica de las últimas semanas.", "Compare seismic activity over recent weeks.") },
    { icon: FlaskConical, title: t("Investigación canina", "Canine research"), body: t("Observaciones agregadas de perros, claramente experimentales.", "Aggregated dog observations, clearly experimental.") },
  ];
  return (
    <Shell>
      <header className="flex items-center justify-between px-5 py-4">
        <Logo />
        <div className="flex items-center gap-2">
          <LangToggle />
          <Link to={s.user ? "/inicio" : "/ingresar"} className="text-sm font-semibold text-primary">
            {s.user ? t("Entrar", "Open") : t("Ingresar", "Log in")}
          </Link>
        </div>
      </header>
      <div className="px-5">
        <div className="relative overflow-hidden rounded-[2rem]">
          <img src={hero} alt={t("Persona con su perro mirando la ciudad al atardecer", "Person and dog overlooking the city")} className="h-72 w-full object-cover" width={896} height={1024} />
        </div>
        <h1 className="mt-6 text-[2rem] font-bold leading-[1.1] animate-rise">
          {t("Entiende los sismos. Prepárate con calma.", "Understand earthquakes. Prepare calmly.")}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {t(
            "Información sísmica verificada, herramientas de preparación y una investigación canina experimental. No necesitas tener perro.",
            "Verified seismic information, preparedness tools and experimental canine research. No dog required.",
          )}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button asChild size="lg">
            <Link to="/membresia">
              {t("Ver membresía", "See membership")} <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="soft">
            <Link to="/seguridad">{t("Seguridad básica gratuita", "Free basic safety info")}</Link>
          </Button>
        </div>
      </div>
      <section className="mt-10 grid gap-3 px-5 pb-12">
        {benefits.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-4 rounded-3xl bg-muted p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-card text-primary">
              <Icon className="size-5" />
            </span>
            <div>
              <h2 className="font-bold">{title}</h2>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          </div>
        ))}
        <p className="pt-2 text-center text-xs text-muted-foreground">
          {t("Prototipo de demostración. Datos sísmicos: USGS cuando hay conexión.", "Demo prototype. Seismic data: USGS when available.")}
        </p>
      </section>
    </Shell>
  );
}
