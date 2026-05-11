import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/useProfile";
import { supabase } from "@/integrations/supabase/client";
import {
  statsByCategory, detectWeaknesses, detectStrengths, recommendationsFor, generateStudyPlan,
} from "@/lib/analysis";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid,
} from "recharts";
import { Lightbulb, CalendarDays, TrendingDown, Sparkles } from "lucide-react";

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
        <KPI label="IQ tests taken" value={total} emoji="🧠" />
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
                <Bar dataKey="games" fill="var(--accent)" radius={[12, 12, 0, 0]} name="IQ tests" />
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
            )) : <div className="mt-2 text-sm text-muted-foreground">Take some IQ tests to see your strengths!</div>}
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

      {/* AI WEAKNESS + RECOMMENDATIONS */}
      <WeaknessPanel results={results} />

      {/* PERSONALIZED STUDY PLAN */}
      <StudyPlanPanel results={results} />
    </div>
  );
}

function WeaknessPanel({ results }: { results: any[] }) {
  const stats = statsByCategory(results);
  const weak = detectWeaknesses(stats);
  const strong = detectStrengths(stats);

  return (
    <div className="glass-strong rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-11 rounded-2xl gradient-hero grid place-items-center text-primary-foreground"><Lightbulb className="h-5 w-5" /></div>
        <div>
          <h3 className="font-display text-xl font-bold">AI Cognitive Coach</h3>
          <p className="text-xs text-muted-foreground">Personalized weakness analysis & improvement plan</p>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="text-sm text-muted-foreground">Take a few IQ tests and your AI coach will analyze your strengths and weaknesses here.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-warning-foreground mb-2 flex items-center gap-1.5">
              <TrendingDown className="h-3.5 w-3.5" /> Weak areas
            </div>
            {weak.length === 0 ? (
              <p className="text-sm text-muted-foreground">No weak areas detected — keep it up!</p>
            ) : (
              <div className="space-y-3">
                {weak.map(w => (
                  <div key={w.category} className="rounded-2xl border border-warning/40 bg-warning/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{w.category} IQ</span>
                      <span className="text-sm font-bold">{w.accuracy}% accuracy</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{w.attempts} tests · avg {w.avgTimePerQ}s per question</div>
                    <ul className="mt-2 space-y-1.5">
                      {recommendationsFor(w.category).slice(0, 2).map((tip, i) => (
                        <li key={i} className="flex gap-2 text-sm"><span>💡</span><span>{tip}</span></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-success-foreground mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Strong areas
            </div>
            {strong.length === 0 ? (
              <p className="text-sm text-muted-foreground">Keep playing to unlock strengths!</p>
            ) : (
              <div className="space-y-3">
                {strong.map(s => (
                  <div key={s.category} className="rounded-2xl border border-success/40 bg-success/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{s.category} IQ</span>
                      <span className="text-sm font-bold">{s.accuracy}% accuracy</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{s.attempts} tests · last score {s.lastScore}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StudyPlanPanel({ results }: { results: any[] }) {
  const stats = statsByCategory(results);
  const plan = generateStudyPlan(stats);
  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-11 rounded-2xl gradient-mint grid place-items-center text-primary-foreground"><CalendarDays className="h-5 w-5" /></div>
        <div>
          <h3 className="font-display text-xl font-bold">Your weekly study plan</h3>
          <p className="text-xs text-muted-foreground">AI-generated, adapted to your latest performance</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {plan.map(day => (
          <div key={day.day} className="rounded-2xl bg-card border border-border p-3 flex flex-col">
            <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">{day.day}</div>
            <div className="text-2xl mt-1">{day.emoji}</div>
            <div className="font-bold text-sm">{day.focus} IQ</div>
            <div className="text-[11px] text-muted-foreground">{day.minutes} min focus</div>
            <ul className="mt-2 text-[11px] space-y-1 flex-1">
              {day.tasks.map((t, i) => (
                <li key={i} className="flex gap-1.5"><span className="text-primary">▸</span><span>{t}</span></li>
              ))}
            </ul>
          </div>
        ))}
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
