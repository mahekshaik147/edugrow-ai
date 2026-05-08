import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/_app/rewards")({
  head: () => ({ meta: [{ title: "Rewards — SmartMind AI" }] }),
  component: Rewards,
});

const ALL_BADGES = [
  { key: "first_game", title: "First Steps", desc: "Played your first game", emoji: "👶" },
  { key: "perfect_logic", title: "Logic Champion", desc: "Perfect score on Logic", emoji: "💡" },
  { key: "perfect_memory", title: "Memory Master", desc: "Perfect score on Memory", emoji: "🧠" },
  { key: "perfect_pattern", title: "Pattern Pro", desc: "Perfect score on Patterns", emoji: "🔁" },
  { key: "perfect_problem", title: "Problem Solver", desc: "Perfect score on Problem Solving", emoji: "🧩" },
  { key: "streak_3", title: "On Fire", desc: "3 day streak", emoji: "🔥" },
  { key: "streak_7", title: "Week Warrior", desc: "7 day streak", emoji: "⚡" },
  { key: "level_5", title: "Rising Star", desc: "Reach Level 5", emoji: "🌟" },
  { key: "xp_1000", title: "XP Legend", desc: "Earn 1000 XP", emoji: "🏆" },
];

const AVATARS = [
  { emoji: "🦊", req: 0, label: "Default" },
  { emoji: "🐼", req: 100, label: "100 XP" },
  { emoji: "🦁", req: 300, label: "300 XP" },
  { emoji: "🐧", req: 500, label: "500 XP" },
  { emoji: "🦄", req: 1000, label: "1000 XP" },
  { emoji: "🐲", req: 2000, label: "2000 XP" },
];

function Rewards() {
  const { user } = useAuth();
  const { profile, refresh } = useProfile();

  const { data: earned = [] } = useQuery({
    queryKey: ["achievements", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("achievements").select("*").eq("user_id", user!.id);
      return data ?? [];
    },
  });

  const earnedKeys = new Set(earned.map(a => a.badge_key));
  const xp = profile?.xp ?? 0;

  async function setAvatar(emoji: string) {
    if (!user) return;
    await supabase.from("profiles").update({ avatar_emoji: emoji }).eq("id", user.id);
    refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div>
        <h1 className="font-display text-4xl font-bold">Rewards 🏆</h1>
        <p className="text-muted-foreground">Earn badges, unlock avatars, climb the ranks!</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat emoji="✨" label="Total XP" value={xp} grad="gradient-hero" />
        <Stat emoji="🪙" label="Coins" value={profile?.coins ?? 0} grad="gradient-coin" />
        <Stat emoji="🔥" label="Streak" value={`${profile?.streak ?? 0} days`} grad="gradient-sunset" />
      </div>

      <section className="glass rounded-3xl p-6">
        <h2 className="font-display text-2xl font-bold mb-4">Badges <span className="text-sm font-normal text-muted-foreground">({earned.length}/{ALL_BADGES.length})</span></h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          {ALL_BADGES.map((b, i) => {
            const got = earnedKeys.has(b.key);
            return (
              <motion.div key={b.key}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                className={`relative aspect-square rounded-2xl p-3 flex flex-col items-center justify-center text-center ${
                  got ? "gradient-coin text-fun-foreground shadow-pop" : "bg-muted text-muted-foreground"
                }`}>
                <div className={`text-4xl ${got ? "" : "grayscale opacity-40"}`}>{b.emoji}</div>
                <div className="mt-1 text-xs font-bold leading-tight">{b.title}</div>
                {!got && <Lock className="absolute top-2 right-2 h-3 w-3 opacity-50" />}
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="font-display text-2xl font-bold mb-4">Unlockable Avatars</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {AVATARS.map(a => {
            const unlocked = xp >= a.req;
            const active = profile?.avatar_emoji === a.emoji;
            return (
              <button key={a.emoji} disabled={!unlocked} onClick={() => setAvatar(a.emoji)}
                className={`p-4 rounded-2xl flex flex-col items-center transition-all ${
                  active ? "ring-4 ring-primary bg-primary/10" : unlocked ? "bg-muted hover:bg-primary/10" : "bg-muted opacity-40"
                }`}>
                <div className="text-4xl">{a.emoji}</div>
                <div className="mt-1 text-xs font-bold">{unlocked ? (active ? "Selected" : "Tap to use") : a.label}</div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ emoji, label, value, grad }: { emoji: string; label: string; value: number | string; grad: string }) {
  return (
    <div className={`rounded-3xl p-5 ${grad} text-primary-foreground shadow-soft flex items-center gap-4`}>
      <div className="text-4xl">{emoji}</div>
      <div>
        <div className="text-xs uppercase font-bold opacity-80">{label}</div>
        <div className="font-display text-3xl font-bold">{value}</div>
      </div>
    </div>
  );
}
