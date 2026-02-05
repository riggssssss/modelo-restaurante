-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MENU CATEGORIES
create table menu_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  sort_order integer default 0,
  image_url text, -- Added for category images
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MENU ITEMS
create table menu_items (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10,2),
  category text, -- Can be linked to menu_categories.name or id, currently using name in code
  sort_order integer default 0,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SITE CONTENT (For dynamic text/images)
create table site_content (
  key text primary key,
  value jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- REVIEWS
create table reviews (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  rating integer,
  comment text,
  date text,
  image_url text, -- Avatar
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Example: Public read, Admin write)
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table site_content enable row level security;
alter table reviews enable row level security;

-- Policies for public read access
create policy "Public menu_categories are viewable by everyone" on menu_categories for select using (true);
create policy "Public menu_items are viewable by everyone" on menu_items for select using (true);
create policy "Public site_content are viewable by everyone" on site_content for select using (true);
create policy "Public reviews are viewable by everyone" on reviews for select using (true);

-- Policies for admin write access (Customize as needed)
-- For development simplicity, we often allow all insert/update if authenticated or just for testing
-- create policy "Enable insert for authenticated users only" on menu_items for insert with check (auth.role() = 'authenticated');
