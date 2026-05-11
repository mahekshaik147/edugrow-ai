
CREATE TABLE public.question_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  question_id text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL,
  was_correct boolean NOT NULL DEFAULT false,
  time_spent_sec integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.question_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own question history" ON public.question_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own question history" ON public.question_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_qhist_user_cat_level ON public.question_history (user_id, category, difficulty);

CREATE TABLE public.study_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  plan jsonb NOT NULL,
  weaknesses jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own plan" ON public.study_plans
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own plan" ON public.study_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own plan" ON public.study_plans
  FOR UPDATE USING (auth.uid() = user_id);
