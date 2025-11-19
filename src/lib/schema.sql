-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Ingredients Table
create table ingredients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  "defaultUnit" text,
  "defaultPortion" numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Menus Table
create table menus (
  id text primary key,
  name text not null,
  "proteinId" uuid references ingredients(id),
  "vegetableId" uuid references ingredients(id),
  "starchId" uuid references ingredients(id),
  quantities jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Recurring Items Table
create table recurring_items (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  "isSelected" boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Stock Items Table
create table stock_items (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  status text default 'IN_STOCK',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Surplus Items Table
create table surplus_items (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  checked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Shopping Lists History Table
create table shopping_lists (
  id uuid primary key default uuid_generate_v4(),
  name text not null, -- e.g. "Courses du 19/11/2025"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Archived Items Table (Snapshot of items in a list)
create table archived_items (
  id uuid primary key default uuid_generate_v4(),
  "listId" uuid references shopping_lists(id) on delete cascade,
  name text not null,
  category text not null,
  quantity text, -- stored as string e.g. "200g" or "2 unit"
  checked boolean default false
);

-- Enable Row Level Security (RLS)
alter table ingredients enable row level security;
alter table menus enable row level security;
alter table recurring_items enable row level security;
alter table stock_items enable row level security;
alter table surplus_items enable row level security;
alter table shopping_lists enable row level security;
alter table archived_items enable row level security;

-- Policies: Allow access to AUTHENTICATED users only (Shared Family List)
-- This means anyone who logs in can see and edit the SAME data.

create policy "Allow authenticated access to ingredients" on ingredients for all to authenticated using (true) with check (true);
create policy "Allow authenticated access to menus" on menus for all to authenticated using (true) with check (true);
create policy "Allow authenticated access to recurring_items" on recurring_items for all to authenticated using (true) with check (true);
create policy "Allow authenticated access to stock_items" on stock_items for all to authenticated using (true) with check (true);
create policy "Allow authenticated access to surplus_items" on surplus_items for all to authenticated using (true) with check (true);
create policy "Allow authenticated access to shopping_lists" on shopping_lists for all to authenticated using (true) with check (true);
create policy "Allow authenticated access to archived_items" on archived_items for all to authenticated using (true) with check (true);
