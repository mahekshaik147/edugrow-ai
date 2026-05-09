// IQ Question banks — distinct types per category, distinct questions per level.
export type Category = "Memory" | "Logic" | "Pattern" | "Problem";
export type Level = "easy" | "medium" | "hard";
// Back-compat alias
export type Difficulty = Level;

// Discriminated union — each category uses its own interaction type
export type QuestionBase = {
  id: string;
  category: Category;
  level: Level;
  explanation: string;
};

export type MCQQuestion = QuestionBase & {
  type: "mcq";
  prompt: string;
  emoji?: string;
  options: string[];
  answer: number;
  timeSec?: number; // optional per-question time
};

// Memory: show a sequence/items for N seconds, then quiz
export type MemoryQuestion = QuestionBase & {
  type: "memory-sequence" | "memory-objects" | "memory-position";
  memorize: string[]; // items shown during memorization phase
  memorizeSec: number; // countdown timer
  prompt: string; // shown after memorization
  options: string[];
  answer: number;
};

// Pattern: visible sequence with a missing slot, pick next/missing
export type PatternQuestion = QuestionBase & {
  type: "pattern-next" | "pattern-missing" | "pattern-grid";
  sequence: string[]; // last item is "?" for next, or "?" mid-array for missing
  prompt: string;
  options: string[];
  answer: number;
  timeSec: number; // pattern always timed
};

export type Question = MCQQuestion | MemoryQuestion | PatternQuestion;

// ------------- BANK -------------
export const BANK: Question[] = [
  // ============ MEMORY ============
  // Easy
  { id: "m-e-1", category: "Memory", level: "easy", type: "memory-objects",
    memorize: ["🍎", "🐶", "🚗", "⚽"], memorizeSec: 5,
    prompt: "Which of these was NOT shown?", options: ["🐶", "🌸", "⚽", "🚗"], answer: 1,
    explanation: "The flower 🌸 was never shown — only apple, dog, car, ball." },
  { id: "m-e-2", category: "Memory", level: "easy", type: "memory-sequence",
    memorize: ["3", "7", "1"], memorizeSec: 4,
    prompt: "What was the FIRST number?", options: ["1", "3", "7", "9"], answer: 1,
    explanation: "The sequence started with 3." },
  { id: "m-e-3", category: "Memory", level: "easy", type: "memory-position",
    memorize: ["🐱", "🐰", "🦊"], memorizeSec: 4,
    prompt: "Which animal was in the MIDDLE?", options: ["Cat 🐱", "Rabbit 🐰", "Fox 🦊", "Dog 🐶"], answer: 1,
    explanation: "Rabbit 🐰 sat in the middle." },
  { id: "m-e-4", category: "Memory", level: "easy", type: "memory-objects",
    memorize: ["⭐", "🌙", "☀️"], memorizeSec: 4,
    prompt: "How many items did you see?", options: ["2", "3", "4", "5"], answer: 1,
    explanation: "Three sky symbols were shown." },

  // Medium
  { id: "m-m-1", category: "Memory", level: "medium", type: "memory-sequence",
    memorize: ["8", "2", "5", "9", "1"], memorizeSec: 6,
    prompt: "What was the THIRD number?", options: ["2", "5", "9", "8"], answer: 1,
    explanation: "Counting in order: 8, 2, 5 — the third was 5." },
  { id: "m-m-2", category: "Memory", level: "medium", type: "memory-objects",
    memorize: ["🍕", "🚲", "📚", "🎸", "🏀"], memorizeSec: 6,
    prompt: "Which item was NOT shown?", options: ["Pizza 🍕", "Drums 🥁", "Guitar 🎸", "Basketball 🏀"], answer: 1,
    explanation: "Drums 🥁 weren't there — guitar 🎸 was." },
  { id: "m-m-3", category: "Memory", level: "medium", type: "memory-position",
    memorize: ["🔴", "🟢", "🔵", "🟡"], memorizeSec: 5,
    prompt: "What color was in position 2?", options: ["Red", "Green", "Blue", "Yellow"], answer: 1,
    explanation: "Order was red, green, blue, yellow — position 2 is green." },
  { id: "m-m-4", category: "Memory", level: "medium", type: "memory-sequence",
    memorize: ["A", "F", "K", "P"], memorizeSec: 6,
    prompt: "Which letter was LAST?", options: ["F", "K", "P", "Q"], answer: 2,
    explanation: "The sequence ended with P." },

  // Hard
  { id: "m-h-1", category: "Memory", level: "hard", type: "memory-sequence",
    memorize: ["7", "4", "9", "2", "6", "3", "8"], memorizeSec: 7,
    prompt: "What were the LAST two numbers in order?", options: ["6, 3", "3, 8", "2, 6", "9, 2"], answer: 1,
    explanation: "The sequence ended …3, 8." },
  { id: "m-h-2", category: "Memory", level: "hard", type: "memory-objects",
    memorize: ["🦒", "🐢", "🦋", "🐙", "🦜", "🐝"], memorizeSec: 7,
    prompt: "How many animals had wings?", options: ["1", "2", "3", "4"], answer: 1,
    explanation: "Butterfly 🦋 and parrot 🦜 and bee 🐝 — three winged animals." },
  { id: "m-h-3", category: "Memory", level: "hard", type: "memory-position",
    memorize: ["♠", "♥", "♣", "♦", "★"], memorizeSec: 6,
    prompt: "Which symbol was in position 4?", options: ["♣", "♦", "★", "♥"], answer: 1,
    explanation: "Order was spade, heart, club, diamond, star — position 4 is diamond ♦." },
  { id: "m-h-4", category: "Memory", level: "hard", type: "memory-sequence",
    memorize: ["12", "47", "85", "23", "61"], memorizeSec: 8,
    prompt: "Which number appeared in the sequence?", options: ["48", "85", "32", "16"], answer: 1,
    explanation: "85 was the third number." },

  // ============ LOGIC ============
  // Easy
  { id: "l-e-1", category: "Logic", level: "easy", type: "mcq",
    prompt: "Find the ODD ONE OUT:", options: ["Apple 🍎", "Banana 🍌", "Carrot 🥕", "Grape 🍇"], answer: 2,
    explanation: "Apple, banana and grape are fruits — carrot is a vegetable." },
  { id: "l-e-2", category: "Logic", level: "easy", type: "mcq",
    prompt: "If all dogs bark and Rex is a dog, then Rex…", options: ["meows", "barks", "flies", "swims"], answer: 1,
    explanation: "Deduction: every dog barks, so Rex must bark." },
  { id: "l-e-3", category: "Logic", level: "easy", type: "mcq",
    prompt: "Which is the BIGGEST?", options: ["Ant 🐜", "Cat 🐱", "Elephant 🐘", "Mouse 🐭"], answer: 2,
    explanation: "Elephant 🐘 is the biggest animal in the list." },
  { id: "l-e-4", category: "Logic", level: "easy", type: "mcq",
    prompt: "Tom is taller than Sam. Sam is taller than Kim. Who is shortest?",
    options: ["Tom", "Sam", "Kim", "Same"], answer: 2,
    explanation: "Order: Tom > Sam > Kim → Kim is shortest." },

  // Medium
  { id: "l-m-1", category: "Logic", level: "medium", type: "mcq",
    prompt: "Find the ODD ONE OUT:", options: ["Square", "Triangle", "Circle", "Cube"], answer: 3,
    explanation: "Cube is 3D; the others are 2D shapes." },
  { id: "l-m-2", category: "Logic", level: "medium", type: "mcq",
    prompt: "If today is Friday, what day is 3 days BEFORE yesterday?",
    options: ["Saturday", "Sunday", "Monday", "Tuesday"], answer: 2,
    explanation: "Yesterday was Thursday. 3 days before Thursday = Monday." },
  { id: "l-m-3", category: "Logic", level: "medium", type: "mcq",
    prompt: "Maya faces North, turns 90° right, then 180°. Which way does she face?",
    options: ["North", "South", "East", "West"], answer: 3,
    explanation: "North → right = East. East + 180° = West." },
  { id: "l-m-4", category: "Logic", level: "medium", type: "mcq",
    prompt: "Statement: 'Some birds can swim.' Conclusion?",
    options: ["All birds swim", "No bird swims", "At least one bird swims", "Birds are fish"], answer: 2,
    explanation: "'Some' guarantees at least one — nothing more." },

  // Hard
  { id: "l-h-1", category: "Logic", level: "hard", type: "mcq",
    prompt: "If P → Q is true and Q is FALSE, then P is…",
    options: ["True", "False", "Unknown", "Both"], answer: 1,
    explanation: "Modus tollens: when Q is false, P must also be false." },
  { id: "l-h-2", category: "Logic", level: "hard", type: "mcq",
    prompt: "A is B's brother. C is A's mother. D is C's father. D is ___ of B.",
    options: ["Father", "Brother", "Grandfather", "Uncle"], answer: 2,
    explanation: "C is mother of both A and B. D is C's father → grandfather of B." },
  { id: "l-h-3", category: "Logic", level: "hard", type: "mcq",
    prompt: "Find the ODD ONE OUT:", options: ["121", "144", "169", "150"], answer: 3,
    explanation: "121, 144, 169 are perfect squares (11², 12², 13²). 150 is not." },
  { id: "l-h-4", category: "Logic", level: "hard", type: "mcq",
    prompt: "All roses are flowers. Some flowers fade quickly. So…",
    options: ["All roses fade quickly", "Some roses fade quickly", "No conclusion is certain", "Roses never fade"], answer: 2,
    explanation: "We can't be sure roses are in the 'fading' subset — no certain conclusion." },

  // ============ PROBLEM SOLVING ============
  // Easy
  { id: "p-e-1", category: "Problem", level: "easy", type: "mcq",
    prompt: "You have 6 candies and share equally with 2 friends (3 people total). How many each?",
    options: ["2", "3", "4", "6"], answer: 0,
    explanation: "6 ÷ 3 = 2 candies each." },
  { id: "p-e-2", category: "Problem", level: "easy", type: "mcq",
    prompt: "A bus comes every 10 minutes. You missed one at 9:00. When is the next?",
    options: ["9:05", "9:10", "9:20", "9:15"], answer: 1,
    explanation: "Next bus = 9:00 + 10 min = 9:10." },
  { id: "p-e-3", category: "Problem", level: "easy", type: "mcq",
    prompt: "It rains and you have one umbrella for two friends. Best choice?",
    options: ["Run alone", "Share the umbrella", "Throw it away", "Wait forever"], answer: 1,
    explanation: "Sharing keeps both friends dry — the kindest, smartest choice." },
  { id: "p-e-4", category: "Problem", level: "easy", type: "mcq",
    prompt: "5 + 3 × 2 = ?", options: ["16", "11", "13", "10"], answer: 1,
    explanation: "Multiply first: 3×2=6, then 5+6=11." },

  // Medium
  { id: "p-m-1", category: "Problem", level: "medium", type: "mcq",
    prompt: "A train travels 60 km in 45 minutes. Speed in km/h?",
    options: ["75", "80", "90", "100"], answer: 1,
    explanation: "60 km ÷ 0.75 h = 80 km/h." },
  { id: "p-m-2", category: "Problem", level: "medium", type: "mcq",
    prompt: "Anya has 24 stickers, gives away 1/3, then buys 5 more. How many now?",
    options: ["13", "16", "19", "21"], answer: 3,
    explanation: "24 − 8 = 16, then 16 + 5 = 21." },
  { id: "p-m-3", category: "Problem", level: "medium", type: "mcq",
    prompt: "Your homework takes 25 min and you have 4 subjects. Total time?",
    options: ["50 min", "1 hour 20 min", "1 hour 40 min", "2 hours"], answer: 2,
    explanation: "25 × 4 = 100 minutes = 1 hour 40 minutes." },
  { id: "p-m-4", category: "Problem", level: "medium", type: "mcq",
    prompt: "A shop offers '3 for $10'. How much for 9 items?",
    options: ["$25", "$27", "$30", "$33"], answer: 2,
    explanation: "9 ÷ 3 = 3 packs × $10 = $30." },

  // Hard
  { id: "p-h-1", category: "Problem", level: "hard", type: "mcq",
    prompt: "Solve: 2x + 7 = 3x − 5", options: ["x = 6", "x = 12", "x = 10", "x = 2"], answer: 1,
    explanation: "Move x: 7 + 5 = 3x − 2x → x = 12." },
  { id: "p-h-2", category: "Problem", level: "hard", type: "mcq",
    prompt: "A tank fills in 4 hours with pipe A, 6 hours with pipe B. Both together?",
    options: ["2 h", "2.4 h", "3 h", "5 h"], answer: 1,
    explanation: "Rates 1/4 + 1/6 = 5/12 per hour → 12/5 = 2.4 hours." },
  { id: "p-h-3", category: "Problem", level: "hard", type: "mcq",
    prompt: "A shirt costs $80 after a 20% discount. Original price?",
    options: ["$96", "$100", "$120", "$160"], answer: 1,
    explanation: "$80 = 80% of original → original = 80 / 0.8 = $100." },
  { id: "p-h-4", category: "Problem", level: "hard", type: "mcq",
    prompt: "Two cars start 300 km apart, drive towards each other at 50 and 70 km/h. When do they meet?",
    options: ["1.5 h", "2 h", "2.5 h", "3 h"], answer: 2,
    explanation: "Closing speed 120 km/h. 300 ÷ 120 = 2.5 hours." },

  // ============ PATTERN ============
  // Easy
  { id: "pa-e-1", category: "Pattern", level: "easy", type: "pattern-next",
    sequence: ["🔴", "🔵", "🔴", "🔵", "?"], prompt: "What comes next?",
    options: ["🔴", "🔵", "🟢", "🟡"], answer: 0, timeSec: 20,
    explanation: "Alternating red/blue — next is red." },
  { id: "pa-e-2", category: "Pattern", level: "easy", type: "pattern-next",
    sequence: ["2", "4", "6", "8", "?"], prompt: "Next number?",
    options: ["9", "10", "12", "14"], answer: 1, timeSec: 20,
    explanation: "Add 2 each step → 10." },
  { id: "pa-e-3", category: "Pattern", level: "easy", type: "pattern-missing",
    sequence: ["⭐", "?", "⭐", "🌙"], prompt: "What fits the missing slot?",
    options: ["⭐", "🌙", "☀️", "🌟"], answer: 1, timeSec: 20,
    explanation: "Pattern: star, moon, star, moon — the gap is moon." },
  { id: "pa-e-4", category: "Pattern", level: "easy", type: "pattern-next",
    sequence: ["A", "B", "C", "D", "?"], prompt: "Next letter?",
    options: ["E", "F", "G", "Z"], answer: 0, timeSec: 18,
    explanation: "Alphabet order — next is E." },

  // Medium
  { id: "pa-m-1", category: "Pattern", level: "medium", type: "pattern-next",
    sequence: ["2", "4", "8", "16", "?"], prompt: "Next number?",
    options: ["18", "24", "32", "20"], answer: 2, timeSec: 25,
    explanation: "Each number doubles → 32." },
  { id: "pa-m-2", category: "Pattern", level: "medium", type: "pattern-next",
    sequence: ["🔺", "🔻", "🔺🔺", "🔻🔻", "?"], prompt: "What comes next?",
    options: ["🔺🔺🔺", "🔻🔻🔻", "🔺", "🔻"], answer: 0, timeSec: 25,
    explanation: "Each pair grows by one: next is three triangles up." },
  { id: "pa-m-3", category: "Pattern", level: "medium", type: "pattern-missing",
    sequence: ["3", "6", "?", "24", "48"], prompt: "What's missing?",
    options: ["9", "12", "18", "15"], answer: 1, timeSec: 25,
    explanation: "Each number doubles → 12." },
  { id: "pa-m-4", category: "Pattern", level: "medium", type: "pattern-next",
    sequence: ["A", "C", "E", "G", "?"], prompt: "Next letter?",
    options: ["H", "I", "J", "K"], answer: 1, timeSec: 25,
    explanation: "Skip one each time: A, C, E, G, I." },

  // Hard
  { id: "pa-h-1", category: "Pattern", level: "hard", type: "pattern-next",
    sequence: ["1", "1", "2", "3", "5", "8", "?"], prompt: "Next Fibonacci number?",
    options: ["11", "12", "13", "14"], answer: 2, timeSec: 30,
    explanation: "Each is sum of the two previous: 5 + 8 = 13." },
  { id: "pa-h-2", category: "Pattern", level: "hard", type: "pattern-next",
    sequence: ["2", "6", "12", "20", "30", "?"], prompt: "Next number?",
    options: ["40", "42", "44", "36"], answer: 1, timeSec: 30,
    explanation: "Differences 4,6,8,10,12 → 30 + 12 = 42." },
  { id: "pa-h-3", category: "Pattern", level: "hard", type: "pattern-missing",
    sequence: ["1", "4", "9", "?", "25", "36"], prompt: "What's the missing square?",
    options: ["12", "16", "18", "20"], answer: 1, timeSec: 30,
    explanation: "Squares of 1,2,3,4,5,6 → missing is 4² = 16." },
  { id: "pa-h-4", category: "Pattern", level: "hard", type: "pattern-next",
    sequence: ["🟦", "🟦🟧", "🟦🟧🟦", "🟦🟧🟦🟧", "?"], prompt: "Next in the sequence?",
    options: ["🟦🟧🟦🟧🟦", "🟧🟦🟧", "🟦🟦🟦", "🟧🟧🟧"], answer: 0, timeSec: 30,
    explanation: "Pattern alternates blue/orange and grows by one each step." },
];

export function pickQuestions(category: Category, level: Level, count = 5): Question[] {
  const pool = BANK.filter(q => q.category === category && q.level === level);
  return [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
}

export function suggestLevelForGrade(grade: number): Level {
  if (grade <= 4) return "easy";
  if (grade <= 7) return "medium";
  return "hard";
}

export function nextLevel(scorePercent: number, current: Level): Level {
  if (scorePercent >= 85 && current === "easy") return "medium";
  if (scorePercent >= 85 && current === "medium") return "hard";
  if (scorePercent < 40 && current === "hard") return "medium";
  if (scorePercent < 40 && current === "medium") return "easy";
  return current;
}

// Back-compat (older callers)
export const nextDifficulty = (pct: number): Level =>
  pct < 40 ? "easy" : pct < 75 ? "medium" : "hard";
