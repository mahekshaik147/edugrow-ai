import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — SmartMind AI" }] }),
  component: ProfilePage,
});

const AVATARS = ["🦊","🐼","🦁","🐧","🐸","🐯","🦄","🐙","🐰","🐨","🐲","🦋"];

function ProfilePage() {
  const { user, signOut } = useAuth();
  const { profile, refresh } = useProfile();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [grade, setGrade] = useState(5);
  const [avatar, setAvatar] = useState("🦊");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.display_name);
      setGrade(profile.grade);
      setAvatar(profile.avatar_emoji);
    }
  }, [profile]);

  async function save() {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update({
      display_name: name, grade, avatar_emoji: avatar,
    }).eq("id", user.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Saved!"); refresh(); }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-5">
      <h1 className="font-display text-4xl font-bold">Profile</h1>
      <div className="glass rounded-3xl p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="size-20 rounded-3xl gradient-hero grid place-items-center text-4xl shadow-glow">{avatar}</div>
          <div>
            <div className="font-display text-xl font-bold">{name}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
        </div>
        <div>
          <Label>Display name</Label>
          <Input value={name} onChange={e => setName(e.target.value)} maxLength={40} />
        </div>
        <div>
          <Label>Grade</Label>
          <div className="grid grid-cols-5 gap-2 mt-1">
            {Array.from({ length: 10 }).map((_, i) => {
              const g = i + 1;
              return (
                <button key={g} type="button" onClick={() => setGrade(g)}
                  className={`py-2 rounded-xl font-bold ${grade === g ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"}`}>{g}</button>
              );
            })}
          </div>
        </div>
        <div>
          <Label>Avatar</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {AVATARS.map(a => (
              <button key={a} type="button" onClick={() => setAvatar(a)}
                className={`size-10 text-xl rounded-full ${avatar === a ? "bg-primary text-primary-foreground scale-110 shadow-soft" : "bg-muted hover:bg-muted/70"}`}>{a}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={save} disabled={busy} className="rounded-full font-bold">Save changes</Button>
          <Button variant="outline" className="rounded-full" onClick={async () => { await signOut(); nav({ to: "/" }); }}>Sign out</Button>
        </div>
      </div>
    </div>
  );
}
