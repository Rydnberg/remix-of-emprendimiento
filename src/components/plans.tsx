import { Check, Minus } from "lucide-react";
import { useApp, type Plan } from "@/lib/app-store";
import { PRICING } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export function PlanPicker({ value, onChange }: { value: Plan; onChange: (p: Plan) => void }) {
  const { t } = useApp();
  const plans: { id: Plan; name: string; price: string; per: string }[] = [
    { id: "monthly", name: t("Mensual", "Monthly"), price: PRICING.monthly, per: t("/mes", "/mo") },
    { id: "annual", name: t("Anual", "Annual"), price: PRICING.annual, per: t("/año", "/yr") },
  ];
  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup">
      {plans.map((p) => {
        const on = value === p.id;
        return (
          <button
            key={p.id}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(p.id)}
            className={cn("rounded-3xl border-2 p-4 text-left transition", on ? "border-primary bg-muted" : "border-border bg-card")}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">{p.name}</span>
              <span className={cn("grid size-5 place-items-center rounded-full border-2", on ? "border-primary bg-primary text-primary-foreground" : "border-border")}>
                {on && <Check className="size-3" />}
              </span>
            </div>
            <div className="mt-3 font-display text-2xl font-bold">
              {PRICING.currency} {p.price}
              <span className="text-sm font-medium text-muted-foreground">{p.per}</span>
            </div>
            <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-warm-foreground">
              {t("Precio por definir", "Price TBD")}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function useBenefits() {
  const { t } = useApp();
  return [
    { l: t("Instrucciones básicas de seguridad", "Basic safety instructions"), free: true },
    { l: t("Contactos oficiales de emergencia", "Official emergency contacts"), free: true },
    { l: t("Mapa sísmico interactivo con filtros", "Interactive map with filters"), free: false },
    { l: t("Análisis histórico de actividad", "Historical activity analysis"), free: false },
    { l: t("Simulacros interactivos y checklists", "Interactive drills and checklists"), free: false },
    { l: t("Plan familiar personalizado", "Personalized family plan"), free: false },
    { l: t("Visualizaciones de investigación canina", "Canine research visualizations"), free: false },
    { l: t("Registro de mascota y observaciones (opcional)", "Pet registration & reports (optional)"), free: false },
  ];
}

export function Comparison() {
  const { t } = useApp();
  const b = useBenefits();
  return (
    <div className="overflow-hidden rounded-3xl border bg-card">
      <div className="grid grid-cols-[1fr_4rem_4rem] bg-muted px-4 py-3 text-xs font-bold uppercase tracking-wide">
        <span>{t("Incluye", "Includes")}</span>
        <span className="text-center">{t("Gratis", "Free")}</span>
        <span className="text-center text-primary">{t("Miembro", "Member")}</span>
      </div>
      {b.map((x) => (
        <div key={x.l} className="grid grid-cols-[1fr_4rem_4rem] items-center border-t px-4 py-3 text-sm">
          <span>{x.l}</span>
          <span className="grid place-items-center">{x.free ? <Check className="size-4 text-primary" /> : <Minus className="size-4 text-muted-foreground" />}</span>
          <span className="grid place-items-center"><Check className="size-4 text-primary" /></span>
        </div>
      ))}
    </div>
  );
}
