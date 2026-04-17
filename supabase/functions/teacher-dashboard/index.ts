import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.45.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const TEACHER_PASSWORD = Deno.env.get("TEACHER_PASSWORD") ?? "fxec2025";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));
    const { password, action, payload } = body ?? {};

    if (typeof password !== "string" || password !== TEACHER_PASSWORD) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    switch (action) {
      case "verify": {
        return json({ ok: true });
      }
      case "load": {
        const [sessionsRes, feedbackRes, settingsRes] = await Promise.all([
          admin.from("quiz_sessions").select("*").order("score", { ascending: false }).order("accuracy", { ascending: false }).order("total_time_ms", { ascending: true }),
          admin.from("feedback").select("*").order("created_at", { ascending: false }),
          admin.from("quiz_settings").select("*").maybeSingle(),
        ]);
        return json({
          sessions: sessionsRes.data ?? [],
          feedback: feedbackRes.data ?? [],
          settings: settingsRes.data ?? null,
        });
      }
      case "update_settings": {
        const expected = Number(payload?.expected_student_count);
        const force = Boolean(payload?.leaderboard_force_unlocked);
        if (!Number.isFinite(expected) || expected < 1) {
          return json({ error: "Invalid expected_student_count" }, 400);
        }
        const { data, error } = await admin
          .from("quiz_settings")
          .update({
            expected_student_count: Math.floor(expected),
            leaderboard_force_unlocked: force,
            updated_at: new Date().toISOString(),
          })
          .eq("singleton", true)
          .select()
          .maybeSingle();
        if (error) return json({ error: error.message }, 500);
        return json({ settings: data });
      }
      case "reset_quiz": {
        // Delete all sessions and feedback (teacher-only nuke)
        await admin.from("quiz_sessions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        await admin.from("feedback").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        await admin.from("quiz_settings").update({ leaderboard_force_unlocked: false }).eq("singleton", true);
        return json({ ok: true });
      }
      default:
        return json({ error: "Unknown action" }, 400);
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});

function json(obj: any, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { ...cors, "Content-Type": "application/json" },
  });
}
