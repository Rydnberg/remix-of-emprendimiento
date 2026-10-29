import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Shell, BottomNav } from "@/components/app-ui";
import { useApp } from "@/lib/app-store";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { s, ready } = useApp();
  const nav = useNavigate();
  const allowed = !!s.user && !!s.membership;
  useEffect(() => {
    if (!ready) return;
    if (!s.user) nav({ to: "/ingresar" });
    else if (!s.membership) nav({ to: "/membresia" });
  }, [ready, s.user, s.membership, nav]);
  if (!ready || !allowed) return <Shell><div className="grid min-h-screen place-items-center text-sm text-muted-foreground">…</div></Shell>;
  return (
    <Shell className="pb-24">
      <Outlet />
      <BottomNav />
    </Shell>
  );
}
