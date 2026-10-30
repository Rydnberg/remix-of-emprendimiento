import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Shell, Logo, LangToggle } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/app-store";

export const Route = createFileRoute("/ingresar")({
  head: () => ({
    meta: [
      { title: "Ingresar — Sismocan" },
      { name: "description", content: "Ingresa a tu cuenta de Sismocan." },
      { property: "og:title", content: "Ingresar — Sismocan" },
      { property: "og:description", content: "Accede a tu membresía." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const { t, s, set } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email) || pw.length < 6) {
      toast.error(t("Correo o contraseña inválidos.", "Invalid email or password."));
      return;
    }
    const user = s.user && s.user.email === email ? s.user : { name: email.split("@")[0] ?? email, email };
    set({ user });
    nav({ to: s.membership?.status === "active" && s.user?.email === email ? "/inicio" : "/membresia" });
  };
  return (
    <Shell className="px-5">
      <div className="flex items-center justify-between py-4">
        <Link to="/"><Logo /></Link>
        <LangToggle />
      </div>
      <h1 className="mt-10 text-3xl font-bold">{t("Bienvenido de vuelta", "Welcome back")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("Cuenta de demostración guardada en este dispositivo.", "Demo account saved on this device.")}</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("Correo", "Email")}</Label>
          <Input id="email" type="email" className="h-12 rounded-2xl" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw">{t("Contraseña", "Password")}</Label>
          <Input id="pw" type="password" className="h-12 rounded-2xl" value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>
        <Button size="lg" className="w-full">{t("Ingresar", "Log in")}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("¿Nuevo aquí?", "New here?")} <Link to="/membresia" className="font-semibold text-primary">{t("Ver membresía", "See membership")}</Link>
      </p>
    </Shell>
  );
}
