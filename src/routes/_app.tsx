import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading, nav]);

  if (loading || !user) {
    return (
      <div className="min-h-screen grid place-items-center bg-aurora">
        <div className="text-4xl animate-pulse">🧠</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aurora">
      <AppHeader />
      <Outlet />
    </div>
  );
}
