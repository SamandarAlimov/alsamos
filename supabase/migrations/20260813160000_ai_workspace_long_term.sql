-- Alsamos AI Workspace: durable long-term domain model.
-- This migration intentionally does not replace ai_conversations. It adds first-class
-- workspace entities around the existing conversation store.

create table if not exists public.ai_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 120),
  icon text,
  color text,
  instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_project_conversations (
  project_id uuid not null references public.ai_projects(id) on delete cascade,
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, conversation_id)
);

create table if not exists public.ai_artifacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid references public.ai_conversations(id) on delete set null,
  project_id uuid references public.ai_projects(id) on delete set null,
  type text not null check (type in ('document','code','image','spreadsheet','slides','diagram')),
  title text not null check (char_length(trim(title)) between 1 and 200),
  version integer not null default 1 check (version > 0),
  mime_type text not null,
  storage_path text,
  preview_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_artifact_versions (
  id uuid primary key default gen_random_uuid(),
  artifact_id uuid not null references public.ai_artifacts(id) on delete cascade,
  version integer not null check (version > 0),
  storage_path text,
  preview_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (artifact_id, version)
);

create table if not exists public.ai_connectors (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('google-drive','gmail','calendar','notion','github','bozor','tolov','xarita')),
  display_name text not null,
  connected boolean not null default false,
  account_label text,
  provider_account_id text,
  scopes text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, kind)
);

create table if not exists public.ai_skills (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  enabled boolean not null default false,
  scope text not null default 'global' check (scope in ('global','chat','project')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid references public.ai_conversations(id) on delete set null,
  title text not null,
  status text not null default 'queued' check (status in ('queued','running','waiting-confirmation','completed','failed','cancelled')),
  steps jsonb not null default '[]'::jsonb,
  requires_confirmation boolean not null default false,
  confirmation_expires_at timestamptz,
  result jsonb,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_projects_owner_updated_idx on public.ai_projects(owner_id, updated_at desc);
create index if not exists ai_artifacts_owner_updated_idx on public.ai_artifacts(owner_id, updated_at desc);
create index if not exists ai_artifacts_conversation_idx on public.ai_artifacts(conversation_id);
create index if not exists ai_tasks_owner_updated_idx on public.ai_tasks(owner_id, updated_at desc);
create index if not exists ai_connectors_owner_idx on public.ai_connectors(owner_id);

create or replace function public.ai_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ai_projects_touch on public.ai_projects;
create trigger ai_projects_touch before update on public.ai_projects for each row execute function public.ai_touch_updated_at();
drop trigger if exists ai_artifacts_touch on public.ai_artifacts;
create trigger ai_artifacts_touch before update on public.ai_artifacts for each row execute function public.ai_touch_updated_at();
drop trigger if exists ai_connectors_touch on public.ai_connectors;
create trigger ai_connectors_touch before update on public.ai_connectors for each row execute function public.ai_touch_updated_at();
drop trigger if exists ai_tasks_touch on public.ai_tasks;
create trigger ai_tasks_touch before update on public.ai_tasks for each row execute function public.ai_touch_updated_at();

alter table public.ai_projects enable row level security;
alter table public.ai_project_conversations enable row level security;
alter table public.ai_artifacts enable row level security;
alter table public.ai_artifact_versions enable row level security;
alter table public.ai_connectors enable row level security;
alter table public.ai_skills enable row level security;
alter table public.ai_tasks enable row level security;

create policy "ai_projects_owner_all" on public.ai_projects for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "ai_project_conversations_owner_all" on public.ai_project_conversations for all using (exists (select 1 from public.ai_projects p where p.id = project_id and p.owner_id = auth.uid())) with check (exists (select 1 from public.ai_projects p where p.id = project_id and p.owner_id = auth.uid()));
create policy "ai_artifacts_owner_all" on public.ai_artifacts for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "ai_artifact_versions_owner_all" on public.ai_artifact_versions for all using (exists (select 1 from public.ai_artifacts a where a.id = artifact_id and a.owner_id = auth.uid())) with check (exists (select 1 from public.ai_artifacts a where a.id = artifact_id and a.owner_id = auth.uid()));
create policy "ai_connectors_owner_all" on public.ai_connectors for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "ai_skills_owner_all" on public.ai_skills for all using (owner_id is null or owner_id = auth.uid()) with check (owner_id is null or owner_id = auth.uid());
create policy "ai_tasks_owner_all" on public.ai_tasks for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
