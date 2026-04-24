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
  avatar_blob bytea,
  avatar_mime_type text,

  -- Optional extra fields commonly shown in a profile tab
  role text,
  location text,
  website text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.profiles
  add column if not exists avatar_blob bytea;

alter table if exists public.profiles
  add column if not exists avatar_mime_type text;

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

-- Keep member accounts linked to their matching profile by username/email local-part.
create or replace function public.sync_member_profile_id()
returns trigger
language plpgsql
as $$
declare
  matched_profile_id uuid;
begin
  if new.email is null or btrim(new.email) = '' then
    return new;
  end if;

  select p.id
  into matched_profile_id
  from public.profiles p
  where lower(p.username) = lower(split_part(new.email, '@', 1))
     or lower(p.display_name) = lower(split_part(new.email, '@', 1))
  limit 1;

  new.profile_id := coalesce(new.profile_id, matched_profile_id);
  return new;
end;
$$;

drop trigger if exists trg_members_sync_profile_id on public.members;
create trigger trg_members_sync_profile_id
before insert or update of email on public.members
for each row execute function public.sync_member_profile_id();

-- =========================
-- Seed member roles
-- =========================
-- Ajusta estos nombres si tu tabla usa otro username/display_name.
insert into public.profiles (username, display_name, role)
values
  ('snova', 'Snova', 'FUNDADOR'),
  ('flordefuegoyseta', 'FlordeFuego', 'ARTISTA & ANIMATOR'),
  ('vichigato', 'Vichigato', 'COMPOSITOR'),
  ('ximench', 'Ximench', 'QA & CONTENT CREATOR')
on conflict (username) do update
set
  display_name = excluded.display_name,
  role = excluded.role,
  updated_at = now();

update public.members m
set profile_id = p.id
from public.profiles p
where lower(split_part(m.email, '@', 1)) = p.username;

-- =========================
-- Profile avatar blob helper
-- =========================
create or replace function public.save_profile_avatar_blob(
  p_member_id uuid,
  p_profile_id uuid,
  p_avatar_base64 text,
  p_mime_type text default 'image/jpeg'
)
returns table (
  profile_id uuid,
  avatar_url text,
  avatar_mime_type text
)
language plpgsql
as $$
declare
  clean_base64 text;
  resolved_mime_type text;
  avatar_data bytea;
  avatar_data_url text;
begin
  resolved_mime_type := coalesce(nullif(p_mime_type, ''), 'image/jpeg');
  clean_base64 := regexp_replace(coalesce(p_avatar_base64, ''), '^data:[^;]+;base64,', '');

  if clean_base64 = '' then
    raise exception 'avatar base64 is empty';
  end if;

  avatar_data := decode(clean_base64, 'base64');
  avatar_data_url := 'data:' || resolved_mime_type || ';base64,' || clean_base64;

  update public.profiles
  set
    avatar_blob = avatar_data,
    avatar_mime_type = resolved_mime_type,
    avatar_url = avatar_data_url,
    updated_at = now()
  where id = p_profile_id;

  if not found then
    raise exception 'profile % not found', p_profile_id;
  end if;

  update public.members
  set
    profile_photo_url = avatar_data_url,
    updated_at = now()
  where id = p_member_id;

  if not found then
    raise exception 'member % not found', p_member_id;
  end if;

  profile_id := p_profile_id;
  avatar_url := avatar_data_url;
  avatar_mime_type := resolved_mime_type;
  return next;
end;
$$;

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
