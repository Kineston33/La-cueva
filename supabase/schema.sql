-- Fixaro MVP schema
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('customer', 'technician', 'admin')),
  full_name text not null,
  location text not null,
  avatar_url text,
  service_category text,
  description text,
  price_range text,
  whatsapp_number text,
  is_available boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "users can read all technicians"
on public.profiles for select
using (true);

create policy "users can edit own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);
