import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Crown, CreditCard, Bell, LogOut, ChevronRight, Globe, Check } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, LangToggle } from "@/components/app-ui";
import { useBenefits } from "@/components/plans";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { addMonths, fmtDate, useApp, type Plan } from "@/lib/app-store";
import { PRICING } from "@/lib/demo-data";

export const Route = createFileRoute("/_app/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil y membresía — Sismocan" },
      { name: "description", content: "Gestiona tu membresía, plan, renovación, pagos y notificaciones." },
      { property: "og:title", content: "Perfil — Sismocan" },
      { property: "og:description", content: "Gestión de membresía y ajustes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { t, s, set, reset } = useApp();
  const nav = useNavigate();
  const m = s.membership!;
  const benefits = useBenefits().filter((b) => !b.free);
  const other: Plan = m.plan === "annual" ? "monthly" : "annual";
  const planName = (p: Plan) => (p === "annual" ? t("Anual", "Annual") : t("Mensual", "Monthly"));

  return (
    <div>
      <PageHeader title={t("Perfil", "Profile")} subtitle={s.user?.email} />
      <div className="space-y-4 px-5">
        <Card className="bg-primary text-primary-foreground">
          <div className="flex items-center gap-2 text-sm font-semibold opacity-90"><Crown className="size-4" /> {t("Tu membresía", "Your membership")}</div>
          <div className="mt-2 font-display text-2xl font-bold">{planName(m.plan)} · {PRICING.currency} {m.plan === "annual" ? PRICING.annual : PRICING.monthly}</div>
          <div className="mt-1 text-sm opacity-90">
            {m.status === "active" ? t("Activa · se renueva el", "Active · renews on") : t("Cancelada · acceso hasta el", "Canceled · access until")} {fmtDate(m.renewsAt, s.lang)}
          </div>
          <div className="mt-1 text-xs opacity-75">{t("Miembro desde", "Member since")} {fmtDate(m.startedAt, s.lang)}</div>
        </Card>

        <Card>
          <h2 className="font-bold">{t("Beneficios incluidos", "Included benefits")}</h2>
          <ul className="mt-3 space-y-2">
            {benefits.map((b) => <li key={b.l} className="flex gap-2 text-sm"><Check className="size-4 shrink-0 text-primary" /> {b.l}</li>)}
          </ul>
        </Card>

        <Card className="space-y-3">
          <h2 className="font-bold">{t("Gestionar membresía", "Manage membership")}</h2>
          <Button
            variant="soft"
            className="w-full justify-between"
            onClick={() => {
              set({ membership: { ...m, plan: other, renewsAt: addMonths(new Date(m.startedAt), other === "annual" ? 12 : 1).toISOString() } });
              toast.success(t(`Cambiaste al plan ${planName(other)} (demo)`, `Switched to ${planName(other)} plan (demo)`));
            }}
          >
            {t(`Cambiar a plan ${planName(other)}`, `Switch to ${planName(other)} plan`)} <ChevronRight />
          </Button>
          <Button variant="soft" className="w-full justify-between" onClick={() => toast(t("Pagos de demostración: no hay métodos de pago reales.", "Demo payments: no real payment methods."))}>
            <span className="inline-flex items-center gap-2"><CreditCard /> {t("Métodos de pago", "Payment settings")}</span>
            <span className="text-xs text-muted-foreground">{t("Demo", "Demo")}</span>
          </Button>
          {m.status === "active" ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full text-destructive">{t("Cancelar membresía", "Cancel membership")}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("¿Cancelar membresía?", "Cancel membership?")}</AlertDialogTitle>
                  <AlertDialogDescription>{t(`Mantendrás el acceso hasta el ${fmtDate(m.renewsAt, s.lang)}. No habrá más renovaciones. La seguridad básica sigue siendo gratuita.`, `You keep access until ${fmtDate(m.renewsAt, s.lang)}. No further renewals. Basic safety stays free.`)}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("Volver", "Back")}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => set({ membership: { ...m, status: "canceled" } })}>{t("Sí, cancelar", "Yes, cancel")}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button className="w-full" onClick={() => { set({ membership: { ...m, status: "active" } }); toast.success(t("Membresía renovada (demo)", "Membership renewed (demo)")); }}>
              {t("Renovar membresía", "Renew membership")}
            </Button>
          )}
          <p className="text-xs text-muted-foreground">{t("Renovación automática al final de cada periodo. Precios marcadores pendientes de aprobación. Prototipo: no se procesan pagos reales.", "Auto-renews each period. Placeholder prices pending approval. Prototype: no real payments processed.")}</p>
        </Card>

        <Card className="divide-y p-0">
          <Link to="/notificaciones" className="flex items-center justify-between px-5 py-4 text-sm font-semibold"><span className="inline-flex items-center gap-3"><Bell className="size-4" /> {t("Notificaciones", "Notifications")}</span><ChevronRight className="size-4" /></Link>
          <div className="flex items-center justify-between px-5 py-4 text-sm font-semibold"><span className="inline-flex items-center gap-3"><Globe className="size-4" /> {t("Idioma", "Language")}</span><LangToggle /></div>
          <button onClick={() => { reset(); nav({ to: "/" }); }} className="flex w-full items-center gap-3 px-5 py-4 text-sm font-semibold text-destructive"><LogOut className="size-4" /> {t("Cerrar sesión", "Log out")}</button>
        </Card>
      </div>
    </div>
  );
}
