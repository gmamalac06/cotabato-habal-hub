
-- Add rating and review columns to rides table
ALTER TABLE IF EXISTS public.rides
ADD COLUMN IF NOT EXISTS rating INTEGER,
ADD COLUMN IF NOT EXISTS review TEXT;
