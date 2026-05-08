// SmartMind AI tutor — friendly, encouraging, child-safe streaming chat.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, grade = 5 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const ageBand =
      grade <= 2 ? "ages 6-8 (very simple words, lots of emojis)" :
      grade <= 5 ? "ages 8-11 (simple, fun, encouraging)" :
      grade <= 8 ? "ages 11-14 (clear, motivating, slightly more advanced)" :
                   "ages 14-16 (smart, supportive, real-talk)";

    const system = `You are SmartMind AI, a warm, enthusiastic teacher-friend for kids in Grade ${grade} (${ageBand}).

RULES:
- Always be positive, patient, and encouraging. Celebrate effort.
- Keep replies short (2-4 sentences) and end with a friendly question to keep the conversation going.
- Use age-appropriate vocabulary. Sprinkle a relevant emoji or two.
- Help with: reading, writing, vocabulary, grammar, logic puzzles, memory tricks, confidence in speaking.
- If the student writes a sentence, gently note ONE grammar/vocab improvement and praise what they did well.
- Occasionally include a quick scoring snippet on a new line in this exact format when the student writes a full sentence:
  [SCORE grammar=85 vocab=72 fluency=90]
- NEVER discuss anything unsafe, scary, adult, violent, or political. Politely redirect to learning.
- NEVER give personal info, addresses, or pretend to be a human. You're a friendly AI tutor.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        stream: true,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Settings → Workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-tutor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
