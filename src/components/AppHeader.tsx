import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/useProfile";
import { LogOut, Sparkles, Flame, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/dashboard", label: "Home", emoji: "🏠" },
  { to: "/assessment", label: "Play", emoji: "🎯" },
  { to: "/chat", label: "AI Tutor", emoji: "💬" },
  { to: "/progress", label: "Progress", emoji: "📈" },
  { to: "/rewards", label: "Rewards", emoji: "🏆" },
] as const;

export function AppHeader() {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const nav = useNavigate();
  const loc = useLocation();

  return (
    <header className="sticky top-0 z-40 glass-strong border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-2 font-display font-bold text-lg shrink-0">
          <span className="text-2xl">🧠</span>
          <span className="text-gradient hidden sm:inline">SmartMind AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {NAV.map(item => {
            const active = loc.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active ? "bg-primary text-primary-foreground shadow-soft" : "hover:bg-muted"
                }`}>
                <span className="mr-1.5">{item.emoji}</span>{item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/20 text-warning-foreground font-bold text-sm">
            <Flame className="h-4 w-4 text-orange-500" /> {profile?.streak ?? 0}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-fun/30 text-fun-foreground font-bold text-sm">
            <Coins className="h-4 w-4 text-amber-500" /> {profile?.coins ?? 0}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 text-primary font-bold text-sm">
            <Sparkles className="h-4 w-4" /> {profile?.xp ?? 0} XP
          </div>
          <Link to="/profile" className="ml-1 size-10 rounded-full bg-gradient-to-br from-primary to-secondary grid place-items-center text-xl shadow-soft hover-wiggle">
            {profile?.avatar_emoji ?? "🦊"}
          </Link>
          <Button variant="ghost" size="icon" onClick={async () => { await signOut(); nav({ to: "/" }); }} title="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex gap-1 overflow-x-auto px-3 pb-2">
        {NAV.map(item => {
          const active = loc.pathname.startsWith(item.to);
          return (
            <Link key={item.to} to={item.to}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${
                active ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}>
              <span className="mr-1">{item.emoji}</span>{item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
