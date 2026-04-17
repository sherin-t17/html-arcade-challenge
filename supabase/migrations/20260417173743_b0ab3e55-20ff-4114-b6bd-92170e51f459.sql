-- Teacher password constant (change here to update). Stored only in function source.
CREATE OR REPLACE FUNCTION public.get_teacher_data(_password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  IF _password IS NULL OR _password <> 'fxec2025' THEN
    RETURN jsonb_build_object('error', 'Invalid password');
  END IF;

  SELECT jsonb_build_object(
    'sessions', COALESCE((SELECT jsonb_agg(s ORDER BY s.score DESC, s.accuracy DESC, s.total_time_ms ASC)
                          FROM quiz_sessions s), '[]'::jsonb),
    'feedback', COALESCE((SELECT jsonb_agg(f ORDER BY f.created_at DESC) FROM feedback f), '[]'::jsonb),
    'settings', (SELECT to_jsonb(qs) FROM quiz_settings qs LIMIT 1)
  ) INTO result;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_teacher_settings(
  _password text,
  _expected_count integer,
  _force_unlock boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated quiz_settings;
BEGIN
  IF _password IS NULL OR _password <> 'fxec2025' THEN
    RETURN jsonb_build_object('error', 'Invalid password');
  END IF;
  IF _expected_count < 1 THEN
    RETURN jsonb_build_object('error', 'Invalid expected count');
  END IF;

  UPDATE quiz_settings
  SET expected_student_count = _expected_count,
      leaderboard_force_unlocked = _force_unlock,
      updated_at = now()
  WHERE singleton = true
  RETURNING * INTO updated;

  RETURN jsonb_build_object('settings', to_jsonb(updated));
END;
$$;

CREATE OR REPLACE FUNCTION public.reset_quiz_data(_password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _password IS NULL OR _password <> 'fxec2025' THEN
    RETURN jsonb_build_object('error', 'Invalid password');
  END IF;

  DELETE FROM quiz_sessions;
  DELETE FROM feedback;
  UPDATE quiz_settings SET leaderboard_force_unlocked = false WHERE singleton = true;

  RETURN jsonb_build_object('ok', true);
END;
$$;

-- Grant execute to anon/authenticated so the client can call these
GRANT EXECUTE ON FUNCTION public.get_teacher_data(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_teacher_settings(text, integer, boolean) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reset_quiz_data(text) TO anon, authenticated;