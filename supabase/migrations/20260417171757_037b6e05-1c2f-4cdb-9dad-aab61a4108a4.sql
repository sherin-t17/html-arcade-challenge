-- Quiz sessions table (public leaderboard data)
CREATE TABLE public.quiz_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  avatar_id INTEGER NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 24,
  accuracy NUMERIC(5,2) NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  total_time_ms INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert quiz sessions"
ON public.quiz_sessions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view quiz sessions"
ON public.quiz_sessions FOR SELECT
USING (true);

CREATE INDEX idx_quiz_sessions_score ON public.quiz_sessions (score DESC, accuracy DESC, total_time_ms ASC);

-- Feedback table (teacher-only read)
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  helpful TEXT NOT NULL,
  design TEXT NOT NULL,
  liked_most TEXT NOT NULL,
  problems TEXT NOT NULL,
  suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
ON public.feedback FOR INSERT
WITH CHECK (true);

-- No SELECT policy = nobody can read directly. Edge function will use service role.

-- Quiz settings (singleton)
CREATE TABLE public.quiz_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expected_student_count INTEGER NOT NULL DEFAULT 30,
  leaderboard_force_unlocked BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  singleton BOOLEAN NOT NULL DEFAULT true UNIQUE
);

ALTER TABLE public.quiz_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read quiz settings"
ON public.quiz_settings FOR SELECT
USING (true);

-- No INSERT/UPDATE policies = teacher edge function uses service role.

-- Seed the singleton settings row
INSERT INTO public.quiz_settings (expected_student_count, leaderboard_force_unlocked)
VALUES (30, false);

-- Enable realtime for live leaderboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_settings;