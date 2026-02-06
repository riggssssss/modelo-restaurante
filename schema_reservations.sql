-- Create the reservations table
create table if not exists public.reservations (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  date date not null,
  time text not null, -- Storing as text (HH:MM) to avoid timezone complexities with 'time' type for simple slots
  party_size integer not null,
  name text not null,
  email text not null,
  phone text not null,
  status text not null default 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  constraint reservations_pkey primary key (id)
);

-- Enable Row Level Security (RLS)
alter table public.reservations enable row level security;

-- Create policies (Adjust based on your auth needs - assuming public insert for now, admin select)
create policy "Enable insert for everyone" on public.reservations
  for insert with check (true);

create policy "Enable read access for authenticated users only" on public.reservations
  for select using (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on public.reservations
  for update using (auth.role() = 'authenticated');
