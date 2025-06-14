
-- Update the invite_tokens table to have a 1-day expiration instead of 7 days
ALTER TABLE public.invite_tokens 
ALTER COLUMN expires_at SET DEFAULT (now() + interval '1 day');

-- Update existing unexpired tokens to have the new expiration (optional - uncomment if you want to apply to existing tokens)
-- UPDATE public.invite_tokens 
-- SET expires_at = created_at + interval '1 day'
-- WHERE NOT is_used AND expires_at > now();
