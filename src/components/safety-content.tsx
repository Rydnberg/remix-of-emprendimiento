import { Phone } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function SafetySteps() {
  const { t } = useApp();
  const phases = [
    {
      id: "before",
      title: t("Antes del sismo", "Before"),
      items: [
        t("Identifica zonas seguras y rutas de evacuación en casa y trabajo.", "Identify safe zones and evacuation routes."),
        t("Asegura muebles altos y objetos pesados a la pared.", "Secure tall furniture and heavy objects."),
        t("Prepara tu mochila de emergencia.", "Prepare your emergency kit."),
        t("Acuerda un punto de reunión familiar.", "Agree on a family meeting point."),
      ],
    },
    {
      id: "during",
      title: t("Durante el sismo", "During"),
      items: [
        t("Agáchate, cúbrete y sujétate. Mantén la calma.", "Drop, cover and hold on. Stay calm."),
        t("Aléjate de ventanas y objetos que puedan caer.", "Stay away from windows and falling objects."),
        t("No uses ascensores ni corras por escaleras.", "Don't use elevators or run down stairs."),
        t("Si estás en la playa y el sismo es fuerte, ve a zona alta.", "If on the coast and shaking is strong, go to high ground."),
      ],
    },
    {
      id: "after",
      title: t("Después del sismo", "After"),
      items: [
        t("Evacúa con calma por la ruta señalizada.", "Evacuate calmly via marked routes."),
        t("Revisa heridos; no muevas a lesionados graves.", "Check for injuries; don't move seriously injured."),
        t("Cierra gas y electricidad si hay daños.", "Shut off gas and power if damaged."),
        t("Infórmate solo por fuentes oficiales (IGP, INDECI).", "Follow official sources only (IGP, INDECI)."),
      ],
    },
  ];
  return (
    <Accordion type="single" collapsible defaultValue="during" className="space-y-2">
      {phases.map((p) => (
        <AccordionItem key={p.id} value={p.id} className="rounded-2xl border bg-card px-4">
          <AccordionTrigger className="font-display text-base font-bold">{p.title}</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2">
              {p.items.map((i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" /> {i}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function EmergencyContacts() {
  const { t } = useApp();
  const list = [
    { n: "116", l: t("Bomberos", "Firefighters") },
    { n: "105", l: t("Policía Nacional", "National Police") },
    { n: "106", l: t("SAMU — Emergencias médicas", "SAMU — Medical") },
    { n: "115", l: t("Defensa Civil (INDECI)", "Civil Defense (INDECI)") },
    { n: "119", l: t("Mensaje de voz en emergencias", "Emergency voice messages") },
  ];
  return (
    <ul className="divide-y rounded-2xl border bg-card">
      {list.map((c) => (
        <li key={c.n}>
          <a href={`tel:${c.n}`} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-medium">{c.l}</span>
            <span className="inline-flex items-center gap-1.5 font-display text-lg font-bold text-primary">
              <Phone className="size-4" /> {c.n}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
