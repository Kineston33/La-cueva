create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  role text not null check (role in ('customer', 'technician', 'admin')),
  name text not null,
  city text not null,
  photo_url text,
  created_at timestamptz default now()
);

create table if not exists technician_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  category text default 'General technician',
  description text default '',
  price_range text default '',
  whatsapp text default '',
  availability text default 'available' check (availability in ('available', 'busy')),
  updated_at timestamptz default now()
);

insert into users (email, password_hash, role, name, city)
values
('cliente@fixaro.com', '$2a$10$9Q1Yel9kBQwY/1yOJxQxpeQx2SBYut1fK8r7mRVnT8w8JYV2LIu7e', 'customer', 'Ana Cliente', 'Bogotá'),
('tecnico@fixaro.com', '$2a$10$9Q1Yel9kBQwY/1yOJxQxpeQx2SBYut1fK8r7mRVnT8w8JYV2LIu7e', 'technician', 'Carlos Técnico', 'Bogotá'),
('admin@fixaro.com', '$2a$10$9Q1Yel9kBQwY/1yOJxQxpeQx2SBYut1fK8r7mRVnT8w8JYV2LIu7e', 'admin', 'Admin Fixaro', 'Bogotá')
on conflict (email) do nothing;

insert into technician_profiles (user_id, category, description, price_range, whatsapp, availability)
select id, 'Electrician', 'Reparación de cortos y cableado residencial.', '$20-$60', '573001234567', 'available'
from users where email = 'tecnico@fixaro.com'
on conflict (user_id) do nothing;
