// Sample assessment bank — categories × difficulty × grade band
export type Category = "Memory" | "Logic" | "Pattern" | "Problem";
export type Difficulty = "easy" | "medium" | "hard";

export type Question = {
  id: string;
  category: Category;
  difficulty: Difficulty;
  gradeBand: "1-2" | "3-5" | "6-8" | "9-10";
  prompt: string;
  emoji?: string;
  options: string[];
  answer: number; // index
  explanation: string;
};

export const QUESTIONS: Question[] = [
  // Grades 1–2
  { id: "q1", category: "Pattern", difficulty: "easy", gradeBand: "1-2", emoji: "🍎🍌🍎🍌❓", prompt: "What comes next?", options: ["🍎", "🍌", "🍇", "🍓"], answer: 0, explanation: "The pattern repeats: apple, banana, apple, banana, apple!" },
  { id: "q2", category: "Memory", difficulty: "easy", gradeBand: "1-2", emoji: "🐶🐱🐰", prompt: "Which animal was in the middle?", options: ["Dog", "Cat", "Rabbit", "Fox"], answer: 1, explanation: "Cat was right in the middle 🐱" },
  { id: "q3", category: "Logic", difficulty: "easy", gradeBand: "1-2", emoji: "🔵🔵🔴", prompt: "How many blue circles?", options: ["1", "2", "3", "4"], answer: 1, explanation: "There are 2 blue circles 🔵🔵" },
  { id: "q4", category: "Problem", difficulty: "easy", gradeBand: "1-2", emoji: "🎈🎈🎈+🎈🎈", prompt: "3 balloons + 2 balloons = ?", options: ["4", "5", "6", "7"], answer: 1, explanation: "3 + 2 = 5 balloons!" },

  // Grades 3–5
  { id: "q5", category: "Pattern", difficulty: "medium", gradeBand: "3-5", prompt: "2, 4, 8, 16, ?", options: ["18", "20", "32", "24"], answer: 2, explanation: "Each number doubles: 16 × 2 = 32." },
  { id: "q6", category: "Memory", difficulty: "medium", gradeBand: "3-5", prompt: "Sequence: 7, 3, 9, 5, 2. What was the third number?", options: ["3", "9", "5", "7"], answer: 1, explanation: "Counting from the start: 7 (1st), 3 (2nd), 9 (3rd)." },
  { id: "q7", category: "Logic", difficulty: "medium", gradeBand: "3-5", prompt: "All cats have tails. Whiskers is a cat. Therefore...", options: ["Whiskers has a tail", "Whiskers has wings", "Whiskers is a dog", "Cannot tell"], answer: 0, explanation: "Classic deductive reasoning — if all cats have tails and Whiskers is a cat, Whiskers has a tail." },
  { id: "q8", category: "Problem", difficulty: "medium", gradeBand: "3-5", prompt: "Anya has 24 stickers. She gives 1/3 to her friend. How many does she keep?", options: ["8", "12", "16", "18"], answer: 2, explanation: "1/3 of 24 = 8. So she keeps 24 − 8 = 16." },

  // Grades 6–8
  { id: "q9", category: "Pattern", difficulty: "medium", gradeBand: "6-8", prompt: "1, 1, 2, 3, 5, 8, ?", options: ["11", "13", "12", "10"], answer: 1, explanation: "Fibonacci: each number is the sum of the previous two. 5 + 8 = 13." },
  { id: "q10", category: "Logic", difficulty: "hard", gradeBand: "6-8", prompt: "If today is Wednesday, what day will it be 100 days from now?", options: ["Friday", "Saturday", "Sunday", "Monday"], answer: 0, explanation: "100 ÷ 7 has remainder 2. Wednesday + 2 days = Friday." },
  { id: "q11", category: "Memory", difficulty: "medium", gradeBand: "6-8", prompt: "Remember: 'Red Apple, Blue Sky, Green Grass'. What color was the sky?", options: ["Red", "Blue", "Green", "Yellow"], answer: 1, explanation: "Blue Sky 🌤️" },
  { id: "q12", category: "Problem", difficulty: "hard", gradeBand: "6-8", prompt: "A train travels 60 km in 45 minutes. What is its speed in km/h?", options: ["75", "80", "90", "100"], answer: 1, explanation: "60 km ÷ 0.75 h = 80 km/h." },

  // Grades 9–10
  { id: "q13", category: "Logic", difficulty: "hard", gradeBand: "9-10", prompt: "If P → Q is true and Q is false, what can we conclude about P?", options: ["P is true", "P is false", "P is unknown", "P is both"], answer: 1, explanation: "Modus tollens: if P implies Q and Q is false, then P must be false." },
  { id: "q14", category: "Pattern", difficulty: "hard", gradeBand: "9-10", prompt: "2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "36"], answer: 1, explanation: "Differences are 4, 6, 8, 10, 12 → next is 30 + 12 = 42." },
  { id: "q15", category: "Problem", difficulty: "hard", gradeBand: "9-10", prompt: "Solve: 2x + 7 = 3x − 5", options: ["x = 6", "x = 12", "x = 10", "x = 2"], answer: 1, explanation: "Move x: 7 + 5 = 3x − 2x → x = 12." },
  { id: "q16", category: "Memory", difficulty: "hard", gradeBand: "9-10", prompt: "Sequence: π, e, √2, φ. Which one ≈ 1.618?", options: ["π", "e", "√2", "φ"], answer: 3, explanation: "φ (the golden ratio) ≈ 1.618." },
];

export function pickQuestions(grade: number, difficulty: Difficulty, count = 6): Question[] {
  const band = grade <= 2 ? "1-2" : grade <= 5 ? "3-5" : grade <= 8 ? "6-8" : "9-10";
  // Try band + difficulty match first, then loosen
  const exact = QUESTIONS.filter(q => q.gradeBand === band && q.difficulty === difficulty);
  const fallback = QUESTIONS.filter(q => q.gradeBand === band);
  const pool = exact.length >= 4 ? exact : fallback.length >= 4 ? fallback : QUESTIONS;
  // Shuffle
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function nextDifficulty(scorePercent: number): Difficulty {
  if (scorePercent < 40) return "easy";
  if (scorePercent < 75) return "medium";
  return "hard";
}
