-- Alsamos AI: immutable artifact version history.
-- This migration intentionally keeps the current ai_artifacts row as the latest/head version
-- so existing clients remain compatible while version history becomes queryable.

create table if not exists public.ai_artifact_versions (
  id uuid primary key default gen_random_uuid(),
  artifact_id uuid not null references public.ai_artifacts(id) on delete cascade,
  version integer not null check (version > 0),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  mime_type text not null,
  storage_path text,
  preview_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (artifact_id, version)
);

create index if not exists ai_artifact_versions_artifact_idx
  on public.ai_artifact_versions (artifact_id, version desc);

create index if not exists ai_artifact_versions_owner_idx
  on public.ai_artifact_versions (owner_id, created_at desc);

alter table public.ai_artifact_versions enable row level security;

create policy "Users can read own artifact versions"
  on public.ai_artifact_versions for select
  using (auth.uid() = owner_id);

create policy "Users can create own artifact versions"
  on public.ai_artifact_versions for insert
  with check (auth.uid() = owner_id);

-- Seed history from existing artifact heads exactly once.
insert into public.ai_artifact_versions
  (artifact_id, version, owner_id, title, mime_type, storage_path, preview_url, created_at)
select id, greatest(version, 1), owner_id, title, mime_type, storage_path, preview_url, created_at
from public.ai_artifacts a
where not exists (
  select 1 from public.ai_artifact_versions v where v.artifact_id = a.id
);

comment on table public.ai_artifact_versions is 'Immutable version snapshots for AI artifacts; ai_artifacts remains the mutable latest/head record.';
