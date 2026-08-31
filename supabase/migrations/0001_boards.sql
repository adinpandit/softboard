-- Softboard — Phase 2: Board Management
--
-- Creates the `boards` table, an `updated_at` maintenance trigger, and Row Level
-- Security policies that scope every row to its owner. All application traffic
-- uses the anon key plus the signed-in user's session, so these policies are the
-- authorization boundary — a user can never read or mutate another user's board.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Shared helper: keep `updated_at` accurate on every UPDATE, server-side, so
-- clients cannot spoof it. Reused by later tables (board_items, threads).
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- boards
-- ---------------------------------------------------------------------------
create table if not exists public.boards (
  id          uuid        primary key default gen_random_uuid(),
  owner_id    uuid        not null references auth.users (id) on delete cascade,
  title       text        not null check (char_length(btrim(title)) between 1 and 120),
  description text                    check (description is null or char_length(description) <= 2000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.boards is
  'Top-level Softboard workspaces. One owner per board; sharing is post-MVP.';

-- Matches the dashboard query: a user''s boards, most recently updated first.
create index if not exists boards_owner_id_updated_at_idx
  on public.boards (owner_id, updated_at desc);

drop trigger if exists boards_set_updated_at on public.boards;
create trigger boards_set_updated_at
  before update on public.boards
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Table privileges. RLS only *narrows* what a role can already do — Postgres
-- still checks table-level GRANTs first, so without these the API returns
-- "permission denied for table boards" before any policy is evaluated.
-- Only the `authenticated` role is granted access; `anon` gets nothing because
-- every board route requires a signed-in user.
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on table public.boards to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security: a user may only see and mutate boards they own.
-- ---------------------------------------------------------------------------
alter table public.boards enable row level security;
alter table public.boards force row level security;

drop policy if exists "Users can read their own boards" on public.boards;
create policy "Users can read their own boards"
  on public.boards
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "Users can create their own boards" on public.boards;
create policy "Users can create their own boards"
  on public.boards
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Users can update their own boards" on public.boards;
create policy "Users can update their own boards"
  on public.boards
  for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Users can delete their own boards" on public.boards;
create policy "Users can delete their own boards"
  on public.boards
  for delete
  to authenticated
  using ((select auth.uid()) = owner_id);
