-- ─────────────────────────────────────────────────────────────
-- 1. recipes  (seeded from JSON; public read-only)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.recipes (
  id               text primary key,
  name             text        not null,
  meal_type        text        not null,
  cuisine_tags     text[]      not null default '{}',
  prep_time        int         not null default 0,
  cook_time        int         not null default 0,
  servings         int         not null default 4,
  difficulty       text        not null default 'medium',
  chef_inspiration text,
  description      text,
  ingredients      jsonb       not null default '[]',
  steps            text[]      not null default '{}',
  macros           jsonb       not null default '{}',
  image_url        text
);

alter table public.recipes enable row level security;

create policy "Recipes are publicly readable"
  on public.recipes for select
  using (true);

-- ─────────────────────────────────────────────────────────────
-- 2. user_recipes  (AI-recognised dishes saved by each user)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.user_recipes (
  id               text        primary key,
  user_id          uuid        references auth.users(id) on delete cascade not null,
  name             text        not null,
  meal_type        text        not null,
  cuisine_tags     text[]      not null default '{}',
  prep_time        int         not null default 0,
  cook_time        int         not null default 0,
  servings         int         not null default 4,
  difficulty       text        not null default 'medium',
  chef_inspiration text,
  description      text,
  ingredients      jsonb       not null default '[]',
  steps            text[]      not null default '{}',
  macros           jsonb       not null default '{}',
  image_url        text,
  created_at       timestamptz not null default now()
);

alter table public.user_recipes enable row level security;

create policy "Users read own recipes"
  on public.user_recipes for select
  using (auth.uid() = user_id);

create policy "Users insert own recipes"
  on public.user_recipes for insert
  with check (auth.uid() = user_id);

create policy "Users delete own recipes"
  on public.user_recipes for delete
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 3. meal_plans  (one row per user per day)
--    breakfast / lunch / dinner store the full Recipe JSON so
--    we never need a join to display Today's Plan.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.meal_plans (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        references auth.users(id) on delete cascade not null,
  date       date        not null default current_date,
  breakfast  jsonb,
  lunch      jsonb,
  dinner     jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table public.meal_plans enable row level security;

create policy "Users read own plans"
  on public.meal_plans for select
  using (auth.uid() = user_id);

create policy "Users insert own plans"
  on public.meal_plans for insert
  with check (auth.uid() = user_id);

create policy "Users update own plans"
  on public.meal_plans for update
  using (auth.uid() = user_id);

create policy "Users delete own plans"
  on public.meal_plans for delete
  using (auth.uid() = user_id);
