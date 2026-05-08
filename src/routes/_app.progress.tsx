import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/useProfile";
import { supabase } from "@/integrations/supabase/client";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_app/progress")({
  head: () => ({ meta: [{ title: "Progress — SmartMind AI" }] }),
  component: ProgressPage,
});

const CATS = ["Memory", "Logic", "Pattern", "Problem"] as const;

function ProgressPage() {
  const { user } = useAuth();
  const { profile } = useProfile();

  const { data: results = [] } = useQuery({
    queryKey: ["all-results", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("assessment_results").select("*").eq("user_id", user!.id).order("created_at");
      return data ?? [];
    },
  });

  const radar = CATS.map(cat => {
    const items = results.filter(r => r.category === cat);
    const avg = items.length ? items.reduce((s, r) => s + (r.score / r.total_questions) * 100, 0) / items.length : 0;
    return { category: cat, score: Math.round(avg) };
  });

  // last 7 days
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const trend = days.map(d => {
    const items = results.filter(r => r.created_at.slice(0, 10) === d);
    const avg = items.length ? items.reduce((s, r) => s + (r.score / r.total_questions) * 100, 0) / items.length : 0;
    return { day: d.slice(5), score: Math.round(avg), games: items.length };
  });

  const byDifficulty = ["easy", "medium", "hard"].map(diff => {
    const items = results.filter(r => r.difficulty === diff);
    return {
      difficulty: diff,
      games: items.length,
      avg: items.length ? Math.round(items.reduce((s, r) => s + (r.score / r.total_questions) * 100, 0) / items.length) : 0,
    };
  });

  const total = results.length;
  const totalXP = profile?.xp ?? 0;
  const accuracy = total ? Math.round(results.reduce((s, r) => s + (r.score / r.total_questions) * 100, 0) / total) : 0;

  const strengths = [...radar].filter(r => r.score >= 70).sort((a, b) => b.score - a.score);
  const weak = [...radar].filter(r => r.score > 0 && r.score < 60).sort((a, b) => a.score - b.score);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-5">
      <h1 className="font-display text-4xl font-bold">Your progress 📈</h1>

      <div className="grid sm:grid-cols-3 gap-4">
        <KPI label="Games played" value={total} emoji="🎮" />
        <KPI label="Average accuracy" value={`${accuracy}%`} emoji="🎯" />
        <KPI label="Total XP" value={totalXP} emoji="✨" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="glass rounded-3xl p-6">
          <h3 className="font-display text-xl font-bold mb-3">Skill profile</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <RadarChart data={radar}>
                <PolarGrid stroke="oklch(0.85 0.02 280)" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h3 className="font-display text-xl font-bold mb-3">Last 7 days</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 280)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <h3 className="font-display text-xl font-bold mb-3">By difficulty</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={byDifficulty}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 280)" />
                <XAxis dataKey="difficulty" tick={{ fontSize: 12, fontWeight: 700 }} />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Bar dataKey="avg" fill="var(--primary)" radius={[12, 12, 0, 0]} name="Avg %" />
                <Bar dataKey="games" fill="var(--accent)" radius={[12, 12, 0, 0]} name="Games" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 space-y-4">
          <div>
            <div className="text-xs uppercase font-bold text-muted-foreground">Strengths 💪</div>
            {strengths.length ? strengths.map(s => (
              <div key={s.category} className="mt-2 flex justify-between items-center px-3 py-2 rounded-xl bg-success/15">
                <span className="font-bold">{s.category}</span>
                <span className="font-bold text-success-foreground">{s.score}%</span>
              </div>
            )) : <div className="mt-2 text-sm text-muted-foreground">Play some games to see your strengths!</div>}
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-muted-foreground">Areas to grow 🌱</div>
            {weak.length ? weak.map(s => (
              <div key={s.category} className="mt-2 flex justify-between items-center px-3 py-2 rounded-xl bg-warning/15">
                <span className="font-bold">{s.category}</span>
                <span className="font-bold text-warning-foreground">{s.score}%</span>
              </div>
            )) : <div className="mt-2 text-sm text-muted-foreground">Looking good!</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, emoji }: { label: string; value: number | string; emoji: string }) {
  return (
    <div className="glass rounded-3xl p-5 flex items-center gap-4">
      <div className="size-14 rounded-2xl gradient-hero text-primary-foreground grid place-items-center text-2xl shadow-soft">{emoji}</div>
      <div>
        <div className="text-xs uppercase text-muted-foreground font-bold">{label}</div>
        <div className="font-display text-3xl font-bold">{value}</div>
      </div>
    </div>
  );
}
