-- Create the favorites table
create table public.favorites (
  user_id uuid references auth.users not null,
  template_id uuid references public.templates not null,
  created_at timestamp with time zone default now(),
  primary key (user_id, template_id)
);

-- Enable RLS
alter table public.favorites enable row level security;

-- Policies
create policy "Users can view their own favorites" on public.favorites
  for select using (auth.uid() = user_id);

create policy "Users can insert their own favorites" on public.favorites
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own favorites" on public.favorites
  for delete using (auth.uid() = user_id);
