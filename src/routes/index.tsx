import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mascot } from "@/components/Mascot";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, Trophy, Sparkles, Zap, Heart, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartMind AI — Learn, Think, Speak Better with AI" },
      { name: "description", content: "A fun AI-powered learning game for kids in Grades 1–10. Boost reasoning, memory, vocabulary, and confidence." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-aurora">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 glass-strong">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="text-2xl">🧠</span>
          <span className="text-gradient">SmartMind AI</span>
        </Link>
        <nav className="hidden md:flex gap-7 text-sm font-semibold">
          <a href="#features" className="hover:text-primary">Features</a>
          <a href="#how" className="hover:text-primary">How it works</a>
          <a href="#faq" className="hover:text-primary">FAQ</a>
        </nav>
        <div className="flex gap-2">
          <Link to="/auth"><Button variant="ghost">Sign in</Button></Link>
          <Link to="/auth" search={{ mode: "register" } as never}>
            <Button className="rounded-full font-bold shadow-soft">Start Free</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fun/40 text-fun-foreground font-bold text-sm shadow-soft">
            <Sparkles className="h-4 w-4" /> AI tutor for Grades 1–10
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-5 font-display text-5xl md:text-7xl font-bold leading-[1.05]">
            Learn, Think,<br />
            <span className="text-gradient">Speak Better</span><br />
            with AI ✨
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl">
            A playful learning game that boosts your child's reasoning, memory, vocabulary, and confidence — guided by a friendly AI tutor.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-3">
            <Link to="/auth" search={{ mode: "register" } as never}>
              <Button size="lg" className="rounded-full font-bold text-base h-12 px-7 shadow-pop">
                🎮 Start Playing Free
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="rounded-full font-bold text-base h-12 px-7">
                See how it works
              </Button>
            </a>
          </motion.div>
          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {["🦊","🐼","🦁","🐧","🐸"].map((e,i)=> (
                <span key={i} className="size-8 rounded-full bg-card grid place-items-center shadow-soft border-2 border-background">{e}</span>
              ))}
            </div>
            Loved by 10,000+ curious kids
          </div>
        </div>

        <div className="relative grid place-items-center">
          <Mascot size={320} />
          <FloatingChip text="+50 XP!" emoji="⭐" className="top-6 right-2 bg-fun text-fun-foreground" delay={0.3} />
          <FloatingChip text="Level Up!" emoji="🎉" className="bottom-12 left-0 bg-success text-success-foreground" delay={0.7} />
          <FloatingChip text="Perfect!" emoji="💯" className="top-1/2 -right-2 bg-secondary text-secondary-foreground" delay={1.1} />
        </div>
      </div>
    </section>
  );
}

function FloatingChip({ text, emoji, className, delay = 0 }: { text: string; emoji: string; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{ delay, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
      className={`absolute px-4 py-2 rounded-full font-bold text-sm shadow-pop ${className}`}>
      {emoji} {text}
    </motion.div>
  );
}

function Stats() {
  const stats = [
    { v: "10k+", l: "Happy learners" },
    { v: "500+", l: "AI activities" },
    { v: "92%", l: "Improved confidence" },
    { v: "4.9★", l: "Parent rating" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 -mt-6">
      <div className="glass rounded-3xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.l} className="text-center">
            <div className="font-display text-3xl md:text-4xl font-bold text-gradient">{s.v}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Brain, title: "Adaptive Brain Games", desc: "Memory, logic, patterns and problem-solving puzzles that adapt to your child's level.", grad: "gradient-hero" },
    { icon: MessageSquare, title: "AI Speaking Tutor", desc: "A friendly AI that chats, corrects gently, and builds vocabulary and confidence.", grad: "gradient-mint" },
    { icon: Trophy, title: "XP, Streaks & Badges", desc: "Daily streaks, coins, levels and unlockable rewards keep motivation high.", grad: "gradient-coin" },
    { icon: Zap, title: "Instant Feedback", desc: "Every answer comes with a kid-friendly explanation — no shame, just learning.", grad: "gradient-sunset" },
    { icon: Heart, title: "Child-Safe by Design", desc: "Strict content filters, no ads, no DMs. Just safe, joyful learning.", grad: "gradient-sky" },
    { icon: Sparkles, title: "Progress That Glows", desc: "Beautiful charts show strengths, weak areas, and weekly improvement.", grad: "gradient-hero" },
  ];
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-bold">Everything to grow a <span className="text-gradient">smart, curious</span> mind</h2>
        <p className="mt-4 text-muted-foreground text-lg">Designed by educators. Loved by kids. Trusted by parents.</p>
      </div>
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="glass rounded-3xl p-6 hover:shadow-pop transition-all hover:-translate-y-1">
            <div className={`size-12 rounded-2xl ${it.grad} grid place-items-center text-white shadow-soft`}>
              <it.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "1", title: "Pick your grade", desc: "We tune the look, words and challenges to your age.", emoji: "🎒" },
    { n: "2", title: "Play & learn", desc: "Quick games, AI chats, and adaptive puzzles. 10 min/day is plenty.", emoji: "🎮" },
    { n: "3", title: "Watch yourself grow", desc: "Earn XP, build streaks and unlock new badges every week.", emoji: "🚀" },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold">Three simple steps</h2>
      </div>
      <div className="mt-12 grid md:grid-cols-3 gap-5">
        {steps.map((s, i) => (
          <motion.div key={s.n}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="relative glass rounded-3xl p-7 text-center">
            <div className="text-5xl">{s.emoji}</div>
            <div className="mt-4 inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">STEP {s.n}</div>
            <h3 className="mt-3 font-display text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-muted-foreground text-sm">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { name: "Priya, mom of Aarav (8)", text: "Aarav asks for SmartMind every morning before school. His vocabulary has visibly grown.", emoji: "👩" },
    { name: "Marcus, dad of Lila (12)", text: "The AI tutor is patient and kind. Lila is way more confident speaking up in class.", emoji: "👨" },
    { name: "Ms. Chen, Grade 5 teacher", text: "I recommend it to every parent. The adaptive logic is genuinely impressive.", emoji: "👩‍🏫" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="font-display text-4xl md:text-5xl font-bold text-center">Parents & teachers love it</h2>
      <div className="mt-12 grid md:grid-cols-3 gap-5">
        {items.map(t => (
          <div key={t.name} className="glass rounded-3xl p-6">
            <div className="text-4xl">{t.emoji}</div>
            <p className="mt-3 italic">"{t.text}"</p>
            <div className="mt-4 text-sm font-bold text-muted-foreground">— {t.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "Which grades is SmartMind AI for?", a: "Grades 1 through 10 (ages 6–16). The interface, vocabulary, and challenges adapt to your child's grade." },
    { q: "Is it safe for kids?", a: "Yes. The AI is filtered for safe, age-appropriate content. There are no ads, no chats with strangers, and no personal data sharing." },
    { q: "How long should my child play each day?", a: "Just 10–15 minutes a day is enough to see real progress within a few weeks." },
    { q: "Do I need to install anything?", a: "Nope! SmartMind AI runs in your browser on phone, tablet, or computer." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="font-display text-4xl md:text-5xl font-bold text-center">Frequently asked</h2>
      <Accordion type="single" collapsible className="mt-10">
        {items.map((f, i) => (
          <AccordionItem key={i} value={`f${i}`} className="glass rounded-2xl px-6 mb-3 border-0">
            <AccordionTrigger className="font-bold text-left hover:no-underline">
              <span className="flex items-center gap-2"><ChevronDown className="h-4 w-4 text-primary" />{f.q}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-3xl gradient-hero p-10 md:p-16 text-center text-primary-foreground shadow-pop">
        <div className="absolute -top-10 -right-10 text-9xl opacity-20">✨</div>
        <div className="absolute -bottom-10 -left-10 text-9xl opacity-20">🚀</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold">Ready to make learning feel like play?</h2>
        <p className="mt-4 text-lg opacity-90">Free to start. No credit card. Instant access.</p>
        <Link to="/auth" search={{ mode: "register" } as never}>
          <Button size="lg" className="mt-8 rounded-full font-bold h-14 px-10 text-base bg-background text-foreground hover:bg-background/90 shadow-pop">
            🎮 Create my free account
          </Button>
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
      <div className="flex items-center justify-center gap-2 font-bold mb-2">
        <span className="text-xl">🧠</span> SmartMind AI
      </div>
      <p>© {new Date().getFullYear()} SmartMind AI — Learn, Think, Speak Better.</p>
    </footer>
  );
}
