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
const BASE_BANK: Question[] = [
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

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const unique = <T,>(items: T[]): T[] => Array.from(new Set(items));

function buildOptions(answer: string, distractors: string[]): { options: string[]; answer: number } {
  return { options: unique([answer, ...distractors]).slice(0, 4), answer: 0 };
}

function rotate<T>(items: T[], offset: number): T[] {
  return items.map((_, i) => items[(i + offset) % items.length]);
}

const MEMORY_OBJECT_THEMES: Record<Level, string[][]> = {
  easy: [
    ["🍎","🍌","🍇","🍉","🍒"],
    ["🐶","🐱","🐰","🦊","🐼"],
    ["🚗","🚲","🚌","🚂","✈️"],
    ["⭐","🌙","☀️","☁️","🌈"],
    ["⚽","🏀","🎾","🏈","🏐"],
    ["📚","✏️","🖍️","📏","✂️"],
  ],
  medium: [
    ["🍕","🥪","🌮","🍜","🍣","🍰"],
    ["🦁","🐯","🐻","🐼","🦓","🦒"],
    ["🚁","🚢","🚄","🚙","🛴","🚜"],
    ["🟥","🟦","🟩","🟨","🟪","🟧"],
    ["🎻","🥁","🎺","🎹","🎸","🪘"],
    ["🔺","🔵","⭐","🟩","❤️","🔶"],
  ],
  hard: [
    ["🧪","🔬","🧲","⚗️","🧬","📡","🛰️"],
    ["♠","♥","♣","♦","★","✦","✿"],
    ["α","β","γ","δ","ε","ζ","η"],
    ["🦒","🐙","🦜","🐝","🦋","🐢","🦈"],
    ["12","27","34","48","53","69","71"],
    ["⚡","🔥","💧","🌪️","🌍","🌙","☄️"],
  ],
};

const MEMORY_SEQUENCE_SPECS: Record<Level, { items: string[]; extras: string[] }[]> = {
  easy: [
    { items: ["3", "7", "1", "9"], extras: ["2", "5", "8"] },
    { items: ["A", "D", "B", "C"], extras: ["E", "F", "G"] },
    { items: ["🔴", "🟢", "🔵", "🟡"], extras: ["🟣", "🟠", "⚫"] },
    { items: ["🐱", "🐶", "🐭", "🐹"], extras: ["🐰", "🦊", "🐻"] },
  ],
  medium: [
    { items: ["8", "2", "5", "9", "1"], extras: ["3", "4", "6"] },
    { items: ["K", "P", "T", "F", "R"], extras: ["L", "M", "S"] },
    { items: ["🍎", "🍪", "🧃", "🍓", "🥪"], extras: ["🍇", "🍕", "🧁"] },
    { items: ["🟥", "🟦", "🟨", "🟩", "🟪"], extras: ["🟧", "⬛", "⬜"] },
  ],
  hard: [
    { items: ["7", "4", "9", "2", "6", "3", "8"], extras: ["1", "5", "0"] },
    { items: ["Q", "L", "Z", "M", "R", "T", "B"], extras: ["C", "D", "X"] },
    { items: ["♠", "♥", "♣", "♦", "★", "✦", "✿"], extras: ["☾", "☀️", "◆"] },
    { items: ["12", "47", "85", "23", "61", "39", "74"], extras: ["16", "52", "91"] },
  ],
};

const MEMORY_PAIR_SETS: Record<Level, string[][]> = {
  easy: [
    ["🍓", "🍌", "🍇"],
    ["🐶", "🐱", "🐰"],
    ["⚽", "🏀", "🎾"],
    ["⭐", "🌙", "☀️"],
  ],
  medium: [
    ["🐶", "🐱", "🐰", "🦊"],
    ["🍕", "🍔", "🌮", "🍣"],
    ["🔺", "🔵", "⭐", "❤️"],
    ["🎸", "🎹", "🥁", "🎺"],
  ],
  hard: [
    ["🌟", "🌙", "☀️", "⚡", "🔥", "💧"],
    ["♠", "♥", "♣", "♦", "★", "✦"],
    ["🧪", "🔬", "🧲", "⚗️", "🧬", "📡"],
    ["🦒", "🐙", "🦜", "🐝", "🦋", "🐢"],
  ],
};

const MEMORY_SHOW_COUNT: Record<Level, number> = { easy: 4, medium: 5, hard: 6 };
const MEMORY_MEMORIZE_SEC: Record<Level, number> = { easy: 4, medium: 6, hard: 8 };
const MEMORY_PAIR_MISMATCH: Record<Level, number> = { easy: 4, medium: 6, hard: 9 };

function buildMemoryQuestions(level: Level): Question[] {
  const questions: Question[] = [];
  const showCount = MEMORY_SHOW_COUNT[level];

  MEMORY_OBJECT_THEMES[level].forEach((theme, idx) => {
    const memorize = theme.slice(0, showCount);
    const hidden = theme[showCount];
    const missPack = buildOptions(hidden, rotate(memorize, idx).slice(0, 3));
    questions.push({
      id: `gm-${level}-miss-${idx}`,
      category: "Memory",
      level,
      type: "memory-objects",
      memorize,
      memorizeSec: MEMORY_MEMORIZE_SEC[level],
      prompt: "Which item was NOT shown?",
      explanation: `${hidden} was not in the memory set.`,
      ...missPack,
    });

    const countAnswer = String(memorize.length);
    const countPack = buildOptions(countAnswer, ["2", "3", "4", "5", "6", "7"].filter((n) => n !== countAnswer));
    questions.push({
      id: `gm-${level}-count-${idx}`,
      category: "Memory",
      level,
      type: "memory-objects",
      memorize,
      memorizeSec: MEMORY_MEMORIZE_SEC[level],
      prompt: "How many items did you see?",
      explanation: `${memorize.length} items were shown.`,
      ...countPack,
    });

    const shown = memorize[idx % memorize.length];
    const shownPack = buildOptions(shown, unique([hidden, ...rotate(memorize.filter((item) => item !== shown), idx)]).slice(0, 3));
    questions.push({
      id: `gm-${level}-shown-${idx}`,
      category: "Memory",
      level,
      type: "memory-objects",
      memorize,
      memorizeSec: MEMORY_MEMORIZE_SEC[level],
      prompt: "Which item WAS shown?",
      explanation: `${shown} was part of the memory set.`,
      ...shownPack,
    });
  });

  MEMORY_SEQUENCE_SPECS[level].forEach((spec, idx) => {
    const firstPos = idx % spec.items.length;
    const firstAnswer = spec.items[firstPos];
    const firstPack = buildOptions(firstAnswer, unique([...spec.items.filter((_, i) => i !== firstPos), ...spec.extras]).slice(0, 3));
    questions.push({
      id: `gm-${level}-seq-${idx}`,
      category: "Memory",
      level,
      type: "memory-sequence",
      memorize: spec.items,
      memorizeSec: MEMORY_MEMORIZE_SEC[level],
      prompt: `What was in position ${firstPos + 1}?`,
      explanation: `Position ${firstPos + 1} contained ${firstAnswer}.`,
      ...firstPack,
    });

    const secondPos = spec.items.length - 1 - (idx % spec.items.length);
    const secondAnswer = spec.items[secondPos];
    const secondPack = buildOptions(secondAnswer, unique([...spec.items.filter((_, i) => i !== secondPos), ...spec.extras]).slice(0, 3));
    questions.push({
      id: `gm-${level}-pos-${idx}`,
      category: "Memory",
      level,
      type: "memory-position",
      memorize: spec.items,
      memorizeSec: MEMORY_MEMORIZE_SEC[level],
      prompt: secondPos === spec.items.length - 1 ? "Which item was LAST?" : `Which item was in spot ${secondPos + 1}?`,
      explanation: `${secondAnswer} was in that position.`,
      ...secondPack,
    });
  });

  MEMORY_PAIR_SETS[level].forEach((pairs, idx) => {
    questions.push({
      id: `gm-${level}-pairs-${idx}`,
      category: "Memory",
      level,
      type: "memory-pairs",
      memorizeSec: Math.max(4, MEMORY_MEMORIZE_SEC[level] - 1),
      pairs,
      prompt: level === "easy" ? "Match all the hidden pairs." : level === "medium" ? "Clear the memory board without too many misses." : "Track every pair and finish the full memory board.",
      maxMismatches: MEMORY_PAIR_MISMATCH[level],
      options: ["done"],
      answer: 0,
      explanation: "Pair matching strengthens short-term visual memory.",
    });
  });

  return questions;
}

const LOGIC_COMPARISON_GROUPS: Record<Level, string[][]> = {
  easy: [
    ["Tom", "Mia", "Leo", "Ava"],
    ["Noah", "Lily", "Omar", "Zoe"],
    ["Aria", "Ben", "Cole", "Dia"],
    ["Ivy", "Jude", "Kai", "Nina"],
    ["Ria", "Sean", "Tara", "Uma"],
    ["Alex", "Bella", "Chris", "Dina"],
    ["Eli", "Faye", "Gio", "Hana"],
    ["Ivan", "Jia", "Kian", "Lena"],
  ],
  medium: [
    ["Mason", "Priya", "Quinn", "Rosa"],
    ["Soren", "Talia", "Uma", "Vik"],
    ["Wren", "Xena", "Yuri", "Zara"],
    ["Aiden", "Bianca", "Cyrus", "Delia"],
    ["Eshan", "Farah", "Gavin", "Hazel"],
    ["Ines", "Jon", "Keira", "Luca"],
    ["Mina", "Niko", "Opal", "Pavel"],
    ["Ruben", "Sara", "Theo", "Vera"],
  ],
  hard: [
    ["Asha", "Bram", "Cleo", "Daren"],
    ["Elin", "Faris", "Greta", "Hugo"],
    ["Isla", "Joren", "Kira", "Lior"],
    ["Marek", "Nyla", "Orin", "Petra"],
    ["Rayan", "Sia", "Tobin", "Uri"],
    ["Veda", "Walt", "Xavi", "Yana"],
    ["Zane", "Anika", "Boris", "Celine"],
    ["Damon", "Esme", "Felix", "Gaia"],
  ],
};

const LOGIC_DIRECTION_SPECS: Record<Level, { name: string; start: string; turns: ("L" | "R" | "U")[] }[]> = {
  easy: [
    { name: "Lia", start: "North", turns: ["R"] },
    { name: "Ben", start: "East", turns: ["L"] },
    { name: "Maya", start: "North", turns: ["R", "U"] },
    { name: "Rex", start: "South", turns: ["L", "L"] },
    { name: "Ivy", start: "West", turns: ["R", "R"] },
    { name: "Omar", start: "North", turns: ["L", "R"] },
    { name: "Nia", start: "East", turns: ["U"] },
    { name: "Kai", start: "South", turns: ["R"] },
  ],
  medium: [
    { name: "Anya", start: "North", turns: ["R", "R", "L"] },
    { name: "Deo", start: "West", turns: ["L", "U"] },
    { name: "Faye", start: "South", turns: ["R", "L", "L"] },
    { name: "Jai", start: "East", turns: ["R", "U", "L"] },
    { name: "Kira", start: "North", turns: ["L", "L", "R"] },
    { name: "Milo", start: "West", turns: ["R", "R", "U"] },
    { name: "Pia", start: "South", turns: ["U", "L"] },
    { name: "Tao", start: "East", turns: ["L", "L", "R"] },
  ],
  hard: [
    { name: "Ari", start: "North", turns: ["R", "U", "L", "R"] },
    { name: "Cleo", start: "West", turns: ["L", "R", "U", "L"] },
    { name: "Eshan", start: "South", turns: ["R", "R", "L", "U"] },
    { name: "Hana", start: "East", turns: ["U", "L", "R", "R"] },
    { name: "Ilan", start: "North", turns: ["L", "U", "L", "R"] },
    { name: "Mira", start: "West", turns: ["R", "L", "L", "U"] },
    { name: "Niko", start: "South", turns: ["U", "R", "L", "L"] },
    { name: "Zuri", start: "East", turns: ["L", "U", "R", "U"] },
  ],
};

const LOGIC_ORDER_SETS: Record<Level, { prompt: string; correctOrder: string[] }[]> = {
  easy: [
    { prompt: "Arrange from SMALLEST to LARGEST:", correctOrder: ["🐜", "🐭", "🐱", "🐘"] },
    { prompt: "Put the weekdays in order (start Monday):", correctOrder: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
    { prompt: "Arrange the numbers from lowest to highest:", correctOrder: ["2", "5", "7", "9"] },
    { prompt: "Order the seasons from start of the year:", correctOrder: ["Spring", "Summer", "Autumn", "Winter"] },
    { prompt: "Arrange from shortest to tallest:", correctOrder: ["pencil", "ruler", "umbrella", "ladder"] },
    { prompt: "Order by number of sides:", correctOrder: ["Triangle", "Square", "Pentagon", "Hexagon"] },
    { prompt: "Arrange from lightest to heaviest:", correctOrder: ["feather", "book", "chair", "car"] },
    { prompt: "Order these ages from youngest to oldest:", correctOrder: ["6", "8", "10", "12"] },
  ],
  medium: [
    { prompt: "Arrange the decimals from smallest to largest:", correctOrder: ["0.4", "0.9", "1.2", "1.8"] },
    { prompt: "Order the planets from the Sun:", correctOrder: ["Mercury", "Venus", "Earth", "Mars"] },
    { prompt: "Sort the fractions from smallest to largest:", correctOrder: ["1/4", "1/3", "1/2", "3/4"] },
    { prompt: "Arrange from coldest to warmest:", correctOrder: ["-5°C", "0°C", "8°C", "14°C"] },
    { prompt: "Order these times from earliest to latest:", correctOrder: ["7:15", "8:00", "8:45", "9:30"] },
    { prompt: "Arrange the weights from lightest to heaviest:", correctOrder: ["450 g", "900 g", "1.5 kg", "2 kg"] },
    { prompt: "Order the steps of plant growth:", correctOrder: ["seed", "sprout", "stem", "flower"] },
    { prompt: "Arrange the values from smallest to largest:", correctOrder: ["15", "21", "28", "34"] },
  ],
  hard: [
    { prompt: "Arrange from SMALLEST to LARGEST:", correctOrder: ["121", "144", "150", "169"] },
    { prompt: "Order the fractions from smallest to largest:", correctOrder: ["3/8", "2/5", "5/12", "1/2"] },
    { prompt: "Arrange the scientific values from smallest to largest:", correctOrder: ["3×10²", "9×10²", "1×10³", "2×10³"] },
    { prompt: "Order the events of a chemical reaction:", correctOrder: ["Reactants meet", "Bonds break", "Products form", "Energy released"] },
    { prompt: "Arrange the decimals from smallest to largest:", correctOrder: ["2.05", "2.5", "2.75", "3.1"] },
    { prompt: "Sort the algebraic values for x=3 from lowest to highest:", correctOrder: ["x", "x+2", "2x", "3x"] },
    { prompt: "Order the powers from smallest to largest:", correctOrder: ["2²", "2³", "3²", "2⁴"] },
    { prompt: "Arrange the distances from shortest to longest:", correctOrder: ["0.8 km", "1.2 km", "1.8 km", "2.4 km"] },
  ],
};

function directionAfter(start: string, turns: ("L" | "R" | "U")[]): string {
  const dirs = ["North", "East", "South", "West"];
  let idx = dirs.indexOf(start);
  for (const turn of turns) {
    if (turn === "R") idx = (idx + 1) % 4;
    if (turn === "L") idx = (idx + 3) % 4;
    if (turn === "U") idx = (idx + 2) % 4;
  }
  return dirs[idx];
}

function describeTurns(turns: ("L" | "R" | "U")[]): string {
  return turns
    .map((turn) => (turn === "R" ? "turns right" : turn === "L" ? "turns left" : "turns around"))
    .join(", then ");
}

function buildLogicQuestions(level: Level): Question[] {
  const questions: Question[] = [];

  LOGIC_COMPARISON_GROUPS[level].forEach((group, idx) => {
    const askTop = idx % 2 === 0;
    const answerName = askTop ? group[0] : group[group.length - 1];
    const pack = buildOptions(answerName, group.filter((name) => name !== answerName));
    questions.push({
      id: `gl-${level}-cmp-${idx}`,
      category: "Logic",
      level,
      type: "mcq",
      prompt: `${group.join(" > ")}. Who is ${askTop ? "greatest" : "smallest"}?`,
      explanation: `${group.join(" > ")} means ${answerName} is ${askTop ? "at the top" : "at the bottom"} of the order.`,
      ...pack,
    });
  });

  LOGIC_DIRECTION_SPECS[level].forEach((spec, idx) => {
    const answerDir = directionAfter(spec.start, spec.turns);
    const pack = buildOptions(answerDir, ["North", "East", "South", "West"].filter((dir) => dir !== answerDir));
    questions.push({
      id: `gl-${level}-dir-${idx}`,
      category: "Logic",
      level,
      type: "mcq",
      prompt: `${spec.name} faces ${spec.start}, ${describeTurns(spec.turns)}. Which direction is ${spec.name} facing now?`,
      explanation: `${spec.name} ends facing ${answerDir}.`,
      ...pack,
    });
  });

  LOGIC_ORDER_SETS[level].forEach((set, idx) => {
    questions.push({
      id: `gl-${level}-order-${idx}`,
      category: "Logic",
      level,
      type: "logic-order",
      prompt: set.prompt,
      items: rotate(set.correctOrder, idx % set.correctOrder.length),
      correctOrder: set.correctOrder,
      options: ["correct"],
      answer: 0,
      explanation: `${set.correctOrder.join(" → ")} is the correct order.`,
    });
  });

  return questions;
}

const PATTERN_TIME: Record<Level, number> = { easy: 20, medium: 25, hard: 30 };

function buildPatternQuestions(level: Level): Question[] {
  const questions: Question[] = [];
  const numericStart = level === "easy" ? [2, 5, 10, 1, 7, 12, 3, 9] : level === "medium" ? [3, 6, 11, 14, 5, 9, 12, 18] : [5, 8, 13, 21, 34, 7, 15, 24];
  const numericStep = level === "easy" ? [2, 3, 5, 4, 2, 3, 4, 5] : level === "medium" ? [3, 4, 5, 6, 7, 3, 4, 5] : [4, 6, 7, 8, 9, 5, 6, 7];

  numericStart.forEach((start, idx) => {
    const step = numericStep[idx];
    const sequence = Array.from({ length: 4 }, (_, i) => String(start + i * step));
    const answerVal = String(start + 4 * step);
    const pack = buildOptions(answerVal, [String(start + 3 * step), String(start + 5 * step), String(start + 4 * step + (idx % 3) + 1)]);
    questions.push({
      id: `gp-${level}-next-${idx}`,
      category: "Pattern",
      level,
      type: "pattern-next",
      sequence: [...sequence, "?"],
      prompt: idx % 2 === 0 ? "What comes next?" : "Find the next number in the pattern.",
      explanation: `The pattern increases by ${step} each step.`,
      timeSec: PATTERN_TIME[level],
      ...pack,
    });
  });

  numericStart.forEach((start, idx) => {
    const step = numericStep[idx];
    const full = Array.from({ length: 5 }, (_, i) => String(start + i * step));
    const missIndex = 1 + (idx % 3);
    const answerVal = full[missIndex];
    const pack = buildOptions(answerVal, [String(Number(answerVal) - step), String(Number(answerVal) + step), String(Number(answerVal) + step + 1)]);
    questions.push({
      id: `gp-${level}-missing-${idx}`,
      category: "Pattern",
      level,
      type: "pattern-missing",
      sequence: full.map((item, i) => (i == missIndex ? "?" : item)),
      prompt: "Which value is missing?",
      explanation: `Keep adding ${step} to continue the pattern.`,
      timeSec: PATTERN_TIME[level],
      ...pack,
    });
  });

  const checkerPairs = level === "easy"
    ? [["🔴", "🔵"], ["⭐", "🌙"], ["🟩", "🟨"]]
    : level === "medium"
      ? [["🟦", "🟧"], ["🔺", "🔻"], ["⬛", "⬜"]]
      : [["◆", "◇"], ["▲", "▼"], ["♠", "♣"]];

  checkerPairs.forEach(([a, b], idx) => {
    const answerVal = idx % 2 === 0 ? b : a;
    const grid = [a, b, a, b, a, b, a, "?", a];
    const pack = buildOptions(answerVal, unique([a, b, "★", "○"]).filter((item) => item !== answerVal).slice(0, 3));
    questions.push({
      id: `gp-${level}-grid-check-${idx}`,
      category: "Pattern",
      level,
      type: "pattern-grid",
      grid,
      prompt: "Which symbol completes the checkerboard?",
      explanation: "The pattern alternates every cell.",
      timeSec: PATTERN_TIME[level] + 3,
      ...pack,
    });
  });

  const mathTriples = level === "easy"
    ? [[1, 2, 3], [2, 3, 5], [3, 1, 4]]
    : level === "medium"
      ? [[2, 4, 6], [3, 5, 8], [4, 6, 10]]
      : [[2, 3, 6], [3, 4, 12], [4, 5, 20]];

  mathTriples.forEach((triple, idx) => {
    const [a, b, c] = triple;
    const answerVal = level === "hard" ? String(a * b) : String(a + b);
    const last = level === "hard" ? String((a + 1) * (b + 1)) : String((a + 1) + (b + 1));
    const grid = level === "hard"
      ? [String(a), String(b), String(a * b), String(a + 1), String(b + 1), last, String(a + 2), String(b + 2), "?"]
      : [String(a), String(b), String(a + b), String(b), String(c), String(b + c), String(c), String(c + 1), "?"];
    const answer = level === "hard" ? String((a + 2) * (b + 2)) : String(c + (c + 1));
    const pack = buildOptions(answer, [String(Number(answer) - 1), String(Number(answer) + 1), String(Number(answer) + 2)]);
    questions.push({
      id: `gp-${level}-grid-math-${idx}`,
      category: "Pattern",
      level,
      type: "pattern-grid",
      grid,
      prompt: level === "hard" ? "Find the missing result in the multiplication grid:" : "Find the missing total in the number grid:",
      explanation: level === "hard" ? "Each row multiplies the first two values." : "The third cell in each row is the sum of the first two.",
      timeSec: PATTERN_TIME[level] + 5,
      ...pack,
    });
  });

  return questions;
}

const PROBLEM_TIMELESS_OPTIONS = (correct: number, deltas: number[]) => buildOptions(String(correct), deltas.map((delta) => String(correct + delta)));

function buildProblemQuestions(level: Level): Question[] {
  const questions: Question[] = [];

  if (level === "easy") {
    const sharing = [[6, 3], [8, 4], [10, 5], [12, 4]];
    sharing.forEach(([total, people], idx) => {
      const answer = total / people;
      questions.push({
        id: `gpr-${level}-share-${idx}`,
        category: "Problem",
        level,
        type: "problem-scenario",
        emoji: "🍬",
        scenario: `There are ${total} candies shared equally among ${people} children.`,
        prompt: "How many candies does each child get?",
        explanation: `${total} ÷ ${people} = ${answer}.`,
        ...PROBLEM_TIMELESS_OPTIONS(answer, [-1, 1, 2]),
      });
    });

    const reading = [[5, 7], [6, 5], [4, 8], [7, 6]];
    reading.forEach(([perDay, days], idx) => {
      const answer = perDay * days;
      questions.push({
        id: `gpr-${level}-read-${idx}`,
        category: "Problem",
        level,
        type: "problem-scenario",
        emoji: "📚",
        scenario: `A student reads ${perDay} pages each day for ${days} days.`,
        prompt: "How many pages are read in total?",
        explanation: `${perDay} × ${days} = ${answer}.`,
        ...PROBLEM_TIMELESS_OPTIONS(answer, [-perDay, perDay, days]),
      });
    });

    const coinSets = [[4, 3, 2, 1], [5, 2, 2, 1], [3, 4, 3, 1], [6, 1, 2, 1]];
    coinSets.forEach(([aCount, bCount, aValue, bValue], idx) => {
      const answer = aCount * aValue + bCount * bValue;
      questions.push({
        id: `gpr-${level}-coins-${idx}`,
        category: "Problem",
        level,
        type: "problem-scenario",
        emoji: "🪙",
        scenario: `A piggy bank has ${aCount} coins of $${aValue} and ${bCount} coins of $${bValue}.`,
        prompt: "How much money is inside?",
        explanation: `${aCount}×${aValue} + ${bCount}×${bValue} = ${answer}.`,
        options: [`$${answer}`, `$${answer + 1}`, `$${answer + 2}`, `$${Math.max(1, answer - 1)}`],
        answer: 0,
      });
    });

    const expressions = [
      [5, 3, 2], [7, 2, 3], [9, 4, 2], [6, 5, 2], [8, 2, 4], [10, 3, 2],
      [4, 6, 2], [3, 7, 2], [12, 2, 3], [11, 4, 2], [14, 3, 2], [9, 5, 2],
    ];
    expressions.forEach(([a, b, c], idx) => {
      const answer = a + b * c;
      questions.push({
        id: `gpr-${level}-expr-${idx}`,
        category: "Problem",
        level,
        type: "mcq",
        prompt: `${a} + ${b} × ${c} = ?`,
        explanation: `Multiply first: ${b}×${c} = ${b * c}, then add ${a}.`,
        ...PROBLEM_TIMELESS_OPTIONS(answer, [-2, 2, c]),
      });
    });
  }

  if (level === "medium") {
    const rates = [[60, 45], [72, 60], [90, 75], [48, 30]];
    rates.forEach(([distance, minutes], idx) => {
      const answer = Math.round(distance / (minutes / 60));
      questions.push({
        id: `gpr-${level}-rate-${idx}`,
        category: "Problem",
        level,
        type: "problem-scenario",
        emoji: "🚆",
        scenario: `A train travels ${distance} km in ${minutes} minutes at a constant speed.`,
        prompt: "What is the speed in km/h?",
        explanation: `${distance} ÷ ${minutes / 60} = ${answer} km/h.`,
        ...PROBLEM_TIMELESS_OPTIONS(answer, [-10, 10, 15]),
      });
    });

    const stickerSets = [[24, 3, 5], [30, 5, 4], [36, 4, 6], [27, 3, 8]];
    stickerSets.forEach(([total, divisor, add], idx) => {
      const answer = total - total / divisor + add;
      questions.push({
        id: `gpr-${level}-stickers-${idx}`,
        category: "Problem",
        level,
        type: "problem-scenario",
        emoji: "🌟",
        scenario: `A student has ${total} stickers, gives 1/${divisor} away, then buys ${add} more.`,
        prompt: "How many stickers are left now?",
        explanation: `${total} - ${total / divisor} + ${add} = ${answer}.`,
        ...PROBLEM_TIMELESS_OPTIONS(answer, [-3, 3, divisor]),
      });
    });

    const fills = [[3000, 200], [2400, 150], [3600, 300], [2800, 175]];
    fills.forEach(([total, rate], idx) => {
      const answer = total / rate;
      questions.push({
        id: `gpr-${level}-fill-${idx}`,
        category: "Problem",
        level,
        type: "problem-scenario",
        emoji: "🏊",
        scenario: `A tank holds ${total} L and fills at ${rate} L each minute.`,
        prompt: "How many minutes until it is full?",
        explanation: `${total} ÷ ${rate} = ${answer}.`,
        ...PROBLEM_TIMELESS_OPTIONS(answer, [-2, 2, 5]),
      });
    });

    const equations = [
      [8, 4, 2, 3], [10, 6, 4, 2], [12, 3, 5, 2], [14, 8, 2, 3], [9, 7, 3, 2], [16, 4, 6, 2],
      [18, 6, 3, 2], [20, 5, 4, 3], [11, 9, 2, 2], [15, 3, 7, 2], [13, 5, 2, 4], [17, 7, 3, 2],
    ];
    equations.forEach(([a, b, c, d], idx) => {
      const answer = (a + b) / d + c;
      questions.push({
        id: `gpr-${level}-expr-${idx}`,
        category: "Problem",
        level,
        type: "mcq",
        prompt: `(${a} + ${b}) ÷ ${d} + ${c} = ?`,
        explanation: `Add first, divide, then add ${c}.`,
        ...PROBLEM_TIMELESS_OPTIONS(answer, [-2, 2, d]),
      });
    });
  }

  if (level === "hard") {
    const discounts = [[80, 20], [120, 25], [150, 40], [96, 20]];
    discounts.forEach(([sale, pct], idx) => {
      const answer = Math.round(sale / (1 - pct / 100));
      questions.push({
        id: `gpr-${level}-discount-${idx}`,
        category: "Problem",
        level,
        type: "problem-scenario",
        emoji: "👕",
        scenario: `An item sells for $${sale} after a ${pct}% discount.`,
        prompt: "What was the original price?",
        explanation: `${sale} ÷ ${1 - pct / 100} = ${answer}.`,
        options: [`$${answer}`, `$${answer + 10}`, `$${Math.max(1, answer - 10)}`, `$${answer + 20}`],
        answer: 0,
      });
    });

    const closing = [[300, 50, 70], [240, 40, 80], [360, 60, 60], [420, 70, 50]];
    closing.forEach(([distance, a, b], idx) => {
      const answer = Number((distance / (a + b)).toFixed(1));
      questions.push({
        id: `gpr-${level}-closing-${idx}`,
        category: "Problem",
        level,
        type: "problem-scenario",
        emoji: "🚗",
        scenario: `Two cars start ${distance} km apart and drive toward each other at ${a} and ${b} km/h.`,
        prompt: "After how many hours do they meet?",
        explanation: `${distance} ÷ (${a}+${b}) = ${answer} hours.`,
        ...buildOptions(String(answer), [String((answer + 0.5).toFixed(1)), String((answer + 1).toFixed(1)), String(Math.max(0.5, answer - 0.5).toFixed(1))]),
      });
    });

    const overtime = [[15, 40, 6], [18, 38, 5], [20, 42, 4], [16, 40, 8]];
    overtime.forEach(([rate, normal, extra], idx) => {
      const answer = rate * normal + rate * 1.5 * extra;
      questions.push({
        id: `gpr-${level}-pay-${idx}`,
        category: "Problem",
        level,
        type: "problem-scenario",
        emoji: "💼",
        scenario: `A worker earns $${rate}/h normally and 1.5× for overtime. She works ${normal} normal hours and ${extra} overtime hours.`,
        prompt: "What is the total weekly pay?",
        explanation: `${normal}×${rate} + ${extra}×${rate * 1.5} = $${answer}.`,
        options: [`$${answer}`, `$${answer + 30}`, `$${answer + 45}`, `$${answer - 30}`],
        answer: 0,
      });
    });

    const equations = [
      [2, 7, 3, 5], [3, 4, 5, 10], [4, 9, 6, 15], [5, 6, 7, 14], [6, 8, 9, 17], [7, 5, 8, 12],
      [8, 3, 10, 15], [9, 12, 11, 18], [4, 11, 5, 16], [3, 9, 4, 13], [2, 5, 4, 11], [6, 7, 8, 19],
    ];
    equations.forEach(([a, b, c, d], idx) => {
      const answer = d + b;
      questions.push({
        id: `gpr-${level}-alg-${idx}`,
        category: "Problem",
        level,
        type: "mcq",
        prompt: `Solve: ${a}x + ${b} = ${a + 1}x - ${d}`,
        explanation: `Move ${a}x to the right and ${d} to the left, giving x = ${answer}.`,
        ...PROBLEM_TIMELESS_OPTIONS(answer, [-2, 2, c]),
      });
    });
  }

  return questions;
}

const GENERATED_BANK: Question[] = [
  ...(["easy", "medium", "hard"] as Level[]).flatMap((level) => buildMemoryQuestions(level)),
  ...(["easy", "medium", "hard"] as Level[]).flatMap((level) => buildLogicQuestions(level)),
  ...(["easy", "medium", "hard"] as Level[]).flatMap((level) => buildPatternQuestions(level)),
  ...(["easy", "medium", "hard"] as Level[]).flatMap((level) => buildProblemQuestions(level)),
];

export const BANK: Question[] = [...BASE_BANK, ...GENERATED_BANK];

function randomizeQuestion(question: Question): Question {
  if (question.type === "logic-order" || question.type === "memory-pairs") {
    return { ...question };
  }

  if (!("options" in question) || question.options.length <= 1) {
    return { ...question };
  }

  const mixed = shuffle(question.options.map((option, index) => ({ option, correct: index === question.answer })));
  return {
    ...question,
    options: mixed.map((item) => item.option),
    answer: mixed.findIndex((item) => item.correct),
  } as Question;
}

export type QuestionHistoryEntry = {
  question_id: string;
  created_at?: string | null;
};

export function pickQuestions(category: Category, level: Level, count = 5): Question[] {
  const pool = BANK.filter((q) => q.category === category && q.level === level);
  return shuffle(pool).slice(0, Math.min(count, pool.length)).map(randomizeQuestion);
}

/**
 * Smart non-repeating picker.
 * - Prioritizes unseen questions first.
 * - Avoids recently seen questions whenever possible.
 * - Falls back to the least-played / least-recent questions only when needed.
 * - Randomizes option order on every test start.
 */
export function pickUnseenQuestions(
  category: Category,
  level: Level,
  history: QuestionHistoryEntry[],
  count = 5,
): Question[] {
  const pool = BANK.filter((q) => q.category === category && q.level === level);
  const orderedHistory = [...history].sort(
    (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime(),
  );

  const recentIds = unique(orderedHistory.map((entry) => entry.question_id)).slice(0, 10);
  const recentSet = new Set(recentIds);

  const stats = new Map<string, { count: number; lastSeen: number }>();
  orderedHistory.forEach((entry) => {
    const lastSeen = new Date(entry.created_at ?? 0).getTime();
    const current = stats.get(entry.question_id);
    if (!current) {
      stats.set(entry.question_id, { count: 1, lastSeen });
      return;
    }
    stats.set(entry.question_id, {
      count: current.count + 1,
      lastSeen: Math.max(current.lastSeen, lastSeen),
    });
  });

  const unseen = pool.filter((question) => !stats.has(question.id));
  const seenNotRecent = pool
    .filter((question) => stats.has(question.id) && !recentSet.has(question.id))
    .sort((a, b) => {
      const sa = stats.get(a.id)!;
      const sb = stats.get(b.id)!;
      if (sa.count !== sb.count) return sa.count - sb.count;
      return sa.lastSeen - sb.lastSeen;
    });
  const recent = pool
    .filter((question) => recentSet.has(question.id))
    .sort((a, b) => (stats.get(a.id)?.lastSeen ?? 0) - (stats.get(b.id)?.lastSeen ?? 0));

  const picked: Question[] = [];
  const appendUnique = (items: Question[]) => {
    for (const item of items) {
      if (picked.some((existing) => existing.id === item.id)) continue;
      picked.push(item);
      if (picked.length === count) break;
    }
  };

  appendUnique(shuffle(unseen));
  if (picked.length < count) appendUnique(shuffle(seenNotRecent));
  if (picked.length < count) appendUnique(shuffle(recent));

  return shuffle(picked).slice(0, count).map(randomizeQuestion);
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
