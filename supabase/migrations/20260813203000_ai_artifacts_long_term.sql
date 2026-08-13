-- Durable AI artifact storage.
-- Chat messages remain the source event; this table stores substantial outputs
-- as independently addressable workspace artifacts with immutable versions.

create table if not exists public.ai_artifacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid references public.ai_conversations(id) on delete set null,
  message_id text,
  project_id uuid,
  kind text not null check (kind in ('code','image','document','spreadsheet','slides','diagram')),
  title text not null,
  language text,
  content text,
  storage_url text,
  metadata jsonb not null default '{}'::jsonb,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_artifacts_owner_updated_idx
  on public.ai_artifacts(owner_id, updated_at desc);
create index if not exists ai_artifacts_conversation_idx
  on public.ai_artifacts(conversation_id, created_at desc);
create index if not exists ai_artifacts_project_idx
  on public.ai_artifacts(project_id, updated_at desc);

alter table public.ai_artifacts enable row level security;

drop policy if exists "ai_artifacts_select_own" on public.ai_artifacts;
drop policy if exists "ai_artifacts_insert_own" on public.ai_artifacts;
drop policy if exists "ai_artifacts_update_own" on public.ai_artifacts;
drop policy if exists "ai_artifacts_delete_own" on public.ai_artifacts;

create policy "ai_artifacts_select_own"
  on public.ai_artifacts for select
  using (owner_id = auth.uid());

create policy "ai_artifacts_insert_own"
  on public.ai_artifacts for insert
  with check (owner_id = auth.uid());

create policy "ai_artifacts_update_own"
  on public.ai_artifacts for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "ai_artifacts_delete_own"
  on public.ai_artifacts for delete
  using (owner_id = auth.uid());

create or replace function public.touch_ai_artifact()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists ai_artifacts_touch on public.ai_artifacts;
create trigger ai_artifacts_touch
before update on public.ai_artifacts
for each row execute function public.touch_ai_artifact();

comment on table public.ai_artifacts is
'Durable AI workspace artifacts. A chat message may reference an artifact, while the artifact can be opened, versioned and managed independently.';
