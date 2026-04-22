-- Supabase SQL schema for Astraeous
-- Stores:
-- 1) Profile data for the "perfil" tab
-- 2) Member login data (credentials), initially empty
--
-- Notes:
-- - Uses UUID primary keys.
-- - For member credentials, this models an application-level login system
--   (separate from Supabase Auth). Passwords should be stored as hashes.
-- - Simple TEST schema: no RLS/policies.

begin;

-- Required extensions (generally already available in Supabase)
create extension if not exists pgcrypto;

-- =========================
-- Profiles (Perfil)
-- =========================
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),

  -- If you use Supabase Auth, you can link this to auth.users via auth_user_id.
  -- Keep nullable to support a custom "member login" not tied to Supabase Auth.
  auth_user_id uuid unique,

  -- Public-facing fields
  username text unique,
  display_name text,
  bio text,
  avatar_url text,

  -- Optional extra fields commonly shown in a profile tab
  role text,
  location text,
  website text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- =========================
-- Members (application login)
-- =========================
-- This table is meant to hold credentials for a custom member login UI.
-- You can create rows later from an admin flow; for now it can remain empty.
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),

  -- Optional link to a profile
  profile_id uuid references public.profiles(id) on delete set null,

  -- Login identifier
  email text unique,

  -- Password (hash). For demo you can still inspect it, but not reversible.
  password_hash text,

  -- Foto de perfil (URL/path)
  profile_photo_url text,

  -- Estado para la tab (activo/offline)
  status text not null default 'offline' check (status in ('activo','offline')) ,

  -- Account state
  is_active boolean not null default true,

  -- Basic auditing
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_members_updated_at on public.members;
create trigger trg_members_updated_at
before update on public.members
for each row execute function public.set_updated_at();

-- Useful indexes
create index if not exists idx_members_profile_id on public.members(profile_id);

-- =========================
-- Optional: simple login helper (email + password_hash check)
-- =========================
-- This is ONLY useful if you implement hashing on the client/server and compare
-- hashes. If you plan to use Supabase Auth instead, skip this approach.
create or replace function public.verify_member_login(p_email text, p_password_hash text)
returns uuid
language sql
stable
as $$
  select m.id
  from public.members m
  where m.email = p_email
    and m.password_hash = p_password_hash
    and m.is_active = true;
$$;

-- =========================
-- No RLS (test setup)
-- =========================
-- Intentionally no RLS / policies

commit;
