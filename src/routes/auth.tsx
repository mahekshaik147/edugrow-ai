import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mascot } from "@/components/Mascot";

const search = z.object({ mode: z.enum(["login", "register"]).default("login") });

export const Route = createFileRoute("/auth")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Sign in — SmartMind AI" },
      { name: "description", content: "Sign in or create your free SmartMind AI account." },
    ],
  }),
  component: AuthPage,
});

const AVATARS = ["🦊","🐼","🦁","🐧","🐸","🐯","🦄","🐙","🐰","🐨"];

function AuthPage() {
  const { mode } = Route.useSearch();
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(mode === "register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState(5);
  const [avatar, setAvatar] = useState("🦊");
  const [busy, setBusy] = useState(false);

  useEffect(() => { setIsRegister(mode === "register"); }, [mode]);
  useEffect(() => {
    if (!loading && user) nav({ to: "/dashboard" });
  }, [user, loading, nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { display_name: name || "Explorer", grade, avatar_emoji: avatar },
          },
        });
        if (error) throw error;
        toast.success("Welcome aboard! 🎉");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back! 👋");
      }
      nav({ to: "/dashboard" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen bg-aurora grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center p-12 gradient-hero text-primary-foreground relative overflow-hidden">
        <Mascot size={260} />
        <h2 className="mt-8 font-display text-4xl font-bold text-center">Hi friend!<br/> Ready to play?</h2>
        <p className="mt-3 opacity-90 text-center max-w-sm">Join thousands of kids learning to think, speak and solve like pros.</p>
        <div className="absolute -bottom-20 -right-20 text-[20rem] opacity-10">✨</div>
      </div>

      <div className="flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass-strong rounded-3xl p-8">
          <Link to="/" className="flex items-center gap-2 font-display font-bold mb-6">
            <span className="text-2xl">🧠</span> <span className="text-gradient">SmartMind AI</span>
          </Link>
          <h1 className="font-display text-3xl font-bold">{isRegister ? "Create your account" : "Welcome back!"}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isRegister ? "Free forever. Takes 30 seconds." : "Let's continue learning."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {isRegister && (
              <>
                <div>
                  <Label>Your name</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Alex" required maxLength={40} />
                </div>
                <div>
                  <Label>Your grade</Label>
                  <div className="grid grid-cols-5 gap-2 mt-1">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const g = i + 1;
                      return (
                        <button type="button" key={g} onClick={() => setGrade(g)}
                          className={`py-2 rounded-xl font-bold text-sm transition ${
                            grade === g ? "bg-primary text-primary-foreground shadow-soft" : "bg-muted hover:bg-muted/70"
                          }`}>
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <Label>Pick an avatar</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {AVATARS.map(a => (
                      <button type="button" key={a} onClick={() => setAvatar(a)}
                        className={`size-10 text-xl rounded-full transition ${
                          avatar === a ? "bg-primary text-primary-foreground scale-110 shadow-soft" : "bg-muted hover:bg-muted/70"
                        }`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>

            <Button type="submit" disabled={busy} className="w-full h-12 rounded-full font-bold text-base shadow-soft">
              {busy ? "Loading…" : isRegister ? "🎉 Start playing" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-sm text-center text-muted-foreground">
            {isRegister ? "Already have an account?" : "New here?"}{" "}
            <button onClick={() => setIsRegister(v => !v)} className="text-primary font-bold hover:underline">
              {isRegister ? "Sign in" : "Create one"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
