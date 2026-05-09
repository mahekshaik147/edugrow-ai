import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useAuth } from "@/lib/auth";
import { useProfile, awardXP } from "@/lib/useProfile";
import { supabase } from "@/integrations/supabase/client";
import {
  pickQuestions, suggestLevelForGrade, nextLevel,
  type Category, type Level, type Question,
} from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Puzzle, Lightbulb, Layers, Sparkles, Check, X, Eye, EyeOff, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_app/assessment")({
  head: () => ({ meta: [{ title: "IQ Zone — SmartMind AI" }] }),
  component: Assessment,
});

const CATEGORIES: { key: Category; label: string; tag: string; icon: React.ReactNode; gradient: string; emoji: string; modes: string[] }[] = [
  { key: "Memory",  label: "Memory IQ",  tag: "Brain memory training",   icon: <Brain />,    gradient: "gradient-hero",   emoji: "🧠", modes: ["Sequence recall", "Hidden objects", "Card matching"] },
  { key: "Logic",   label: "Logic IQ",   tag: "IQ reasoning",            icon: <Lightbulb />,gradient: "gradient-mint",   emoji: "💡", modes: ["Odd-one-out", "Deductive reasoning", "Logical ordering"] },
  { key: "Pattern", label: "Pattern IQ", tag: "Visual IQ puzzles",       icon: <Layers />,   gradient: "gradient-sunset", emoji: "🔁", modes: ["Find next", "Missing piece", "3×3 grids"] },
  { key: "Problem", label: "Problem IQ", tag: "Real-life thinking",      icon: <Puzzle />,   gradient: "gradient-coin",   emoji: "🧩", modes: ["Story puzzles", "Math reasoning", "Decisions"] },
];

const LEVELS: { key: Level; title: string; sub: string; emoji: string; grades: string; gradient: string }[] = [
  { key: "easy",   title: "Easy",   sub: "Beginner-friendly warm-up",  emoji: "🌱", grades: "Grades 1–4",  gradient: "gradient-mint" },
  { key: "medium", title: "Medium", sub: "Sharper thinking",            emoji: "⚡", grades: "Grades 5–7",  gradient: "gradient-sunset" },
  { key: "hard",   title: "Hard",   sub: "Real IQ challenge mode",      emoji: "🔥", grades: "Grades 8–10", gradient: "gradient-hero" },
];

type Phase = "category" | "level" | "memorize" | "play" | "result";

function Assessment() {
  const { user } = useAuth();
  const { profile, refresh } = useProfile();
  const grade = profile?.grade ?? 5;

  const [phase, setPhase] = useState<Phase>("category");
  const [category, setCategory] = useState<Category>("Logic");
  const [level, setLevel] = useState<Level>(suggestLevelForGrade(grade));
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [memoryTimeLeft, setMemoryTimeLeft] = useState(0);

  const isTimedCategory = category === "Memory" || category === "Pattern";

  function pickCategory(cat: Category) {
    setCategory(cat);
    setPhase("level");
  }

  function startLevel(lvl: Level) {
    const qs = pickQuestions(category, lvl, 5);
    if (qs.length === 0) return;
    setLevel(lvl);
    setQuestions(qs);
    setIdx(0); setAnswers([]); setSelected(null); setShowFeedback(false);
    setStartedAt(Date.now());
    if (qs[0].type.startsWith("memory")) {
      setMemoryTimeLeft((qs[0] as any).memorizeSec);
      setPhase("memorize");
    } else {
      const t = (qs[0] as any).timeSec ?? (lvl === "hard" ? 30 : lvl === "medium" ? 25 : 20);
      setTimeLeft(t);
      setPhase("play");
    }
  }

  // Memorization countdown
  useEffect(() => {
    if (phase !== "memorize") return;
    if (memoryTimeLeft <= 0) {
      const q = questions[idx] as any;
      const t = q.timeSec ?? 25;
      setTimeLeft(t);
      setPhase("play");
      return;
    }
    const id = setTimeout(() => setMemoryTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, memoryTimeLeft, idx, questions]);

  // Play timer (only if isTimedCategory)
  useEffect(() => {
    if (phase !== "play" || !isTimedCategory || showFeedback) return;
    if (timeLeft <= 0) { pick(-1); return; }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft, showFeedback, isTimedCategory]);

  function pick(i: number) {
    if (showFeedback) return;
    setSelected(i);
    setShowFeedback(true);
    const correct = i === (questions[idx] as any).answer;
    if (correct) confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ["#a78bfa","#34d399","#fbbf24"] });
    setAnswers(a => [...a, i]);
  }

  async function next() {
    if (idx + 1 < questions.length) {
      const nextIdx = idx + 1;
      const nq = questions[nextIdx] as any;
      setIdx(nextIdx); setSelected(null); setShowFeedback(false);
      if (nq.type.startsWith("memory")) {
        setMemoryTimeLeft(nq.memorizeSec);
        setPhase("memorize");
      } else {
        setTimeLeft(nq.timeSec ?? (level === "hard" ? 30 : level === "medium" ? 25 : 20));
      }
    } else {
      const score = answers.reduce((a, ans, i) => a + (ans === (questions[i] as any).answer ? 1 : 0), 0);
      const time = Math.round((Date.now() - startedAt) / 1000);
      const pct = (score / questions.length) * 100;
      const xp = score * 12 + (pct === 100 ? 60 : 0);
      const coins = score * 2;
      if (user) {
        await supabase.from("assessment_results").insert({
          user_id: user.id, category, difficulty: level,
          score, total_questions: questions.length,
          time_spent_sec: time, xp_earned: xp,
        });
        await awardXP(user.id, xp, coins);
        if (pct === 100) {
          await supabase.from("achievements").upsert({
            user_id: user.id, badge_key: `perfect_${category.toLowerCase()}`,
            title: `${category} IQ Champion`, description: `Perfect score on ${category} IQ!`,
          }, { onConflict: "user_id,badge_key" });
        }
        refresh();
      }
      setLevel(nextLevel(pct, level));
      setPhase("result");
      if (pct >= 80) confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
    }
  }

  // ---------- CATEGORY PICKER ----------
  if (phase === "category") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-4xl font-bold text-center">IQ Zone 🧠</h1>
        <p className="text-center text-muted-foreground mt-2">Each category is a totally different brain-training mode</p>
        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          {CATEGORIES.map((c, i) => (
            <motion.button key={c.key}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.98 }}
              onClick={() => pickCategory(c.key)}
              className={`relative overflow-hidden rounded-3xl p-8 ${c.gradient} text-primary-foreground shadow-soft hover:shadow-pop text-left`}>
              <div className="text-6xl">{c.emoji}</div>
              <h3 className="mt-4 font-display text-2xl font-bold">{c.label}</h3>
              <p className="text-sm opacity-90 mt-1">{c.tag}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {c.modes.map(m => (
                  <li key={m} className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">{m}</li>
                ))}
              </ul>
              <div className="absolute -bottom-6 -right-4 text-9xl opacity-10">{c.emoji}</div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ---------- LEVEL PICKER ----------
  if (phase === "level") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <button onClick={() => setPhase("category")} className="text-sm font-bold text-muted-foreground hover:text-primary">← Back</button>
        <h1 className="font-display text-4xl font-bold text-center mt-2">Choose your IQ level</h1>
        <p className="text-center text-muted-foreground mt-2">
          <b className="text-primary">{category} IQ</b> · suggested for you:{" "}
          <span className="capitalize font-bold">{suggestLevelForGrade(grade)}</span>
        </p>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {LEVELS.map((l, i) => (
            <motion.button key={l.key}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.04, y: -6 }} whileTap={{ scale: 0.98 }}
              onClick={() => startLevel(l.key)}
              className={`relative overflow-hidden rounded-3xl p-7 ${l.gradient} text-primary-foreground text-left shadow-soft hover:shadow-pop`}>
              <div className="text-5xl">{l.emoji}</div>
              <h3 className="mt-3 font-display text-3xl font-bold">{l.title}</h3>
              <p className="text-sm opacity-90 mt-1">{l.sub}</p>
              <div className="mt-4 text-xs uppercase font-bold opacity-90">{l.grades}</div>
              <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">5 questions</div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ---------- MEMORIZE PHASE ----------
  if (phase === "memorize") {
    const q = questions[idx] as any;
    const totalSec = q.memorizeSec;
    const pctRem = (memoryTimeLeft / totalSec) * 100;
    // Memory pairs only needs the timer screen (cards revealed during memorize? we just show prompt then go)
    const items: string[] = q.type === "memory-pairs" ? q.pairs : q.memorize;
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="text-center text-sm font-bold text-muted-foreground uppercase tracking-wider">
          {category} IQ · Question {idx + 1} of {questions.length}
        </div>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="mt-6 glass-strong rounded-3xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <CircularTimer value={pctRem} label={String(memoryTimeLeft)} accent="primary" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-bold">
            <Eye className="h-4 w-4" /> {q.type === "memory-pairs" ? "Get ready to match!" : "Memorize these!"}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {items.map((item: string, i: number) => (
              <motion.div key={i}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.12, type: "spring" }}
                className="size-24 md:size-28 rounded-3xl glass grid place-items-center text-5xl md:text-6xl shadow-pop">
                {item}
              </motion.div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">Get ready — the challenge starts when the timer ends.</p>
        </motion.div>
      </div>
    );
  }

  // ---------- RESULT ----------
  if (phase === "result") {
    const score = answers.reduce((a, ans, i) => a + (ans === (questions[i] as any).answer ? 1 : 0), 0);
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="glass-strong rounded-3xl p-10 text-center">
          <div className="text-7xl">{pct === 100 ? "🏆" : pct >= 80 ? "🌟" : pct >= 50 ? "👏" : "💪"}</div>
          <h2 className="mt-4 font-display text-4xl font-bold">
            {pct === 100 ? "Perfect IQ!" : pct >= 80 ? "Brilliant!" : pct >= 50 ? "Nice work!" : "Keep training!"}
          </h2>
          <div className="mt-2 text-muted-foreground">Your IQ score</div>
          <div className="mt-1 font-display text-6xl font-bold text-gradient">{pct}%</div>
          <div className="mt-2 text-sm text-muted-foreground">{score} of {questions.length} correct · {category} · <span className="capitalize">{level}</span></div>
          <div className="mt-6 flex justify-center gap-3 text-sm">
            <span className="px-4 py-1.5 rounded-full bg-primary/15 text-primary font-bold">
              <Sparkles className="inline h-3.5 w-3.5 mr-1" />+{score * 12 + (pct === 100 ? 60 : 0)} XP
            </span>
            <span className="px-4 py-1.5 rounded-full bg-fun/40 text-fun-foreground font-bold">+{score * 2} coins</span>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => setPhase("category")} className="rounded-full font-bold h-12 px-6">Pick another IQ test 🎯</Button>
            <Link to="/dashboard"><Button variant="outline" className="rounded-full font-bold h-12 px-6 w-full">Back to home</Button></Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------- PLAY ----------
  const q = questions[idx] as any;
  const correct = q.answer;
  const totalTime = q.timeSec ?? (level === "hard" ? 30 : level === "medium" ? 25 : 20);
  const timePct = isTimedCategory ? (timeLeft / totalTime) * 100 : 0;
  const warning = isTimedCategory && timeLeft <= 5;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-sm font-bold">{idx + 1} / {questions.length}</div>
        <Progress value={((idx + (showFeedback ? 1 : 0)) / questions.length) * 100} className="h-2 flex-1" />
        {isTimedCategory ? (
          <CircularTimer value={timePct} label={String(Math.max(0, timeLeft))} compact accent={warning ? "destructive" : "primary"} />
        ) : (
          <div className="text-xs uppercase font-bold text-muted-foreground tracking-wider px-3 py-1 rounded-full bg-muted">No timer</div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className="glass-strong rounded-3xl p-7 md:p-10">
          <div className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
            {category} IQ · {level}
          </div>

          {/* MEMORY non-pair: hidden badge */}
          {(q.type === "memory-sequence" || q.type === "memory-objects" || q.type === "memory-position") && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-bold">
              <EyeOff className="h-3.5 w-3.5" /> Items hidden — recall now
            </div>
          )}

          {/* MEMORY PAIRS: interactive flip-and-match */}
          {q.type === "memory-pairs" && !showFeedback && (
            <MemoryPairsBoard q={q} onComplete={(success) => pick(success ? 0 : 1)} />
          )}

          {/* PATTERN sequence */}
          {(q.type === "pattern-next" || q.type === "pattern-missing") && (
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {q.sequence.map((s: string, i: number) => (
                <motion.div key={i}
                  initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.08, type: "spring" }}
                  className={`size-16 md:size-20 rounded-2xl grid place-items-center text-3xl md:text-4xl font-bold ${
                    s === "?" ? "bg-primary/15 border-2 border-dashed border-primary text-primary" : "glass shadow-soft"
                  }`}>
                  {s}
                </motion.div>
              ))}
            </div>
          )}

          {/* PATTERN GRID 3x3 */}
          {q.type === "pattern-grid" && (
            <div className="mt-5 grid grid-cols-3 gap-2 md:gap-3 max-w-xs mx-auto">
              {q.grid.map((s: string, i: number) => (
                <motion.div key={i}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.04, type: "spring" }}
                  className={`aspect-square rounded-2xl grid place-items-center text-2xl md:text-3xl font-bold ${
                    s === "?" ? "bg-primary/15 border-2 border-dashed border-primary text-primary" : "glass shadow-soft"
                  }`}>
                  {s}
                </motion.div>
              ))}
            </div>
          )}

          {/* PROBLEM scenario story card */}
          {q.type === "problem-scenario" && (
            <div className="mt-5 rounded-2xl bg-gradient-to-br from-primary/10 via-fun/10 to-secondary/10 border border-primary/20 p-5 md:p-6 flex gap-4 items-start">
              <div className="text-5xl md:text-6xl shrink-0">{q.emoji}</div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  <BookOpen className="h-3.5 w-3.5" /> Scenario
                </div>
                <p className="text-sm md:text-base leading-relaxed">{q.scenario}</p>
              </div>
            </div>
          )}

          {/* LOGIC ORDER interactive */}
          {q.type === "logic-order" && !showFeedback && (
            <LogicOrderBoard q={q} onComplete={(success) => pick(success ? 0 : 1)} />
          )}

          {/* Prompt + options for MCQ-like types */}
          {(q.type === "mcq" || q.type === "memory-sequence" || q.type === "memory-objects" || q.type === "memory-position" ||
            q.type === "pattern-next" || q.type === "pattern-missing" || q.type === "pattern-grid" || q.type === "problem-scenario") && (
            <>
              <h2 className="font-display text-2xl md:text-3xl font-bold mt-6 leading-tight">{q.prompt}</h2>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {q.options.map((opt: string, i: number) => {
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
                          ? isCorrect ? "bg-success/20 border-success text-success-foreground"
                          : isSelected ? "bg-destructive/15 border-destructive"
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
            </>
          )}

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
                {idx + 1 < questions.length ? "Next →" : "See IQ score 🎉"}
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ---------- MEMORY PAIRS BOARD ----------
function MemoryPairsBoard({ q, onComplete }: { q: any; onComplete: (success: boolean) => void }) {
  // build deck: each pair appears twice, shuffled (memoized per question)
  const deck = useMemo(() => {
    const raw = [...q.pairs, ...q.pairs].map((emoji: string, i: number) => ({ id: i, emoji }));
    return raw.sort(() => Math.random() - 0.5);
  }, [q.id]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [mismatches, setMismatches] = useState(0);
  const [busy, setBusy] = useState(false);

  function flip(id: number) {
    if (busy || flipped.includes(id) || matched.includes(id)) return;
    const next = [...flipped, id];
    setFlipped(next);
    if (next.length === 2) {
      const [a, b] = next;
      const ea = deck.find(d => d.id === a)!.emoji;
      const eb = deck.find(d => d.id === b)!.emoji;
      if (ea === eb) {
        setMatched(m => [...m, a, b]);
        setFlipped([]);
        if (matched.length + 2 === deck.length) {
          // success!
          setTimeout(() => onComplete(mismatches <= q.maxMismatches), 600);
        }
      } else {
        setBusy(true);
        setTimeout(() => {
          setFlipped([]);
          setMismatches(m => {
            const nm = m + 1;
            // fail: too many mismatches AND not done
            if (nm > q.maxMismatches && matched.length + 2 < deck.length) {
              setTimeout(() => onComplete(false), 300);
            }
            return nm;
          });
          setBusy(false);
        }, 750);
      }
    }
  }

  return (
    <div className="mt-5">
      <h2 className="font-display text-xl md:text-2xl font-bold leading-tight">{q.prompt}</h2>
      <div className="mt-2 text-xs text-muted-foreground">
        Mismatches: <b className={mismatches > q.maxMismatches ? "text-destructive" : "text-foreground"}>{mismatches}</b> / {q.maxMismatches} · Matched {matched.length / 2} of {deck.length / 2}
      </div>
      <div className={`mt-4 grid gap-2 md:gap-3 mx-auto`} style={{ gridTemplateColumns: `repeat(${Math.min(deck.length, 4)}, minmax(0,1fr))`, maxWidth: 360 }}>
        {deck.map(card => {
          const isOpen = flipped.includes(card.id) || matched.includes(card.id);
          return (
            <motion.button key={card.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => flip(card.id)}
              className={`aspect-square rounded-2xl text-3xl md:text-4xl grid place-items-center font-bold transition-all ${
                isOpen ? "bg-card shadow-pop" : "gradient-hero text-primary-foreground shadow-soft hover:scale-105"
              } ${matched.includes(card.id) ? "ring-2 ring-success" : ""}`}>
              <motion.span animate={{ rotateY: isOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
                {isOpen ? card.emoji : "?"}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- LOGIC ORDER BOARD ----------
function LogicOrderBoard({ q, onComplete }: { q: any; onComplete: (success: boolean) => void }) {
  const shuffled = useMemo(() => [...q.items].sort(() => Math.random() - 0.5), [q.id]);
  const [chosen, setChosen] = useState<string[]>([]);

  function pickItem(item: string) {
    if (chosen.includes(item)) return;
    const next = [...chosen, item];
    setChosen(next);
    if (next.length === q.correctOrder.length) {
      const ok = next.every((v, i) => v === q.correctOrder[i]);
      setTimeout(() => onComplete(ok), 500);
    }
  }
  function reset() { setChosen([]); }

  return (
    <div className="mt-5">
      <h2 className="font-display text-xl md:text-2xl font-bold leading-tight">{q.prompt}</h2>

      <div className="mt-4 p-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 min-h-[64px]">
        <div className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground mb-2">Your order</div>
        <div className="flex flex-wrap gap-2">
          {chosen.length === 0 && <span className="text-sm text-muted-foreground">Tap items below in the right order…</span>}
          {chosen.map((c, i) => (
            <motion.div key={c} initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="px-3 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-soft">
              {i + 1}. {c}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {shuffled.map(item => {
          const used = chosen.includes(item);
          return (
            <motion.button key={item}
              whileHover={{ scale: used ? 1 : 1.05 }} whileTap={{ scale: 0.95 }}
              disabled={used}
              onClick={() => pickItem(item)}
              className={`px-4 py-2.5 rounded-xl font-bold border-2 transition-all ${
                used ? "bg-muted border-transparent opacity-40 line-through"
                     : "bg-card border-border hover:border-primary hover:bg-primary/5"
              }`}>
              {item}
            </motion.button>
          );
        })}
      </div>
      {chosen.length > 0 && (
        <button onClick={reset} className="mt-3 text-xs font-bold text-muted-foreground hover:text-primary">↺ Reset order</button>
      )}
    </div>
  );
}

// ---------- Circular Timer ----------
function CircularTimer({ value, label, compact, accent = "primary" }: { value: number; label: string; compact?: boolean; accent?: "primary" | "destructive" }) {
  const size = compact ? 44 : 110;
  const stroke = compact ? 4 : 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, value)) / 100) * c;
  const color = accent === "destructive" ? "hsl(var(--destructive))" : "hsl(var(--primary))";
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className={accent === "destructive" ? "animate-pulse" : ""}>
        <circle cx={size/2} cy={size/2} r={r} stroke="currentColor" className="text-muted" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: "stroke-dashoffset 0.9s linear" }} />
      </svg>
      <span className={`absolute font-display font-bold ${compact ? "text-xs" : "text-3xl"}`}>{label}{compact ? "" : "s"}</span>
    </div>
  );
}
