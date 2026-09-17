CREATE TABLE public.moderation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  direction text NOT NULL CHECK (direction IN ('input','output')),
  flagged boolean NOT NULL DEFAULT false,
  category text,
  original_snippet text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.moderation_log TO authenticated;
GRANT ALL ON public.moderation_log TO service_role;

ALTER TABLE public.moderation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own moderation rows"
ON public.moderation_log
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX moderation_log_user_created_idx ON public.moderation_log (user_id, created_at DESC);