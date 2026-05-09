import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, MessageSquare, Trophy, Flame, Sparkles, Target, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SmartMind AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { profile } = useProfile();

  const { data: recent } = useQuery({
    queryKey: ["recent-results", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("assessment_results")
        .select("*").eq("user_id", user!.id)
        .order("created_at", { ascending: false }).limit(5);
      return data ?? [];
    },
  });

  const xpToNext = ((profile?.level ?? 1)) * 200;
  const xpInLevel = (profile?.xp ?? 0) % 200;
  const pct = (xpInLevel / 200) * 100;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
        <div className="size-20 rounded-3xl gradient-hero grid place-items-center text-4xl shadow-glow">
          {profile?.avatar_emoji ?? "🦊"}
        </div>
        <div className="flex-1">
          <p className="text-muted-foreground font-semibold">Welcome back,</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            {profile?.display_name ?? "Explorer"} <span className="text-2xl">👋</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Grade {profile?.grade ?? "-"} • Level {profile?.level ?? 1}
          </p>
        </div>
        <div className="flex gap-3">
          <Stat icon={<Flame className="text-orange-500" />} label="Streak" value={`${profile?.streak ?? 0}d`} />
          <Stat icon={<Sparkles className="text-primary" />} label="XP" value={`${profile?.xp ?? 0}`} />
        </div>
      </motion.div>

      {/* Level progress */}
      <div className="mt-5 glass rounded-3xl p-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="font-bold">Level {profile?.level ?? 1}</div>
            <div className="text-sm text-muted-foreground">
              {200 - xpInLevel} XP to level {(profile?.level ?? 1) + 1}
            </div>
          </div>
          <Trophy className="h-8 w-8 text-amber-500" />
        </div>
        <Progress value={pct} className="h-3" />
        <div className="text-xs text-muted-foreground mt-1">{xpInLevel} / 200 XP</div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <ActionCard to="/assessment" gradient="gradient-hero" icon={<Brain className="h-7 w-7" />}
          title="IQ Zone" desc="Memory, logic, patterns & problem-solving IQ tests" cta="Start IQ test" />
        <ActionCard to="/chat" gradient="gradient-mint" icon={<MessageSquare className="h-7 w-7" />}
          title="AI Tutor" desc="Chat, learn, get instant feedback" cta="Start chat" />
        <ActionCard to="/rewards" gradient="gradient-sunset" icon={<Trophy className="h-7 w-7" />}
          title="Rewards" desc="Badges, coins and unlockables" cta="See rewards" />
      </div>

      {/* Daily challenge */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <motion.div whileHover={{ y: -3 }} className="glass rounded-3xl p-6 flex items-center gap-5">
          <div className="size-16 rounded-2xl gradient-coin grid place-items-center text-3xl shadow-soft">🌟</div>
          <div className="flex-1">
            <div className="font-display text-lg font-bold">Today's challenge</div>
            <div className="text-sm text-muted-foreground">Score 80%+ on a Logic quiz to win 50 coins</div>
          </div>
          <Link to="/assessment"><Button size="sm" className="rounded-full font-bold">Go!</Button></Link>
        </motion.div>
        <motion.div whileHover={{ y: -3 }} className="glass rounded-3xl p-6 flex items-center gap-5">
          <div className="size-16 rounded-2xl gradient-mint grid place-items-center text-3xl shadow-soft">💬</div>
          <div className="flex-1">
            <div className="font-display text-lg font-bold">Speak with AI Tutor</div>
            <div className="text-sm text-muted-foreground">2 minutes a day to grow vocab</div>
          </div>
          <Link to="/chat"><Button size="sm" variant="outline" className="rounded-full font-bold">Open</Button></Link>
        </motion.div>
      </div>

      {/* Recent activity */}
      <div className="mt-6 glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold">Recent activity</h2>
          <Link to="/progress" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            See all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {!recent || recent.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Target className="h-10 w-10 mx-auto mb-2 opacity-50" />
            No activity yet — try your first IQ test!
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map(r => (
              <li key={r.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold">{r.category} · <span className="capitalize">{r.difficulty}</span></div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-success/20 text-success-foreground font-bold text-sm">
                    {Math.round((r.score / r.total_questions) * 100)}%
                  </span>
                  <span className="text-sm text-muted-foreground">+{r.xp_earned} XP</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="text-center px-4 py-2 rounded-2xl bg-muted">
      <div className="flex justify-center">{icon}</div>
      <div className="font-bold text-lg leading-none mt-1">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase font-bold">{label}</div>
    </div>
  );
}

function ActionCard({ to, gradient, icon, title, desc, cta }: { to: string; gradient: string; icon: React.ReactNode; title: string; desc: string; cta: string }) {
  return (
    <Link to={to}>
      <motion.div whileHover={{ y: -4 }} className={`relative overflow-hidden rounded-3xl p-6 ${gradient} text-primary-foreground shadow-soft hover:shadow-pop transition-all h-full`}>
        <div className="size-12 rounded-2xl bg-white/20 grid place-items-center backdrop-blur-sm">{icon}</div>
        <h3 className="mt-4 font-display text-2xl font-bold">{title}</h3>
        <p className="text-sm opacity-90 mt-1">{desc}</p>
        <div className="mt-4 inline-flex items-center gap-1 font-bold text-sm">
          {cta} <ArrowRight className="h-4 w-4" />
        </div>
        <div className="absolute -bottom-6 -right-6 text-7xl opacity-15">✨</div>
      </motion.div>
    </Link>
  );
}
