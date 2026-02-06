-- WARNING: This will delete existing menu data.
-- Since we are setting up the system, this is likely acceptable.

DROP TABLE IF EXISTS public.menu_items;
DROP TABLE IF EXISTS public.menu_categories;

-- Create Menu Categories Table
create table public.menu_categories (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  name text not null,
  description text null,
  sort_order integer not null default 0,
  image_url text null,
  constraint menu_categories_pkey primary key (id)
);

-- Create Menu Items Table
create table public.menu_items (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  category_id uuid not null references public.menu_categories(id) on delete cascade,
  name text not null,
  description text null,
  price text null,
  sort_order integer not null default 0,
  image_url text null,
  is_available boolean not null default true,
  constraint menu_items_pkey primary key (id)
);
