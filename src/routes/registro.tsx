import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";
import { Shell, PageHeader } from "@/components/app-ui";
import { PlanPicker } from "@/components/plans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addMonths, useApp, type Plan } from "@/lib/app-store";

export const Route = createFileRoute("/registro")({
  validateSearch: (s: Record<string, unknown>) => ({ plan: (s["plan"] === "monthly" ? "monthly" : "annual") as Plan }),
  head: () => ({
    meta: [
      { title: "Crear cuenta y activar membresía — Sismocan" },
      { name: "description", content: "Crea tu cuenta y activa tu membresía (pago de demostración)." },
      { property: "og:title", content: "Activa tu membresía — Sismocan" },
      { property: "og:description", content: "Crea tu cuenta en Sismocan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Register,
});

function Register() {
  const { plan: initialPlan } = Route.useSearch();
  const { t, s, set } = useApp();
  const nav = useNavigate();
  const [plan, setPlan] = useState<Plan>(initialPlan);
  const [name, setName] = useState(s.user?.name ?? "");
  const [email, setEmail] = useState(s.user?.email ?? "");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const loggedIn = !!s.user;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedIn && (name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(email) || pw.length < 6)) {
      toast.error(t("Revisa tu nombre, correo y una contraseña de 6+ caracteres.", "Check name, email and a 6+ character password."));
      return;
    }
    setBusy(true);
    setTimeout(() => {
      const now = new Date();
      set((prev) => ({
        user: prev.user ?? { name: name.trim(), email: email.trim() },
        membership: { plan, status: "active", startedAt: now.toISOString(), renewsAt: addMonths(now, plan === "annual" ? 12 : 1).toISOString() },
      }));
      toast.success(t("¡Membresía activada! (demostración)", "Membership activated! (demo)"));
      nav({ to: s.petChoice ? "/inicio" : "/bienvenida" });
    }, 700);
  };

  return (
    <Shell className="pb-12">
      <div className="px-5 pt-4">
        <Link to="/membresia" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
          <ArrowLeft className="size-4" /> {t("Planes", "Plans")}
        </Link>
      </div>
      <PageHeader
        title={loggedIn ? t("Confirmar plan", "Confirm plan") : t("Crea tu cuenta", "Create your account")}
        subtitle={loggedIn ? undefined : t("¿Ya tienes cuenta?", "Already have an account?")}
        right={!loggedIn ? <Link to="/ingresar" className="pt-2 text-sm font-semibold text-primary">{t("Ingresar", "Log in")}</Link> : undefined}
      />
      <form onSubmit={submit} className="space-y-5 px-5">
        {!loggedIn && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">{t("Nombre", "Name")}</Label>
              <Input id="name" className="h-12 rounded-2xl" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("Correo", "Email")}</Label>
              <Input id="email" type="email" className="h-12 rounded-2xl" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw">{t("Contraseña", "Password")}</Label>
              <Input id="pw" type="password" className="h-12 rounded-2xl" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" />
            </div>
          </div>
        )}
        <PlanPicker value={plan} onChange={setPlan} />
        <div className="rounded-3xl border-2 border-dashed border-warm bg-warm-soft p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-warm-foreground">
            <CreditCard className="size-4" /> {t("Pago de demostración", "Demo checkout")}
          </div>
          <p className="mt-1 text-xs text-warm-foreground">
            {t("Este prototipo no procesa pagos reales ni pide datos de tarjeta. No se te cobrará nada.", "This prototype does not process real payments or collect card details. You won't be charged.")}
          </p>
        </div>
        <Button size="lg" className="w-full" disabled={busy}>
          <Lock /> {busy ? t("Activando…", "Activating…") : t("Activar membresía (demo)", "Activate membership (demo)")}
        </Button>
      </form>
    </Shell>
  );
}
