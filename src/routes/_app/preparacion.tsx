import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";
import { PageHeader, Card } from "@/components/app-ui";
import { SafetySteps, EmergencyContacts } from "@/components/safety-content";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";

type Tab = "drill" | "guide" | "kit" | "family";
export const Route = createFileRoute("/_app/preparacion")({
  validateSearch: (s: Record<string, unknown>): { tab?: Tab | undefined } => ({ tab: ["drill", "guide", "kit", "family"].includes(s["tab"] as string) ? (s["tab"] as Tab) : undefined }),
  head: () => ({
    meta: [
      { title: "Preparación ante sismos — Sismocan" },
      { name: "description", content: "Simulacros interactivos, mochila de emergencia, plan familiar y preparación para mascotas." },
      { property: "og:title", content: "Preparación — Sismocan" },
      { property: "og:description", content: "Simulacros y checklists de emergencia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Prepare,
});

function Prepare() {
  const { t } = useApp();
  const { tab } = Route.useSearch();
  return (
    <div>
      <PageHeader title={t("Preparación", "Preparedness")} subtitle={t("Practica con calma. Estar listo da tranquilidad.", "Practice calmly. Being ready brings peace of mind.")} />
      <Tabs defaultValue={tab ?? "drill"} className="px-5">
        <TabsList className="grid h-11 w-full grid-cols-4 rounded-full">
          <TabsTrigger value="drill" className="rounded-full text-xs">{t("Simulacro", "Drill")}</TabsTrigger>
          <TabsTrigger value="guide" className="rounded-full text-xs">{t("Guía", "Guide")}</TabsTrigger>
          <TabsTrigger value="kit" className="rounded-full text-xs">{t("Mochila", "Kit")}</TabsTrigger>
          <TabsTrigger value="family" className="rounded-full text-xs">{t("Familia", "Family")}</TabsTrigger>
        </TabsList>
        <TabsContent value="drill" className="mt-4"><Drill /></TabsContent>
        <TabsContent value="guide" className="mt-4 space-y-4">
          <SafetySteps />
          <h2 className="font-bold">{t("Contactos de emergencia", "Emergency contacts")}</h2>
          <EmergencyContacts />
        </TabsContent>
        <TabsContent value="kit" className="mt-4"><Checklist group="kit" /></TabsContent>
        <TabsContent value="family" className="mt-4 space-y-4"><Checklist group="family" /><Checklist group="pet" /></TabsContent>
      </Tabs>
    </div>
  );
}

function useScenarios() {
  const { t } = useApp();
  return [
    {
      q: t("Estás en tu sala y empieza a temblar fuerte. ¿Qué haces primero?", "You're in your living room and strong shaking starts. What first?"),
      opts: [
        { l: t("Correr hacia la calle", "Run outside"), ok: false, fb: t("Correr durante el movimiento aumenta el riesgo de caídas y golpes.", "Running while shaking increases fall and injury risk.") },
        { l: t("Agacharme, cubrirme y sujetarme", "Drop, cover and hold on"), ok: true, fb: t("¡Correcto! Protege cabeza y cuello junto a un mueble firme o zona segura.", "Correct! Protect head and neck near sturdy furniture or a safe zone.") },
        { l: t("Pararme junto a la ventana", "Stand by the window"), ok: false, fb: t("Los vidrios pueden romperse. Aléjate de ventanas.", "Glass can shatter. Stay away from windows.") },
      ],
    },
    {
      q: t("Estás en el piso 6 de un edificio. Terminó el sismo. ¿Cómo bajas?", "You're on the 6th floor. Shaking stopped. How do you go down?"),
      opts: [
        { l: t("Por el ascensor, es más rápido", "Elevator, it's faster"), ok: false, fb: t("Los ascensores pueden fallar tras un sismo.", "Elevators may fail after a quake.") },
        { l: t("Por las escaleras, caminando con calma", "Stairs, walking calmly"), ok: true, fb: t("Bien. Usa la ruta señalizada sin empujar.", "Good. Use the marked route without pushing.") },
      ],
    },
    {
      q: t("Estás en la playa y sentiste un sismo fuerte y largo.", "You're at the beach and felt a long, strong quake."),
      opts: [
        { l: t("Esperar a ver si el mar se retira", "Wait to see if the sea recedes"), ok: false, fb: t("No esperes señales: un sismo fuerte en la costa es razón para evacuar.", "Don't wait: a strong coastal quake is reason to evacuate.") },
        { l: t("Ir a zona alta de inmediato", "Go to high ground immediately"), ok: true, fb: t("Correcto. Sigue las rutas de evacuación ante tsunami.", "Correct. Follow tsunami evacuation routes.") },
      ],
    },
    {
      q: t("Después del sismo hueles a gas en casa.", "After the quake you smell gas at home."),
      opts: [
        { l: t("Encender la luz para revisar", "Turn on the light to check"), ok: false, fb: t("Una chispa puede causar un incendio.", "A spark can cause a fire.") },
        { l: t("Cerrar la llave de gas, ventilar y salir", "Shut gas, ventilate and leave"), ok: true, fb: t("Muy bien. Luego avisa a los bomberos (116).", "Great. Then call firefighters (116).") },
      ],
    },
  ];
}

function Drill() {
  const { t, set } = useApp();
  const sc = useScenarios();
  const [i, setI] = useState(-1);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  if (i === -1)
    return (
      <Card className="text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-muted text-3xl">🏠</div>
        <h2 className="mt-4 text-xl font-bold">{t("Simulacro en casa", "Home drill")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t(`${sc.length} escenarios realistas. Elige una acción y recibe una explicación.`, `${sc.length} realistic scenarios. Pick an action and get feedback.`)}</p>
        <Button size="lg" className="mt-5 w-full" onClick={() => setI(0)}>{t("Comenzar", "Start")}</Button>
      </Card>
    );

  if (i >= sc.length)
    return (
      <Card className="text-center animate-rise">
        <Trophy className="mx-auto size-12 text-warm" />
        <h2 className="mt-3 text-xl font-bold">{t("¡Simulacro completado!", "Drill complete!")}</h2>
        <p className="mt-1 text-muted-foreground">{t(`Acertaste ${score} de ${sc.length}.`, `You got ${score} of ${sc.length}.`)}</p>
        <Button size="lg" variant="soft" className="mt-5 w-full" onClick={() => { setI(0); setScore(0); setPick(null); }}>
          <RotateCcw /> {t("Repetir", "Repeat")}
        </Button>
      </Card>
    );

  const s = sc[i]!;
  const answered = pick !== null;
  return (
    <div className="space-y-4">
      <Progress value={((i + (answered ? 1 : 0)) / sc.length) * 100} />
      <Card>
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("Escenario", "Scenario")} {i + 1}/{sc.length}</p>
        <h2 className="mt-2 text-lg font-bold">{s.q}</h2>
        <div className="mt-4 space-y-2">
          {s.opts.map((o, k) => (
            <button
              key={k}
              disabled={answered}
              onClick={() => { setPick(k); if (o.ok) setScore((x) => x + 1); }}
              className={cn(
                "w-full rounded-2xl border-2 p-4 text-left text-sm font-semibold transition",
                !answered && "hover:border-primary",
                answered && o.ok && "border-primary bg-muted",
                answered && pick === k && !o.ok && "border-destructive",
              )}
            >
              {o.l}
            </button>
          ))}
        </div>
        {answered && (
          <div className={cn("mt-4 flex gap-2 rounded-2xl p-3 text-sm animate-rise", s.opts[pick]!.ok ? "bg-muted" : "bg-warm-soft")}>
            {s.opts[pick]!.ok ? <CheckCircle2 className="size-5 shrink-0 text-primary" /> : <XCircle className="size-5 shrink-0 text-destructive" />}
            {s.opts[pick]!.fb}
          </div>
        )}
      </Card>
      {answered && (
        <Button size="lg" className="w-full" onClick={() => { setPick(null); const n = i + 1; setI(n); if (n >= sc.length) set((p) => ({ drillsDone: p.drillsDone + 1 })); }}>
          {i + 1 < sc.length ? t("Siguiente", "Next") : t("Ver resultado", "See result")}
        </Button>
      )}
    </div>
  );
}

function Checklist({ group }: { group: "kit" | "family" | "pet" }) {
  const { t, s, set } = useApp();
  const lists = {
    kit: { title: t("Mochila de emergencia", "Emergency kit"), items: [t("Agua (4 L por persona/día)", "Water (4 L per person/day)"), t("Alimentos no perecibles", "Non-perishable food"), t("Linterna y pilas", "Flashlight and batteries"), t("Radio a pilas", "Battery radio"), t("Botiquín de primeros auxilios", "First aid kit"), t("Copias de documentos", "Document copies"), t("Silbato", "Whistle"), t("Abrigo y manta", "Warm clothes and blanket"), t("Dinero en efectivo", "Cash")] },
    family: { title: t("Plan familiar", "Family plan"), items: [t("Punto de reunión acordado", "Meeting point agreed"), t("Contacto fuera de la ciudad", "Out-of-town contact"), t("Zonas seguras marcadas en casa", "Safe zones marked at home"), t("Saber cerrar gas, agua y luz", "Know how to shut gas, water, power"), t("Simulacro familiar practicado", "Family drill practiced")] },
    pet: { title: t("Preparación para mascotas", "Pet preparedness"), items: [t("Correa y transportadora a mano", "Leash and carrier at hand"), t("Comida y agua para 3 días", "Food and water for 3 days"), t("Placa de identificación actualizada", "Updated ID tag"), t("Foto reciente de tu mascota", "Recent pet photo"), t("Carnet de vacunas", "Vaccination record")] },
  }[group];
  const done = lists.items.filter((_, i) => s.checklist[`${group}-${i}`]).length;
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-bold">{lists.title}</h2>
        <span className="text-sm font-semibold text-primary">{done}/{lists.items.length}</span>
      </div>
      <Progress value={(done / lists.items.length) * 100} className="mt-3" />
      <ul className="mt-4 space-y-1">
        {lists.items.map((it, i) => {
          const k = `${group}-${i}`;
          return (
            <li key={k}>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl px-1 py-2 text-sm">
                <Checkbox checked={!!s.checklist[k]} onCheckedChange={(v) => set((p) => ({ checklist: { ...p.checklist, [k]: !!v } }))} />
                <span className={cn(s.checklist[k] && "text-muted-foreground line-through")}>{it}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
