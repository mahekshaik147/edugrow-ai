import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useAuth } from "@/lib/auth";
import { useProfile, awardXP } from "@/lib/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { pickQuestions, nextDifficulty, type Category, type Difficulty, type Question } from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Puzzle, Lightbulb, Layers, Timer, Sparkles, Check, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/assessment")({
  head: () => ({ meta: [{ title: "Brain Games — SmartMind AI" }] }),
  component: Assessment,
});

const CATEGORIES: { key: Category; label: string; icon: React.ReactNode; gradient: string; emoji: string }[] = [
  { key: "Memory", label: "Memory", icon: <Brain />, gradient: "gradient-hero", emoji: "🧠" },
  { key: "Logic", label: "Logic", icon: <Lightbulb />, gradient: "gradient-mint", emoji: "💡" },
  { key: "Pattern", label: "Patterns", icon: <Layers />, gradient: "gradient-sunset", emoji: "🔁" },
  { key: "Problem", label: "Problem Solving", icon: <Puzzle />, gradient: "gradient-coin", emoji: "🧩" },
];

type Phase = "pick" | "play" | "result";

function Assessment() {
  const { user } = useAuth();
  const { profile, refresh } = useProfile();
  const grade = profile?.grade ?? 5;

  const [phase, setPhase] = useState<Phase>("pick");
  const [category, setCategory] = useState<Category>("Logic");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  function start(cat: Category) {
    const qs = pickQuestions(grade, difficulty, 6).filter(q => q.category === cat).length >= 4
      ? pickQuestions(grade, difficulty, 8).filter(q => q.category === cat).slice(0, 6)
      : pickQuestions(grade, difficulty, 12).filter(q => q.category === cat).slice(0, 6);
    // fallback: any category if not enough
    const finalQs = qs.length >= 4 ? qs : pickQuestions(grade, difficulty, 6);
    setCategory(cat);
    setQuestions(finalQs);
    setIdx(0); setAnswers([]); setSelected(null); setShowFeedback(false);
    setStartedAt(Date.now()); setTimeLeft(30);
    setPhase("play");
  }

  // timer per question
  useEffect(() => {
    if (phase !== "play" || showFeedback) return;
    setTimeLeft(30);
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [phase, idx, showFeedback]);
  useEffect(() => {
    if (phase === "play" && timeLeft <= 0 && !showFeedback) {
      pick(-1);
    }
  }, [timeLeft, phase, showFeedback]);

  function pick(i: number) {
    if (showFeedback) return;
    setSelected(i);
    setShowFeedback(true);
    const correct = i === questions[idx].answer;
    if (correct) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ["#a78bfa","#34d399","#fbbf24"] });
    }
    setAnswers(a => [...a, i]);
  }

  async function next() {
    if (idx + 1 < questions.length) {
      setIdx(idx + 1); setSelected(null); setShowFeedback(false);
    } else {
      // Finish
      const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.answer || (i === idx && selected === q.answer) ? 1 : 0), 0);
      const time = Math.round((Date.now() - startedAt) / 1000);
      const pct = (score / questions.length) * 100;
      const xp = score * 10 + (pct === 100 ? 50 : 0);
      const coins = score * 2;
      if (user) {
        await supabase.from("assessment_results").insert({
          user_id: user.id, category, difficulty,
          score, total_questions: questions.length,
          time_spent_sec: time, xp_earned: xp,
        });
        await awardXP(user.id, xp, coins);
        if (pct === 100) {
          await supabase.from("achievements").upsert({
            user_id: user.id, badge_key: `perfect_${category.toLowerCase()}`,
            title: `${category} Champion`, description: `Perfect score on ${category}!`,
          }, { onConflict: "user_id,badge_key" });
        }
        refresh();
      }
      setDifficulty(nextDifficulty(pct));
      setPhase("result");
      if (pct >= 80) confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
    }
  }

  if (phase === "pick") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-4xl font-bold text-center">Pick a brain game 🎯</h1>
        <p className="text-center text-muted-foreground mt-2">
          Difficulty auto-tuned: <span className="font-bold capitalize text-primary">{difficulty}</span>
        </p>
        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          {CATEGORIES.map((c, i) => (
            <motion.button key={c.key}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.98 }}
              onClick={() => start(c.key)}
              className={`relative overflow-hidden rounded-3xl p-8 ${c.gradient} text-primary-foreground shadow-soft hover:shadow-pop text-left`}>
              <div className="text-6xl">{c.emoji}</div>
              <h3 className="mt-4 font-display text-2xl font-bold">{c.label}</h3>
              <p className="text-sm opacity-90 mt-1">6 questions • ~3 minutes</p>
              <div className="absolute -bottom-6 -right-4 text-9xl opacity-10">{c.emoji}</div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "result") {
    const score = answers.reduce((acc, a, i) => acc + (a === questions[i].answer ? 1 : 0), 0);
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="glass-strong rounded-3xl p-10 text-center">
          <div className="text-7xl">{pct === 100 ? "🏆" : pct >= 80 ? "🌟" : pct >= 50 ? "👏" : "💪"}</div>
          <h2 className="mt-4 font-display text-4xl font-bold">
            {pct === 100 ? "Perfect!" : pct >= 80 ? "Amazing!" : pct >= 50 ? "Nice work!" : "Keep going!"}
          </h2>
          <div className="mt-2 text-muted-foreground">You scored</div>
          <div className="mt-1 font-display text-6xl font-bold text-gradient">{pct}%</div>
          <div className="mt-2 text-sm text-muted-foreground">{score} of {questions.length} correct</div>
          <div className="mt-6 flex justify-center gap-3 text-sm">
            <span className="px-4 py-1.5 rounded-full bg-primary/15 text-primary font-bold">
              <Sparkles className="inline h-3.5 w-3.5 mr-1" />+{score * 10 + (pct === 100 ? 50 : 0)} XP
            </span>
            <span className="px-4 py-1.5 rounded-full bg-fun/40 text-fun-foreground font-bold">
              +{score * 2} coins
            </span>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            Next time we'll tune difficulty to <b className="text-primary capitalize">{difficulty}</b>
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => setPhase("pick")} className="rounded-full font-bold h-12 px-6">
              Play another 🎮
            </Button>
            <Link to="/dashboard"><Button variant="outline" className="rounded-full font-bold h-12 px-6 w-full">Back to home</Button></Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // PLAY
  const q = questions[idx];
  const correct = q.answer;
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-sm font-bold">{idx + 1} / {questions.length}</div>
        <Progress value={((idx + (showFeedback ? 1 : 0)) / questions.length) * 100} className="h-2 flex-1" />
        <div className={`flex items-center gap-1.5 font-bold text-sm px-3 py-1 rounded-full ${
          timeLeft <= 5 ? "bg-destructive/20 text-destructive" : "bg-muted"
        }`}>
          <Timer className="h-3.5 w-3.5" /> {Math.max(0, timeLeft)}s
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className="glass-strong rounded-3xl p-7 md:p-10">
          <div className="text-xs uppercase font-bold text-muted-foreground tracking-wider">{q.category} · {q.difficulty}</div>
          {q.emoji && <div className="text-5xl mt-3 text-center">{q.emoji}</div>}
          <h2 className="font-display text-2xl md:text-3xl font-bold mt-4 leading-tight">{q.prompt}</h2>

          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              const isCorrect = i === correct;
              const isSelected = i === selected;
              const showState = showFeedback;
              return (
                <motion.button key={i}
                  whileHover={{ scale: showState ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
                  disabled={showState}
                  onClick={() => pick(i)}
                  className={`p-4 rounded-2xl text-left font-bold border-2 transition-all ${
                    showState
                      ? isCorrect
                        ? "bg-success/20 border-success text-success-foreground"
                        : isSelected
                        ? "bg-destructive/15 border-destructive"
                        : "bg-muted border-transparent opacity-60"
                      : "bg-card border-border hover:border-primary hover:bg-primary/5"
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className={`size-8 rounded-full grid place-items-center text-sm font-bold ${
                      showState && isCorrect ? "bg-success text-success-foreground"
                      : showState && isSelected ? "bg-destructive text-destructive-foreground"
                      : "bg-muted"
                    }`}>
                      {showState && isCorrect ? <Check className="h-4 w-4" />
                      : showState && isSelected ? <X className="h-4 w-4" />
                      : String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {showFeedback && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-2xl bg-primary/10 text-sm">
              <b className="text-primary">{selected === correct ? "Correct! 🎉" : selected === -1 ? "Time's up ⏰" : "Not quite"}</b>
              <p className="mt-1">{q.explanation}</p>
            </motion.div>
          )}

          {showFeedback && (
            <div className="mt-6 flex justify-end">
              <Button onClick={next} className="rounded-full font-bold h-12 px-7">
                {idx + 1 < questions.length ? "Next →" : "See results 🎉"}
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
