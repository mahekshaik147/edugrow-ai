import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/useProfile";
import { LogOut, Sparkles, Flame, Coins, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass-strong border-b border-border/50">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 h-16 flex items-center gap-2 sm:gap-4">
        {/* Mobile menu trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="p-5 border-b border-border/50 flex items-center justify-between">
              <Link to="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 font-display font-bold text-lg">
                <span className="text-2xl">🧠</span>
                <span className="text-gradient">SmartMind AI</span>
              </Link>
            </div>
            <nav className="p-3 flex flex-col gap-1">
              {NAV.map(item => {
                const active = loc.pathname.startsWith(item.to);
                return (
                  <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-2xl text-base font-bold flex items-center gap-3 ${
                      active ? "bg-primary text-primary-foreground shadow-soft" : "hover:bg-muted"
                    }`}>
                    <span className="text-xl">{item.emoji}</span> {item.label}
                  </Link>
                );
              })}
              <Link to="/profile" onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-2xl text-base font-bold flex items-center gap-3 hover:bg-muted">
                <span className="text-xl">{profile?.avatar_emoji ?? "🦊"}</span> Profile
              </Link>
              <button
                onClick={async () => { setOpen(false); await signOut(); nav({ to: "/" }); }}
                className="px-4 py-3 rounded-2xl text-base font-bold flex items-center gap-3 hover:bg-destructive/10 text-destructive">
                <LogOut className="h-5 w-5" /> Sign out
              </button>
            </nav>
            <div className="px-5 pt-2 pb-5 grid grid-cols-3 gap-2">
              <Stat label="Streak" value={profile?.streak ?? 0} icon={<Flame className="h-3.5 w-3.5 text-orange-500" />} />
              <Stat label="Coins" value={profile?.coins ?? 0} icon={<Coins className="h-3.5 w-3.5 text-amber-500" />} />
              <Stat label="XP" value={profile?.xp ?? 0} icon={<Sparkles className="h-3.5 w-3.5 text-primary" />} />
            </div>
          </SheetContent>
        </Sheet>

        <Link to="/dashboard" className="flex items-center gap-2 font-display font-bold text-lg shrink-0">
          <span className="text-2xl">🧠</span>
          <span className="text-gradient hidden sm:inline">SmartMind AI</span>
        </Link>

        {/* Desktop nav */}
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

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/20 text-warning-foreground font-bold text-sm">
            <Flame className="h-4 w-4 text-orange-500" /> {profile?.streak ?? 0}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-fun/30 text-fun-foreground font-bold text-sm">
            <Coins className="h-4 w-4 text-amber-500" /> {profile?.coins ?? 0}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-primary/15 text-primary font-bold text-xs sm:text-sm">
            <Sparkles className="h-4 w-4" /> {profile?.xp ?? 0} <span className="hidden xs:inline">XP</span>
          </div>
          <Link to="/profile" className="ml-1 size-9 sm:size-10 rounded-full bg-gradient-to-br from-primary to-secondary grid place-items-center text-lg sm:text-xl shadow-soft hover-wiggle">
            {profile?.avatar_emoji ?? "🦊"}
          </Link>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={async () => { await signOut(); nav({ to: "/" }); }} title="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-muted/60 p-2.5 text-center">
      <div className="flex items-center justify-center gap-1">{icon}<span className="font-bold text-sm">{value}</span></div>
      <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{label}</div>
    </div>
  );
}
