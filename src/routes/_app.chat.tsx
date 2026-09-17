import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, Volume2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/chat")({
  head: () => ({ meta: [{ title: "AI Tutor — SmartMind AI" }] }),
  component: Chat,
});

type Msg = { role: "user" | "assistant"; content: string };

function stripScores(content: string): { clean: string; scores: { grammar?: number; vocab?: number; fluency?: number } } {
  const m = content.match(/\[SCORE\s+grammar=(\d+)\s+vocab=(\d+)\s+fluency=(\d+)\]/i);
  if (!m) return { clean: content, scores: {} };
  return {
    clean: content.replace(m[0], "").trim(),
    scores: { grammar: +m[1], vocab: +m[2], fluency: +m[3] },
  };
}

function Chat() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Greeting
  useEffect(() => {
    if (messages.length === 0 && profile) {
      setMessages([{
        role: "assistant",
        content: `Hi ${profile.display_name}! 👋 I'm your SmartMind tutor. Want to play a word game, practice speaking, or work on a tricky question? You pick!`,
      }]);
    }
  }, [profile, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; u.pitch = 1.1;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }

  function startListening() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error("Voice input not supported in this browser"); return; }
    const r = new SR();
    r.lang = "en-US"; r.interimResults = true; r.continuous = false;
    r.onresult = (e: { results: { 0: { transcript: string } }[] }) => {
      const text = Array.from(e.results).map((r) => r[0].transcript).join("");
      setInput(text);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recognitionRef.current = r;
    r.start(); setListening(true);
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setBusy(true);
    setMessages(m => [...m, { role: "assistant", content: "" }]);

    try {
      if (user) {
        await supabase.from("chat_messages").insert({ user_id: user.id, role: "user", content: text });
      }
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`;
      const token = session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: next, grade: profile?.grade ?? 5 }),
      });
      if (!resp.ok || !resp.body) {
        let msg = "Couldn't reach AI tutor.";
        try { const j = await resp.json(); if (j?.error) msg = j.error; } catch { /* ignore */ }
        if (resp.status === 429) toast.error(msg || "Slow down a bit — too many messages!");
        else if (resp.status === 402) toast.error("AI credits exhausted. Add funds in Workspace settings.");
        else toast.error(msg);
        setMessages(m => m.slice(0, -1));
        return;
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = ""; let assembled = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl); buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") continue;
          try {
            const p = JSON.parse(j);
            const c = p.choices?.[0]?.delta?.content;
            if (c) {
              assembled += c;
              setMessages(m => {
                const copy = [...m]; copy[copy.length - 1] = { role: "assistant", content: assembled };
                return copy;
              });
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
      if (user && assembled) {
        await supabase.from("chat_messages").insert({ user_id: user.id, role: "assistant", content: assembled });
      }
    } catch (e: unknown) {
      console.error(e);
      toast.error("Oops, something went wrong.");
    } finally { setBusy(false); }
  }

  const quick = ["Quiz me on a fun word!", "Help me write a sentence", "Tell me a riddle", "I want to speak better"];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      <div className="glass rounded-3xl p-4 mb-3 flex items-center gap-3">
        <div className="size-12 rounded-2xl gradient-mint grid place-items-center text-2xl shadow-soft">🦊</div>
        <div className="flex-1">
          <div className="font-display font-bold">SmartMind Tutor</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="size-2 rounded-full bg-success animate-pulse" /> Online & ready to help
          </div>
        </div>
        <Sparkles className="text-primary" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => {
            const { clean, scores } = m.role === "assistant" ? stripScores(m.content) : { clean: m.content, scores: {} };
            const showTyping = m.role === "assistant" && busy && i === messages.length - 1 && !clean;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && <div className="size-8 rounded-full gradient-mint grid place-items-center text-base shrink-0">🦊</div>}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "glass rounded-bl-sm"
                }`}>
                  {showTyping ? (
                    <div className="flex gap-1 py-1">
                      <span className="size-2 rounded-full bg-current animate-bounce" />
                      <span className="size-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <span className="size-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{clean}</div>
                  )}
                  {m.role === "assistant" && clean && (
                    <button onClick={() => speak(clean)} className="mt-1.5 inline-flex items-center gap-1 text-[11px] opacity-70 hover:opacity-100">
                      <Volume2 className="h-3 w-3" /> Listen
                    </button>
                  )}
                  {scores.grammar !== undefined && (
                    <div className="mt-2 grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                      <Score label="Grammar" value={scores.grammar} />
                      <Score label="Vocab" value={scores.vocab!} />
                      <Score label="Fluency" value={scores.fluency!} />
                    </div>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="size-8 rounded-full bg-primary/20 grid place-items-center text-base shrink-0">{profile?.avatar_emoji ?? "🦊"}</div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {messages.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {quick.map(q => (
            <button key={q} onClick={() => setInput(q)} className="text-xs font-bold px-3 py-1.5 rounded-full bg-muted hover:bg-primary/15 hover:text-primary">{q}</button>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2 items-end">
        <Input value={input} onChange={e => setInput(e.target.value)}
          placeholder={listening ? "Listening… 🎤" : "Type or speak…"}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
          className="h-12 rounded-full px-5 text-base" />
        <Button type="button" variant={listening ? "default" : "outline"} size="icon"
          onClick={() => listening ? recognitionRef.current?.stop() : startListening()}
          className="h-12 w-12 rounded-full">
          <Mic className={listening ? "animate-pulse" : ""} />
        </Button>
        <Button onClick={send} disabled={busy || !input.trim()} className="h-12 w-12 rounded-full" size="icon">
          <Send />
        </Button>
      </div>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? "bg-success/30 text-success-foreground" : value >= 60 ? "bg-fun/40 text-fun-foreground" : "bg-warning/30 text-warning-foreground";
  return (
    <div className={`text-center px-1.5 py-1 rounded-lg ${color}`}>
      <div className="opacity-70">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}
