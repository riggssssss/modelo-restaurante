-- Create Tables Inventory
create table if not exists public.restaurant_tables (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  name text not null,
  capacity integer not null,
  is_active boolean not null default true,
  constraint restaurant_tables_pkey primary key (id)
);

-- Link reservations to tables
alter table public.reservations 
add column if not exists table_id uuid references public.restaurant_tables(id);
