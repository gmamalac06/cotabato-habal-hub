
-- Add avatar_url column to profiles table
ALTER TABLE IF EXISTS public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;
