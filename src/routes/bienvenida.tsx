import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Dog, ArrowRight } from "lucide-react";
import { Shell } from "@/components/app-ui";
import { useApp } from "@/lib/app-store";

export const Route = createFileRoute("/bienvenida")({
  head: () => ({
    meta: [
      { title: "Bienvenida — Sismocan" },
      { name: "description", content: "Elige si quieres registrar a tu mascota o continuar sin ella." },
      { property: "og:title", content: "Bienvenida — Sismocan" },
      { property: "og:description", content: "Registro opcional de mascota." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { t, s, set } = useApp();
  const nav = useNavigate();
  return (
    <Shell className="flex flex-col px-5 pb-10 pt-16">
      <div className="relative mx-auto grid size-24 place-items-center">
        <span className="absolute inset-0 rounded-full bg-secondary animate-ripple" />
        <span className="relative grid size-20 place-items-center rounded-full bg-primary text-primary-foreground">
          <Dog className="size-9" />
        </span>
      </div>
      <h1 className="mt-8 text-center text-3xl font-bold">
        {t(`¡Hola${s.user ? `, ${s.user.name}` : ""}!`, `Hi${s.user ? `, ${s.user.name}` : ""}!`)}
      </h1>
      <p className="mt-2 text-center text-muted-foreground">
        {t("Tu membresía está activa. ¿Tienes un perro que quiera aportar a la investigación?", "Your membership is active. Do you have a dog to contribute to research?")}
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {t("Ambas opciones te dan exactamente la misma experiencia.", "Both options give you the exact same experience.")}
      </p>
      <div className="mt-auto space-y-3 pt-10">
        <button onClick={() => { set({ petChoice: "pet" }); nav({ to: "/mascota" }); }} className="flex w-full items-center justify-between rounded-3xl bg-primary p-5 text-left text-primary-foreground">
          <span>
            <span className="block font-display text-lg font-bold">{t("Registrar a mi mascota", "Register My Pet")}</span>
            <span className="text-sm opacity-90">{t("Opcional · apoya la investigación", "Optional · supports research")}</span>
          </span>
          <ArrowRight />
        </button>
        <button onClick={() => { set({ petChoice: "none" }); nav({ to: "/inicio" }); }} className="flex w-full items-center justify-between rounded-3xl border-2 bg-card p-5 text-left">
          <span className="font-display text-lg font-bold">{t("Continuar sin mascota", "Continue Without a Pet")}</span>
          <ArrowRight />
        </button>
      </div>
    </Shell>
  );
}
