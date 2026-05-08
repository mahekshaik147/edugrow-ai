import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;

export function useProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    refresh: () => qc.invalidateQueries({ queryKey: ["profile", user?.id] }),
  };
}

// Award XP/coins/streak helpers
export async function awardXP(userId: string, xp: number, coins = 0) {
  const { data: p } = await supabase.from("profiles").select("xp, coins, level, streak, last_active").eq("id", userId).single();
  if (!p) return;
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let newStreak = p.streak ?? 0;
  if (p.last_active !== today) {
    newStreak = p.last_active === yesterday ? newStreak + 1 : 1;
  }
  const newXP = (p.xp ?? 0) + xp;
  const newLevel = Math.max(1, Math.floor(newXP / 200) + 1);
  await supabase.from("profiles").update({
    xp: newXP,
    coins: (p.coins ?? 0) + coins,
    level: newLevel,
    streak: newStreak,
    last_active: today,
  }).eq("id", userId);
}
