-- Create the templates table
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all access for now (Anonymous allowed)
-- IMPORTANT: In a production app, you should restrict this.
CREATE POLICY "Public Access" ON public.templates FOR ALL USING (true);
