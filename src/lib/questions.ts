// IQ Question banks — every category has its OWN interaction styles + level-specific banks.
export type Category = "Memory" | "Logic" | "Pattern" | "Problem";
export type Level = "easy" | "medium" | "hard";
export type Difficulty = Level;

export type QuestionBase = {
  id: string;
  category: Category;
  level: Level;
  explanation: string;
};

// --- MEMORY: memorize phase + recall ---
export type MemoryQuestion = QuestionBase & {
  type: "memory-sequence" | "memory-objects" | "memory-position";
  memorize: string[];
  memorizeSec: number;
  prompt: string;
  options: string[];
  answer: number;
};

// MEMORY PAIRS: flip cards, find matching pair (interactive)
export type MemoryPairsQuestion = QuestionBase & {
  type: "memory-pairs";
  memorizeSec: number;
  // grid of emojis (each appears twice, shuffled)
  pairs: string[]; // unique items; engine duplicates and shuffles
  prompt: string;
  // for scoring we treat as "find all pairs in N flips" — answer = max acceptable mismatches
  maxMismatches: number;
  // synthesized for compatibility with answer indexing in result calc
  options: string[];
  answer: number;
};

// --- LOGIC ---
export type MCQQuestion = QuestionBase & {
  type: "mcq";
  prompt: string;
  emoji?: string;
  options: string[];
  answer: number;
  timeSec?: number;
};

// LOGIC ORDER: arrange items in correct order by clicking
export type LogicOrderQuestion = QuestionBase & {
  type: "logic-order";
  prompt: string;
  items: string[];        // shown shuffled
  correctOrder: string[]; // the right sequence
  options: string[];      // unused but kept for indexing
  answer: number;         // 0 = correct, used by scoring
};

// --- PATTERN ---
export type PatternQuestion = QuestionBase & {
  type: "pattern-next" | "pattern-missing";
  sequence: string[];
  prompt: string;
  options: string[];
  answer: number;
  timeSec: number;
};

// PATTERN GRID: 3x3 visual grid with one missing cell
export type PatternGridQuestion = QuestionBase & {
  type: "pattern-grid";
  grid: string[]; // length 9, "?" marks missing
  prompt: string;
  options: string[];
  answer: number;
  timeSec: number;
};

// --- PROBLEM ---
// scenario-based: a short story + multi-step thinking
export type ScenarioQuestion = QuestionBase & {
  type: "problem-scenario";
  scenario: string;       // story
  emoji: string;          // hero emoji for story card
  prompt: string;         // the actual question
  options: string[];
  answer: number;
};

export type Question =
  | MCQQuestion
  | MemoryQuestion
  | MemoryPairsQuestion
  | LogicOrderQuestion
  | PatternQuestion
  | PatternGridQuestion
  | ScenarioQuestion;

// ============================================================
// BANK — distinct content per category × level
// ============================================================
export const BANK: Question[] = [
  // ============ MEMORY ============
  // EASY
  { id: "m-e-1", category: "Memory", level: "easy", type: "memory-objects",
    memorize: ["🍎","🐶","🚗","⚽"], memorizeSec: 5,
    prompt: "Which item was NOT shown?", options: ["🐶","🌸","⚽","🚗"], answer: 1,
    explanation: "🌸 was never shown." },
  { id: "m-e-2", category: "Memory", level: "easy", type: "memory-sequence",
    memorize: ["3","7","1"], memorizeSec: 4,
    prompt: "What was the FIRST number?", options: ["1","3","7","9"], answer: 1,
    explanation: "Sequence started with 3." },
  { id: "m-e-3", category: "Memory", level: "easy", type: "memory-position",
    memorize: ["🐱","🐰","🦊"], memorizeSec: 4,
    prompt: "Which animal was in the MIDDLE?",
    options: ["Cat 🐱","Rabbit 🐰","Fox 🦊","Dog 🐶"], answer: 1,
    explanation: "Rabbit 🐰 sat in the middle." },
  { id: "m-e-4", category: "Memory", level: "easy", type: "memory-pairs",
    memorizeSec: 4, pairs: ["🍓","🍌","🍇"], maxMismatches: 4,
    prompt: "Tap cards to find matching pairs.",
    options: ["done"], answer: 0,
    explanation: "Pair-matching trains short-term visual memory." },
  { id: "m-e-5", category: "Memory", level: "easy", type: "memory-objects",
    memorize: ["⭐","🌙","☀️"], memorizeSec: 4,
    prompt: "How many items did you see?", options: ["2","3","4","5"], answer: 1,
    explanation: "Three sky symbols were shown." },
  { id: "m-e-6", category: "Memory", level: "easy", type: "memory-sequence",
    memorize: ["🟥","🟦","🟨"], memorizeSec: 4,
    prompt: "What color was LAST?",
    options: ["Red","Blue","Yellow","Green"], answer: 2,
    explanation: "Order: red, blue, yellow." },

  // MEDIUM
  { id: "m-m-1", category: "Memory", level: "medium", type: "memory-sequence",
    memorize: ["8","2","5","9","1"], memorizeSec: 6,
    prompt: "What was the THIRD number?", options: ["2","5","9","8"], answer: 1,
    explanation: "8, 2, 5 — third = 5." },
  { id: "m-m-2", category: "Memory", level: "medium", type: "memory-objects",
    memorize: ["🍕","🚲","📚","🎸","🏀"], memorizeSec: 6,
    prompt: "Which item was NOT shown?",
    options: ["Pizza 🍕","Drums 🥁","Guitar 🎸","Basketball 🏀"], answer: 1,
    explanation: "Drums 🥁 weren't shown — guitar 🎸 was." },
  { id: "m-m-3", category: "Memory", level: "medium", type: "memory-position",
    memorize: ["🔴","🟢","🔵","🟡"], memorizeSec: 5,
    prompt: "Color in position 2?",
    options: ["Red","Green","Blue","Yellow"], answer: 1,
    explanation: "Position 2 was green." },
  { id: "m-m-4", category: "Memory", level: "medium", type: "memory-pairs",
    memorizeSec: 5, pairs: ["🐶","🐱","🐰","🦊"], maxMismatches: 6,
    prompt: "Match all the animal pairs.",
    options: ["done"], answer: 0,
    explanation: "Visual memory pairs strengthen recall." },
  { id: "m-m-5", category: "Memory", level: "medium", type: "memory-sequence",
    memorize: ["A","F","K","P"], memorizeSec: 6,
    prompt: "Which letter was LAST?", options: ["F","K","P","Q"], answer: 2,
    explanation: "Sequence ended with P." },
  { id: "m-m-6", category: "Memory", level: "medium", type: "memory-objects",
    memorize: ["🦁","🐯","🐻","🐼","🐸"], memorizeSec: 6,
    prompt: "How many of the shown were big cats?",
    options: ["1","2","3","4"], answer: 1,
    explanation: "Lion 🦁 and tiger 🐯 — two big cats." },

  // HARD
  { id: "m-h-1", category: "Memory", level: "hard", type: "memory-sequence",
    memorize: ["7","4","9","2","6","3","8"], memorizeSec: 7,
    prompt: "What were the LAST two numbers in order?",
    options: ["6, 3","3, 8","2, 6","9, 2"], answer: 1,
    explanation: "Ended …3, 8." },
  { id: "m-h-2", category: "Memory", level: "hard", type: "memory-objects",
    memorize: ["🦒","🐢","🦋","🐙","🦜","🐝"], memorizeSec: 7,
    prompt: "How many had wings?", options: ["1","2","3","4"], answer: 2,
    explanation: "Butterfly, parrot, bee — three winged creatures." },
  { id: "m-h-3", category: "Memory", level: "hard", type: "memory-position",
    memorize: ["♠","♥","♣","♦","★"], memorizeSec: 6,
    prompt: "Symbol in position 4?",
    options: ["♣","♦","★","♥"], answer: 1,
    explanation: "Position 4 = diamond ♦." },
  { id: "m-h-4", category: "Memory", level: "hard", type: "memory-pairs",
    memorizeSec: 6, pairs: ["🌟","🌙","☀️","⚡","🔥","💧"], maxMismatches: 9,
    prompt: "Match all the symbol pairs.",
    options: ["done"], answer: 0,
    explanation: "Tracking 6 pairs trains working memory." },
  { id: "m-h-5", category: "Memory", level: "hard", type: "memory-sequence",
    memorize: ["12","47","85","23","61"], memorizeSec: 8,
    prompt: "Which number appeared?",
    options: ["48","85","32","16"], answer: 1,
    explanation: "85 was in the sequence." },
  { id: "m-h-6", category: "Memory", level: "hard", type: "memory-objects",
    memorize: ["🟦","🟧","🟪","🟩","🟥","⬛"], memorizeSec: 6,
    prompt: "Which color was MISSING?",
    options: ["Purple","Yellow","Black","Green"], answer: 1,
    explanation: "Yellow was not shown." },

  // ============ LOGIC ============
  // EASY
  { id: "l-e-1", category: "Logic", level: "easy", type: "mcq",
    prompt: "Find the ODD ONE OUT:",
    options: ["Apple 🍎","Banana 🍌","Carrot 🥕","Grape 🍇"], answer: 2,
    explanation: "Carrot is a vegetable; the rest are fruit." },
  { id: "l-e-2", category: "Logic", level: "easy", type: "mcq",
    prompt: "All dogs bark. Rex is a dog. So Rex…",
    options: ["meows","barks","flies","swims"], answer: 1,
    explanation: "Deduction: every dog barks → Rex barks." },
  { id: "l-e-3", category: "Logic", level: "easy", type: "logic-order",
    prompt: "Arrange from SMALLEST to LARGEST:",
    items: ["🐘","🐜","🐱","🐭"],
    correctOrder: ["🐜","🐭","🐱","🐘"],
    options: ["correct"], answer: 0,
    explanation: "Ant < mouse < cat < elephant." },
  { id: "l-e-4", category: "Logic", level: "easy", type: "mcq",
    prompt: "Tom > Sam > Kim. Who is shortest?",
    options: ["Tom","Sam","Kim","Same"], answer: 2,
    explanation: "Kim is shortest." },
  { id: "l-e-5", category: "Logic", level: "easy", type: "logic-order",
    prompt: "Put the days in ORDER (start Monday):",
    items: ["Wed","Mon","Fri","Tue","Thu"],
    correctOrder: ["Mon","Tue","Wed","Thu","Fri"],
    options: ["correct"], answer: 0,
    explanation: "Mon, Tue, Wed, Thu, Fri." },
  { id: "l-e-6", category: "Logic", level: "easy", type: "mcq",
    prompt: "Which is BIGGEST?",
    options: ["Ant 🐜","Cat 🐱","Elephant 🐘","Mouse 🐭"], answer: 2,
    explanation: "Elephant is biggest." },

  // MEDIUM
  { id: "l-m-1", category: "Logic", level: "medium", type: "mcq",
    prompt: "ODD ONE OUT:",
    options: ["Square","Triangle","Circle","Cube"], answer: 3,
    explanation: "Cube is 3D; others are 2D." },
  { id: "l-m-2", category: "Logic", level: "medium", type: "mcq",
    prompt: "Today is Friday. What day is 3 days BEFORE yesterday?",
    options: ["Saturday","Sunday","Monday","Tuesday"], answer: 2,
    explanation: "Yesterday = Thu. 3 before = Mon." },
  { id: "l-m-3", category: "Logic", level: "medium", type: "logic-order",
    prompt: "Order the planets by DISTANCE from the Sun (closest first):",
    items: ["Mars","Earth","Mercury","Venus"],
    correctOrder: ["Mercury","Venus","Earth","Mars"],
    options: ["correct"], answer: 0,
    explanation: "Mercury, Venus, Earth, Mars." },
  { id: "l-m-4", category: "Logic", level: "medium", type: "mcq",
    prompt: "Maya faces North, turns 90° right, then 180°. Direction?",
    options: ["North","South","East","West"], answer: 3,
    explanation: "North → East → West." },
  { id: "l-m-5", category: "Logic", level: "medium", type: "logic-order",
    prompt: "Arrange in size order (smallest first):",
    items: ["1.2","0.5","2.0","0.9"],
    correctOrder: ["0.5","0.9","1.2","2.0"],
    options: ["correct"], answer: 0,
    explanation: "0.5 < 0.9 < 1.2 < 2.0." },
  { id: "l-m-6", category: "Logic", level: "medium", type: "mcq",
    prompt: "'Some birds can swim.' Conclusion?",
    options: ["All birds swim","No bird swims","At least one bird swims","Birds are fish"], answer: 2,
    explanation: "'Some' = at least one." },

  // HARD
  { id: "l-h-1", category: "Logic", level: "hard", type: "mcq",
    prompt: "P → Q is true and Q is FALSE. Then P is…",
    options: ["True","False","Unknown","Both"], answer: 1,
    explanation: "Modus tollens: P must be false." },
  { id: "l-h-2", category: "Logic", level: "hard", type: "mcq",
    prompt: "A is B's brother. C is A's mother. D is C's father. D is __ of B.",
    options: ["Father","Brother","Grandfather","Uncle"], answer: 2,
    explanation: "D is grandfather of B." },
  { id: "l-h-3", category: "Logic", level: "hard", type: "logic-order",
    prompt: "Arrange these from SMALLEST to LARGEST:",
    items: ["169","121","150","144"],
    correctOrder: ["121","144","150","169"],
    options: ["correct"], answer: 0,
    explanation: "121 < 144 < 150 < 169." },
  { id: "l-h-4", category: "Logic", level: "hard", type: "mcq",
    prompt: "All roses are flowers. Some flowers fade quickly. So…",
    options: ["All roses fade","Some roses fade","No conclusion is certain","Roses never fade"], answer: 2,
    explanation: "Cannot conclude roses are in the fading subset." },
  { id: "l-h-5", category: "Logic", level: "hard", type: "logic-order",
    prompt: "Order the events of a chemical reaction:",
    items: ["Products form","Bonds break","Reactants meet","Energy released"],
    correctOrder: ["Reactants meet","Bonds break","Products form","Energy released"],
    options: ["correct"], answer: 0,
    explanation: "Meet → break → form → release." },
  { id: "l-h-6", category: "Logic", level: "hard", type: "mcq",
    prompt: "ODD ONE OUT:",
    options: ["121","144","169","150"], answer: 3,
    explanation: "150 is not a perfect square." },

  // ============ PROBLEM SOLVING (scenario-heavy) ============
  // EASY
  { id: "p-e-1", category: "Problem", level: "easy", type: "problem-scenario",
    emoji: "🍬",
    scenario: "You have 6 candies and want to share equally with 2 friends. There are 3 of you in total.",
    prompt: "How many candies does each person get?",
    options: ["2","3","4","6"], answer: 0,
    explanation: "6 ÷ 3 = 2 each." },
  { id: "p-e-2", category: "Problem", level: "easy", type: "problem-scenario",
    emoji: "🚌",
    scenario: "A bus arrives every 10 minutes. You missed one at exactly 9:00.",
    prompt: "When does the next bus arrive?",
    options: ["9:05","9:10","9:20","9:15"], answer: 1,
    explanation: "9:00 + 10 = 9:10." },
  { id: "p-e-3", category: "Problem", level: "easy", type: "problem-scenario",
    emoji: "☔",
    scenario: "It starts raining. You and your friend are walking home with only ONE umbrella.",
    prompt: "What's the SMARTEST choice?",
    options: ["Run alone","Share the umbrella","Throw it away","Wait forever"], answer: 1,
    explanation: "Sharing keeps both dry." },
  { id: "p-e-4", category: "Problem", level: "easy", type: "mcq",
    prompt: "5 + 3 × 2 = ?",
    options: ["16","11","13","10"], answer: 1,
    explanation: "Multiply first → 5 + 6 = 11." },
  { id: "p-e-5", category: "Problem", level: "easy", type: "problem-scenario",
    emoji: "🪙",
    scenario: "Your piggy bank has 4 coins of $2 and 3 coins of $1.",
    prompt: "How much money is inside?",
    options: ["$9","$11","$10","$12"], answer: 1,
    explanation: "4×2 + 3×1 = 8 + 3 = $11." },
  { id: "p-e-6", category: "Problem", level: "easy", type: "problem-scenario",
    emoji: "📚",
    scenario: "You read 5 pages every day for one week (7 days).",
    prompt: "How many pages have you read?",
    options: ["30","35","40","45"], answer: 1,
    explanation: "5 × 7 = 35." },

  // MEDIUM
  { id: "p-m-1", category: "Problem", level: "medium", type: "problem-scenario",
    emoji: "🚆",
    scenario: "A train travels 60 km in 45 minutes at constant speed.",
    prompt: "What is its speed in km/h?",
    options: ["75","80","90","100"], answer: 1,
    explanation: "60 ÷ 0.75 = 80 km/h." },
  { id: "p-m-2", category: "Problem", level: "medium", type: "problem-scenario",
    emoji: "🌟",
    scenario: "Anya has 24 stickers. She gives 1/3 to her sister, then buys 5 more.",
    prompt: "How many stickers does Anya have now?",
    options: ["13","16","19","21"], answer: 3,
    explanation: "24 − 8 = 16, then +5 = 21." },
  { id: "p-m-3", category: "Problem", level: "medium", type: "problem-scenario",
    emoji: "📝",
    scenario: "Each subject takes 25 minutes of homework. You have 4 subjects today.",
    prompt: "Total homework time?",
    options: ["50 min","1 h 20 min","1 h 40 min","2 h"], answer: 2,
    explanation: "25×4 = 100 min = 1 h 40 min." },
  { id: "p-m-4", category: "Problem", level: "medium", type: "problem-scenario",
    emoji: "🛒",
    scenario: "A shop sells '3 for $10'. You want exactly 9 items.",
    prompt: "How much do 9 items cost?",
    options: ["$25","$27","$30","$33"], answer: 2,
    explanation: "9÷3 = 3 packs × $10 = $30." },
  { id: "p-m-5", category: "Problem", level: "medium", type: "problem-scenario",
    emoji: "🏊",
    scenario: "A pool fills at 200 L per minute. It can hold 3,000 L.",
    prompt: "Minutes to fill it completely?",
    options: ["10","12","15","20"], answer: 2,
    explanation: "3000 ÷ 200 = 15 minutes." },
  { id: "p-m-6", category: "Problem", level: "medium", type: "mcq",
    prompt: "(8 + 4) ÷ 2 + 3² = ?",
    options: ["12","15","18","21"], answer: 1,
    explanation: "12÷2 + 9 = 6 + 9 = 15." },

  // HARD
  { id: "p-h-1", category: "Problem", level: "hard", type: "mcq",
    prompt: "Solve: 2x + 7 = 3x − 5",
    options: ["x = 6","x = 12","x = 10","x = 2"], answer: 1,
    explanation: "x = 12." },
  { id: "p-h-2", category: "Problem", level: "hard", type: "problem-scenario",
    emoji: "🚿",
    scenario: "Pipe A fills a tank in 4 hours. Pipe B fills it in 6 hours.",
    prompt: "Together, how long to fill the tank?",
    options: ["2 h","2.4 h","3 h","5 h"], answer: 1,
    explanation: "1/4 + 1/6 = 5/12 → 12/5 = 2.4 h." },
  { id: "p-h-3", category: "Problem", level: "hard", type: "problem-scenario",
    emoji: "👕",
    scenario: "A shirt is sold for $80 after a 20% discount.",
    prompt: "What was the ORIGINAL price?",
    options: ["$96","$100","$120","$160"], answer: 1,
    explanation: "80 / 0.8 = $100." },
  { id: "p-h-4", category: "Problem", level: "hard", type: "problem-scenario",
    emoji: "🚗",
    scenario: "Two cars start 300 km apart and drive towards each other at 50 and 70 km/h.",
    prompt: "When do they meet?",
    options: ["1.5 h","2 h","2.5 h","3 h"], answer: 2,
    explanation: "Closing 120 km/h → 300/120 = 2.5 h." },
  { id: "p-h-5", category: "Problem", level: "hard", type: "problem-scenario",
    emoji: "💼",
    scenario: "A worker earns $15/hour normally and 1.5× on overtime. In a week she worked 40 normal hours and 6 overtime hours.",
    prompt: "Total weekly pay?",
    options: ["$735","$735.00","$675","$735.50"], answer: 0,
    explanation: "40×15 + 6×22.5 = 600 + 135 = $735." },
  { id: "p-h-6", category: "Problem", level: "hard", type: "mcq",
    prompt: "If 3^x = 81, then x = ?",
    options: ["3","4","5","6"], answer: 1,
    explanation: "3⁴ = 81." },

  // ============ PATTERN ============
  // EASY
  { id: "pa-e-1", category: "Pattern", level: "easy", type: "pattern-next",
    sequence: ["🔴","🔵","🔴","🔵","?"], prompt: "What comes next?",
    options: ["🔴","🔵","🟢","🟡"], answer: 0, timeSec: 20,
    explanation: "Alternating red/blue → red." },
  { id: "pa-e-2", category: "Pattern", level: "easy", type: "pattern-next",
    sequence: ["2","4","6","8","?"], prompt: "Next number?",
    options: ["9","10","12","14"], answer: 1, timeSec: 20,
    explanation: "+2 each step → 10." },
  { id: "pa-e-3", category: "Pattern", level: "easy", type: "pattern-missing",
    sequence: ["⭐","?","⭐","🌙"], prompt: "What fits the gap?",
    options: ["⭐","🌙","☀️","🌟"], answer: 1, timeSec: 20,
    explanation: "Star/moon alternates → moon." },
  { id: "pa-e-4", category: "Pattern", level: "easy", type: "pattern-grid",
    grid: ["🔴","🔵","🔴","🔵","🔴","🔵","🔴","?","🔴"],
    prompt: "Which fits the missing cell?",
    options: ["🔴","🔵","🟢","🟡"], answer: 1, timeSec: 25,
    explanation: "Row alternates red/blue → blue." },
  { id: "pa-e-5", category: "Pattern", level: "easy", type: "pattern-next",
    sequence: ["A","B","C","D","?"], prompt: "Next letter?",
    options: ["E","F","G","Z"], answer: 0, timeSec: 18,
    explanation: "Alphabet order → E." },

  // MEDIUM
  { id: "pa-m-1", category: "Pattern", level: "medium", type: "pattern-next",
    sequence: ["2","4","8","16","?"], prompt: "Next number?",
    options: ["18","24","32","20"], answer: 2, timeSec: 25,
    explanation: "Doubling → 32." },
  { id: "pa-m-2", category: "Pattern", level: "medium", type: "pattern-next",
    sequence: ["🔺","🔻","🔺🔺","🔻🔻","?"], prompt: "What's next?",
    options: ["🔺🔺🔺","🔻🔻🔻","🔺","🔻"], answer: 0, timeSec: 25,
    explanation: "Pairs grow by one → triple up." },
  { id: "pa-m-3", category: "Pattern", level: "medium", type: "pattern-missing",
    sequence: ["3","6","?","24","48"], prompt: "What's missing?",
    options: ["9","12","18","15"], answer: 1, timeSec: 25,
    explanation: "Doubling → 12." },
  { id: "pa-m-4", category: "Pattern", level: "medium", type: "pattern-grid",
    grid: ["🟦","🟧","🟦","🟧","?","🟧","🟦","🟧","🟦"],
    prompt: "Which symbol completes the checkerboard?",
    options: ["🟦","🟧","🟪","🟩"], answer: 0, timeSec: 28,
    explanation: "Checkerboard pattern → blue." },
  { id: "pa-m-5", category: "Pattern", level: "medium", type: "pattern-next",
    sequence: ["A","C","E","G","?"], prompt: "Next letter?",
    options: ["H","I","J","K"], answer: 1, timeSec: 25,
    explanation: "Skip one → I." },

  // HARD
  { id: "pa-h-1", category: "Pattern", level: "hard", type: "pattern-next",
    sequence: ["1","1","2","3","5","8","?"], prompt: "Next Fibonacci?",
    options: ["11","12","13","14"], answer: 2, timeSec: 30,
    explanation: "5+8 = 13." },
  { id: "pa-h-2", category: "Pattern", level: "hard", type: "pattern-next",
    sequence: ["2","6","12","20","30","?"], prompt: "Next?",
    options: ["40","42","44","36"], answer: 1, timeSec: 30,
    explanation: "Diffs 4,6,8,10,12 → +12 = 42." },
  { id: "pa-h-3", category: "Pattern", level: "hard", type: "pattern-missing",
    sequence: ["1","4","9","?","25","36"], prompt: "Missing square?",
    options: ["12","16","18","20"], answer: 1, timeSec: 30,
    explanation: "Squares of 1..6 → 4²=16." },
  { id: "pa-h-4", category: "Pattern", level: "hard", type: "pattern-grid",
    grid: ["1","2","3","2","4","6","3","6","?"],
    prompt: "Find the missing number (multiplication grid):",
    options: ["7","8","9","12"], answer: 2, timeSec: 30,
    explanation: "Row × col table → 3×3 = 9." },
  { id: "pa-h-5", category: "Pattern", level: "hard", type: "pattern-next",
    sequence: ["🟦","🟦🟧","🟦🟧🟦","🟦🟧🟦🟧","?"], prompt: "Next term?",
    options: ["🟦🟧🟦🟧🟦","🟧🟦🟧","🟦🟦🟦","🟧🟧🟧"], answer: 0, timeSec: 30,
    explanation: "Alternates blue/orange and grows by one." },
];

export function pickQuestions(category: Category, level: Level, count = 5): Question[] {
  const pool = BANK.filter(q => q.category === category && q.level === level);
  return [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
}

/**
 * Smart non-repeating picker.
 * - Filters out questions the user already saw (by id).
 * - If the unseen pool is too small, top up with the LEAST-recently-seen ones.
 * - Always shuffles, so two users (and two retakes) get different orderings.
 */
export function pickUnseenQuestions(
  category: Category,
  level: Level,
  attemptedIds: string[],
  count = 5,
): Question[] {
  const pool = BANK.filter(q => q.category === category && q.level === level);
  const seen = new Set(attemptedIds);
  const unseen = pool.filter(q => !seen.has(q.id));
  const seenAgain = pool.filter(q => seen.has(q.id));
  const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

  const picked = shuffle(unseen).slice(0, count);
  if (picked.length < count) {
    picked.push(...shuffle(seenAgain).slice(0, count - picked.length));
  }
  return picked;
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

export const nextDifficulty = (pct: number): Level =>
  pct < 40 ? "easy" : pct < 75 ? "medium" : "hard";
