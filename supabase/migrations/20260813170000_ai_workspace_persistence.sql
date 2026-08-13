-- Alsamos AI Workspace persistence layer.
-- Secrets/OAuth access tokens MUST NOT be stored in these client-readable tables.
-- Provider credentials belong in the gateway secret store.

create extension if not exists pgcrypto;

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

create table if not exists public.ai_artifacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid,
  project_id uuid references public.ai_projects(id) on delete set null,
  type text not null check (type in ('document','code','image','spreadsheet','slides','diagram')),
  title text not null check (char_length(trim(title)) between 1 and 240),
  version integer not null default 1 check (version > 0),
  mime_type text not null,
  storage_path text,
  preview_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_connectors (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('google-drive','gmail','calendar','notion','github','bozor','tolov','xarita')),
  display_name text not null,
  connected boolean not null default false,
  account_label text,
  updated_at timestamptz not null default now(),
  unique(owner_id, kind)
);

create table if not exists public.ai_skills (
  id text primary key,
  name text not null,
  description text not null default '',
  scope text not null default 'global' check (scope in ('global','chat','project')),
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_user_skills (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  skill_id text not null references public.ai_skills(id) on delete cascade,
  chat_id uuid,
  project_id uuid references public.ai_projects(id) on delete cascade,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, skill_id, chat_id, project_id)
);

create table if not exists public.ai_tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid not null,
  title text not null,
  status text not null default 'queued' check (status in ('queued','running','waiting-confirmation','completed','failed','cancelled')),
  steps jsonb not null default '[]'::jsonb,
  requires_confirmation boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_projects_owner_updated_idx on public.ai_projects(owner_id, updated_at desc);
create index if not exists ai_artifacts_owner_updated_idx on public.ai_artifacts(owner_id, updated_at desc);
create index if not exists ai_artifacts_project_idx on public.ai_artifacts(project_id, updated_at desc);
create index if not exists ai_connectors_owner_idx on public.ai_connectors(owner_id, display_name);
create index if not exists ai_user_skills_owner_idx on public.ai_user_skills(owner_id, updated_at desc);
create index if not exists ai_tasks_owner_created_idx on public.ai_tasks(owner_id, created_at desc);

create or replace function public.set_ai_workspace_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ai_projects_updated_at on public.ai_projects;
create trigger ai_projects_updated_at before update on public.ai_projects for each row execute function public.set_ai_workspace_updated_at();
drop trigger if exists ai_artifacts_updated_at on public.ai_artifacts;
create trigger ai_artifacts_updated_at before update on public.ai_artifacts for each row execute function public.set_ai_workspace_updated_at();
drop trigger if exists ai_connectors_updated_at on public.ai_connectors;
create trigger ai_connectors_updated_at before update on public.ai_connectors for each row execute function public.set_ai_workspace_updated_at();
drop trigger if exists ai_skills_updated_at on public.ai_skills;
create trigger ai_skills_updated_at before update on public.ai_skills for each row execute function public.set_ai_workspace_updated_at();
drop trigger if exists ai_user_skills_updated_at on public.ai_user_skills;
create trigger ai_user_skills_updated_at before update on public.ai_user_skills for each row execute function public.set_ai_workspace_updated_at();
drop trigger if exists ai_tasks_updated_at on public.ai_tasks;
create trigger ai_tasks_updated_at before update on public.ai_tasks for each row execute function public.set_ai_workspace_updated_at();

alter table public.ai_projects enable row level security;
alter table public.ai_artifacts enable row level security;
alter table public.ai_connectors enable row level security;
alter table public.ai_skills enable row level security;
alter table public.ai_user_skills enable row level security;
alter table public.ai_tasks enable row level security;

drop policy if exists ai_projects_owner_select on public.ai_projects;
create policy ai_projects_owner_select on public.ai_projects for select using (owner_id = auth.uid());
drop policy if exists ai_projects_owner_insert on public.ai_projects;
create policy ai_projects_owner_insert on public.ai_projects for insert with check (owner_id = auth.uid());
drop policy if exists ai_projects_owner_update on public.ai_projects;
create policy ai_projects_owner_update on public.ai_projects for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists ai_projects_owner_delete on public.ai_projects;
create policy ai_projects_owner_delete on public.ai_projects for delete using (owner_id = auth.uid());

create policy ai_artifacts_owner_all on public.ai_artifacts for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy ai_connectors_owner_all on public.ai_connectors for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy ai_skills_authenticated_read on public.ai_skills for select to authenticated using (true);
create policy ai_user_skills_owner_all on public.ai_user_skills for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy ai_tasks_owner_all on public.ai_tasks for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

insert into public.ai_skills (id, name, description, scope, enabled) values
('code-reviewer', 'Code Reviewer', 'Kod sifati, security va maintainability tahlili.', 'global', false),
('excel-expert', 'Excel Expert', 'Formulalar, pivotlar, jadval tahlili va chartlar.', 'global', false),
('legal-reviewer', 'Legal Reviewer', 'Shartnoma va huquqiy matnlarni strukturaviy ko‘rib chiqish.', 'global', false),
('researcher', 'Researcher', 'Manbalarni topish, solishtirish va research tasklarini rejalash.', 'global', false)
on conflict (id) do update set name = excluded.name, description = excluded.description, scope = excluded.scope;
