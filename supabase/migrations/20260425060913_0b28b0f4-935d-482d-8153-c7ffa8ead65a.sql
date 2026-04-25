CREATE OR REPLACE FUNCTION public.reset_quiz_data(_password text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF _password IS NULL OR _password <> 'sherin17' THEN
    RETURN jsonb_build_object('error', 'Invalid password');
  END IF;

  DELETE FROM quiz_sessions WHERE id IS NOT NULL;
  DELETE FROM feedback WHERE id IS NOT NULL;
  UPDATE quiz_settings SET leaderboard_force_unlocked = false WHERE singleton = true;

  RETURN jsonb_build_object('ok', true);
END;
$function$;