-- 1. Ensure templates table allows read access for everyone (authenticated & anonymous)
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Access" ON public.templates;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.templates;

CREATE POLICY "Enable read access for all users" ON public.templates
FOR SELECT
USING (true);

-- 2. Ensure templates allow insert/update/delete for authenticated users (if you want them to be able to edit)
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.templates;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.templates;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.templates;

CREATE POLICY "Enable insert for authenticated users" ON public.templates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON public.templates FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON public.templates FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Ensure favorites table exists (in case it wasn't created)
CREATE TABLE IF NOT EXISTS public.favorites (
  user_id uuid references auth.users not null,
  template_id uuid references public.templates not null,
  created_at timestamp with time zone default now(),
  primary key (user_id, template_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 4. Favorites RLS
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorites;

CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);
