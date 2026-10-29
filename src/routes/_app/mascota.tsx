import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Dog, Camera, Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, ResearchNote, ExperimentalTag } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { fmtDate, useApp, type Pet } from "@/lib/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/mascota")({
  head: () => ({
    meta: [
      { title: "Mi mascota — Sismocan" },
      { name: "description", content: "Registro opcional de tu perro y reportes de comportamiento para la investigación." },
      { property: "og:title", content: "Mi mascota — Sismocan" },
      { property: "og:description", content: "Aporta observaciones de comportamiento canino." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PetPage,
});

function PetPage() {
  const { t, s, set } = useApp();
  const [editing, setEditing] = useState(false);

  if (!s.pet || editing)
    return (
      <div>
        <PageHeader title={t("Mi mascota", "My Pet")} subtitle={t("Totalmente opcional.", "Entirely optional.")} />
        <div className="px-5">
          {!s.pet && s.petChoice === "none" && !editing ? (
            <Card className="text-center">
              <Dog className="mx-auto size-10 text-secondary" />
              <p className="mt-3 text-sm text-muted-foreground">{t("Elegiste continuar sin mascota. Tu membresía funciona igual.", "You chose to continue without a pet. Your membership works the same.")}</p>
              <Button variant="soft" className="mt-4" onClick={() => setEditing(true)}>{t("Registrar de todos modos", "Register anyway")}</Button>
            </Card>
          ) : (
            <PetForm initial={s.pet} onDone={(p) => { set({ pet: p, petChoice: "pet" }); setEditing(false); toast.success(t("Mascota guardada", "Pet saved")); }} onCancel={s.pet ? () => setEditing(false) : undefined} />
          )}
        </div>
      </div>
    );

  return (
    <div>
      <PageHeader title={t("Mi mascota", "My Pet")} right={<ExperimentalTag />} />
      <div className="space-y-4 px-5">
        <Card className="flex items-center gap-4">
          <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-3xl bg-muted">
            {s.pet.photo ? <img src={s.pet.photo} alt={s.pet.name} className="size-full object-cover" /> : <Dog className="size-9 text-primary" />}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold">{s.pet.name}</h2>
            <p className="text-sm text-muted-foreground">{[s.pet.breed, s.pet.age && `${s.pet.age} ${t("años", "yrs")}`, s.pet.activity].filter(Boolean).join(" · ")}</p>
          </div>
          <button aria-label={t("Editar", "Edit")} onClick={() => setEditing(true)} className="grid size-9 place-items-center rounded-full bg-muted"><Pencil className="size-4" /></button>
        </Card>
        <ReportForm />
        <div>
          <h2 className="mb-2 font-bold">{t("Historial de reportes", "Report history")}</h2>
          {s.observations.length === 0 ? (
            <p className="rounded-3xl bg-muted p-4 text-sm text-muted-foreground">{t("Aún no hay reportes.", "No reports yet.")}</p>
          ) : (
            <ul className="space-y-2">
              {s.observations.map((o) => (
                <li key={o.id} className="rounded-3xl border bg-card p-4">
                  <div className="flex justify-between text-sm"><span className="font-semibold">{fmtDate(o.date, s.lang)}</span><span className="text-muted-foreground">{t("Intensidad", "Intensity")} {o.intensity}/5</span></div>
                  <div className="mt-2 flex flex-wrap gap-1.5">{o.behaviors.map((b) => <span key={b} className="rounded-full bg-warm-soft px-2.5 py-1 text-xs font-semibold text-warm-foreground">{b}</span>)}</div>
                  {o.notes && <p className="mt-2 text-sm text-muted-foreground">{o.notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
        <ResearchNote />
      </div>
    </div>
  );
}

function PetForm({ initial, onDone, onCancel }: { initial: Pet | null; onDone: (p: Pet) => void; onCancel?: () => void }) {
  const { t } = useApp();
  const [p, setP] = useState<Pet>(initial ?? { name: "", age: "", breed: "", activity: "", behavior: "" });
  const f = (k: keyof Pet) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setP({ ...p, [k]: e.target.value });
  const acts = [t("Baja", "Low"), t("Media", "Medium"), t("Alta", "High")];
  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setP((x) => ({ ...x, photo: r.result as string }));
    r.readAsDataURL(file);
  };
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => { e.preventDefault(); if (!p.name.trim()) { toast.error(t("Escribe el nombre de tu mascota.", "Enter your pet's name.")); return; } onDone(p); }}
    >
      <label className="mx-auto grid size-24 cursor-pointer place-items-center overflow-hidden rounded-3xl border-2 border-dashed bg-muted">
        {p.photo ? <img src={p.photo} alt="" className="size-full object-cover" /> : <Camera className="size-7 text-muted-foreground" />}
        <input type="file" accept="image/*" className="sr-only" onChange={onPhoto} aria-label={t("Foto (opcional)", "Photo (optional)")} />
      </label>
      <div className="space-y-1.5"><Label htmlFor="pn">{t("Nombre", "Name")}</Label><Input id="pn" className="h-12 rounded-2xl" value={p.name} onChange={f("name")} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label htmlFor="pa">{t("Edad (años)", "Age (years)")}</Label><Input id="pa" inputMode="numeric" className="h-12 rounded-2xl" value={p.age} onChange={f("age")} /></div>
        <div className="space-y-1.5"><Label htmlFor="pb">{t("Raza", "Breed")}</Label><Input id="pb" className="h-12 rounded-2xl" value={p.breed} onChange={f("breed")} /></div>
      </div>
      <div className="space-y-1.5">
        <Label>{t("Nivel de actividad", "Activity level")}</Label>
        <div className="grid grid-cols-3 gap-2">
          {acts.map((a) => <button type="button" key={a} onClick={() => setP({ ...p, activity: a })} className={cn("rounded-2xl border-2 py-2.5 text-sm font-semibold", p.activity === a ? "border-primary bg-muted" : "border-border")}>{a}</button>)}
        </div>
      </div>
      <div className="space-y-1.5"><Label htmlFor="pt">{t("Comportamiento típico", "Typical behavior")}</Label><Textarea id="pt" className="rounded-2xl" value={p.behavior} onChange={f("behavior")} placeholder={t("Ej. tranquilo, ladra a extraños…", "E.g. calm, barks at strangers…")} /></div>
      <div className="flex gap-2">
        {onCancel && <Button type="button" variant="soft" size="lg" className="flex-1" onClick={onCancel}>{t("Cancelar", "Cancel")}</Button>}
        <Button size="lg" className="flex-1">{t("Guardar", "Save")}</Button>
      </div>
    </form>
  );
}

function ReportForm() {
  const { t, set } = useApp();
  const opts = [t("Ladridos inusuales", "Unusual barking"), t("Inquietud", "Restlessness"), t("Se esconde", "Hiding"), t("Menos actividad", "Less active"), t("Más actividad", "More active"), t("Aullidos", "Howling")];
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<string[]>([]);
  const [int, setInt] = useState(3);
  const [notes, setNotes] = useState("");
  if (!open)
    return <Button size="lg" variant="warm" className="w-full" onClick={() => setOpen(true)}><Plus /> {t("Reportar comportamiento", "Report behavior")}</Button>;
  return (
    <Card className="animate-rise">
      <h2 className="font-bold">{t("¿Qué notaste hoy?", "What did you notice today?")}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {opts.map((o) => (
          <button key={o} onClick={() => setSel((x) => (x.includes(o) ? x.filter((y) => y !== o) : [...x, o]))} className={cn("rounded-full border-2 px-3 py-1.5 text-sm font-semibold", sel.includes(o) ? "border-warm bg-warm-soft" : "border-border")}>{o}</button>
        ))}
      </div>
      <Label className="mt-4 block">{t("Intensidad", "Intensity")}: {int}/5</Label>
      <Slider className="mt-3" min={1} max={5} step={1} value={[int]} onValueChange={(v) => setInt(v[0])} />
      <Textarea className="mt-4 rounded-2xl" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("Notas (opcional)", "Notes (optional)")} />
      <div className="mt-4 flex gap-2">
        <Button variant="soft" className="flex-1" onClick={() => setOpen(false)}>{t("Cancelar", "Cancel")}</Button>
        <Button
          className="flex-1"
          disabled={!sel.length}
          onClick={() => {
            set((p) => ({ observations: [{ id: crypto.randomUUID(), date: new Date().toISOString(), behaviors: sel, intensity: int, notes }, ...p.observations] }));
            setSel([]); setNotes(""); setInt(3); setOpen(false);
            toast.success(t("Gracias. Tu reporte apoya la investigación.", "Thanks. Your report supports research."));
          }}
        >
          {t("Enviar", "Submit")}
        </Button>
      </div>
    </Card>
  );
}
