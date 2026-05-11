import type { Category, Level } from "./questions";

export type Result = {
  category: string;
  difficulty: string;
  score: number;
  total_questions: number;
  time_spent_sec: number;
  created_at: string;
};

export type CategoryStat = {
  category: Category;
  attempts: number;
  accuracy: number;       // 0..100
  avgTimePerQ: number;    // seconds
  lastScore: number;      // 0..100
};

const CATS: Category[] = ["Memory", "Logic", "Pattern", "Problem"];

export function statsByCategory(results: Result[]): CategoryStat[] {
  return CATS.map(cat => {
    const items = results.filter(r => r.category === cat);
    if (items.length === 0) {
      return { category: cat, attempts: 0, accuracy: 0, avgTimePerQ: 0, lastScore: 0 };
    }
    const accuracy = items.reduce((s, r) => s + (r.score / r.total_questions) * 100, 0) / items.length;
    const totalQs = items.reduce((s, r) => s + r.total_questions, 0);
    const totalTime = items.reduce((s, r) => s + r.time_spent_sec, 0);
    const last = items[items.length - 1];
    return {
      category: cat,
      attempts: items.length,
      accuracy: Math.round(accuracy),
      avgTimePerQ: totalQs ? Math.round(totalTime / totalQs) : 0,
      lastScore: Math.round((last.score / last.total_questions) * 100),
    };
  });
}

export function detectWeaknesses(stats: CategoryStat[]): CategoryStat[] {
  return stats
    .filter(s => s.attempts > 0 && s.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function detectStrengths(stats: CategoryStat[]): CategoryStat[] {
  return stats
    .filter(s => s.attempts > 0 && s.accuracy >= 70)
    .sort((a, b) => b.accuracy - a.accuracy);
}

const TIPS: Record<Category, string[]> = {
  Memory: [
    "Practice 5-minute sequence-recall drills daily.",
    "Try card-matching games to boost short-term memory.",
    "Repeat back number chains aloud after seeing them once.",
  ],
  Logic: [
    "Solve one odd-one-out puzzle each morning.",
    "Re-read every question; underline the key clue.",
    "Practice classic syllogisms (All A are B…).",
  ],
  Pattern: [
    "Study number sequences (squares, Fibonacci, doubling).",
    "Look for the rule between two consecutive items first.",
    "Try 3×3 matrix puzzles for 5 minutes a day.",
  ],
  Problem: [
    "Slow down — restate the problem in your own words.",
    "Work step-by-step; write the equation before solving.",
    "Do 2 word-problem puzzles daily.",
  ],
};

export function recommendationsFor(cat: Category): string[] {
  return TIPS[cat];
}

export type PlanDay = {
  day: string;
  focus: Category;
  emoji: string;
  tasks: string[];
  minutes: number;
};

export function generateStudyPlan(stats: CategoryStat[]): PlanDay[] {
  const weak = detectWeaknesses(stats);
  // build priority list: weak first, then under-practiced, then rotate
  const untouched = stats.filter(s => s.attempts === 0).map(s => s.category);
  const priority: Category[] = [
    ...weak.map(s => s.category),
    ...untouched,
    ...stats.filter(s => s.attempts > 0 && s.accuracy >= 70).map(s => s.category),
  ];
  const ordered = priority.length ? priority : CATS;

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const emoji: Record<Category, string> = { Memory: "🧠", Logic: "💡", Pattern: "🔁", Problem: "🧩" };

  return DAYS.map((d, i) => {
    const focus = ordered[i % ordered.length];
    const stat = stats.find(s => s.category === focus);
    const minutes = stat && stat.accuracy < 50 ? 15 : 10;
    const level: Level = !stat || stat.accuracy < 50 ? "easy" : stat.accuracy < 75 ? "medium" : "hard";
    return {
      day: d,
      focus,
      emoji: emoji[focus],
      minutes,
      tasks: [
        `${minutes} min of ${focus} IQ (${level})`,
        `1 ${focus.toLowerCase()} puzzle in the AI Tutor`,
        TIPS[focus][i % TIPS[focus].length],
      ],
    };
  });
}

// --- per-session analysis (single test) ---
export type SessionAnalysis = {
  scorePct: number;
  correct: number;
  total: number;
  timeSec: number;
  avgPerQ: number;
  speedRating: "Fast" | "Steady" | "Slow";
  iqBand: string;
  strengths: string[];
  weakAreas: string[];
  tips: string[];
};

export function analyzeSession(opts: {
  category: Category;
  level: Level;
  correct: number;
  total: number;
  timeSec: number;
  questionTypes: string[]; // ordered, same length as total
  perQuestionCorrect: boolean[];
}): SessionAnalysis {
  const { category, level, correct, total, timeSec, questionTypes, perQuestionCorrect } = opts;
  const scorePct = Math.round((correct / total) * 100);
  const avg = total ? timeSec / total : 0;
  const fastThreshold = level === "hard" ? 20 : level === "medium" ? 15 : 10;
  const slowThreshold = level === "hard" ? 35 : level === "medium" ? 28 : 22;
  const speedRating: SessionAnalysis["speedRating"] =
    avg < fastThreshold ? "Fast" : avg > slowThreshold ? "Slow" : "Steady";

  // Group correctness by question type
  const byType: Record<string, { c: number; t: number }> = {};
  questionTypes.forEach((tp, i) => {
    byType[tp] = byType[tp] ?? { c: 0, t: 0 };
    byType[tp].t += 1;
    if (perQuestionCorrect[i]) byType[tp].c += 1;
  });
  const sub = Object.entries(byType).map(([k, v]) => ({
    k, pct: Math.round((v.c / v.t) * 100), t: v.t,
  }));
  const strengths = sub.filter(s => s.pct >= 75).map(s => prettyType(s.k));
  const weakAreas = sub.filter(s => s.pct < 60).map(s => prettyType(s.k));

  const tips = [...recommendationsFor(category)].slice(0, 3);

  // Light "IQ band" — playful, NOT a real IQ test
  const iqBand =
    scorePct >= 90 ? "Elite 🌟"
    : scorePct >= 75 ? "Sharp 🚀"
    : scorePct >= 60 ? "Solid 👍"
    : scorePct >= 40 ? "Developing 🌱"
    : "Warming up 💪";

  return {
    scorePct, correct, total, timeSec,
    avgPerQ: Math.round(avg),
    speedRating, iqBand, strengths, weakAreas, tips,
  };
}

function prettyType(t: string): string {
  switch (t) {
    case "mcq": return "Multiple choice";
    case "memory-sequence": return "Sequence recall";
    case "memory-objects": return "Object recall";
    case "memory-position": return "Position recall";
    case "memory-pairs": return "Card matching";
    case "logic-order": return "Ordering";
    case "pattern-next": return "Next-in-sequence";
    case "pattern-missing": return "Missing piece";
    case "pattern-grid": return "Visual grid";
    case "problem-scenario": return "Story problem";
    default: return t;
  }
}
