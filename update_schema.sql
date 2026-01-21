-- Run this command in your Supabase SQL Editor to update the table
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;
