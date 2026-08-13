-- Long-term AI workspace: immutable artifact version snapshots.
-- Keeps ai_artifacts as the current-version record while preserving every prior revision.

create table if not exists public.ai_artifact_versions (
  id uuid primary key default gen_random_uuid(),
  artifact_id uuid not null references public.ai_artifacts(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  version integer not null check (version > 0),
  kind text not null check (kind in ('code', 'image', 'document')),
  title text not null,
  language text,
  content text not null,
  storage_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (artifact_id, version)
);

create index if not exists ai_artifact_versions_artifact_idx
  on public.ai_artifact_versions (artifact_id, version desc);

create index if not exists ai_artifact_versions_owner_idx
  on public.ai_artifact_versions (owner_id, created_at desc);

alter table public.ai_artifact_versions enable row level security;

drop policy if exists "Users can view own artifact versions" on public.ai_artifact_versions;
create policy "Users can view own artifact versions"
  on public.ai_artifact_versions for select
  using (auth.uid() = owner_id);

drop policy if exists "Users can insert own artifact versions" on public.ai_artifact_versions;
create policy "Users can insert own artifact versions"
  on public.ai_artifact_versions for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Users can delete own artifact versions" on public.ai_artifact_versions;
create policy "Users can delete own artifact versions"
  on public.ai_artifact_versions for delete
  using (auth.uid() = owner_id);

-- Existing artifacts are represented as their current snapshot. This backfill is
-- intentionally idempotent and gives every existing artifact a recoverable v1.
insert into public.ai_artifact_versions (
  artifact_id, owner_id, version, kind, title, language, content, storage_url, metadata, created_at
)
select
  a.id,
  a.owner_id,
  greatest(coalesce(a.version, 1), 1),
  a.kind,
  a.title,
  a.language,
  coalesce(a.content, a.storage_url, ''),
  a.storage_url,
  coalesce(a.metadata, '{}'::jsonb),
  coalesce(a.created_at, now())
from public.ai_artifacts a
on conflict (artifact_id, version) do nothing;
