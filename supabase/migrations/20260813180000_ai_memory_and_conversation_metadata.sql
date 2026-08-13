-- Long-term AI metadata and memory layer.
-- Memory values are user-owned and readable only by the owner.
-- Connector OAuth secrets/tokens are intentionally NOT stored here.

alter table public.ai_conversations
  add column if not exists title text;

alter table public.ai_conversations
  add column if not exists project_id uuid references public.ai_projects(id) on delete set null;

create index if not exists ai_conversations_user_updated_idx
  on public.ai_conversations(user_id, updated_at desc);

create index if not exists ai_conversations_project_idx
  on public.ai_conversations(project_id, updated_at desc);

create table if not exists public.ai_memories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  memory_key text not null check (char_length(trim(memory_key)) between 1 and 160),
  memory_value text not null check (char_length(trim(memory_value)) between 1 and 4000),
  category text not null default 'general' check (category in ('general','preference','profile','work','project','instruction')),
  source text not null default 'user' check (source in ('user','ai','imported')),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, memory_key)
);

create index if not exists ai_memories_owner_updated_idx
  on public.ai_memories(owner_id, updated_at desc);

create or replace function public.set_ai_memory_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ai_memories_updated_at on public.ai_memories;
create trigger ai_memories_updated_at
before update on public.ai_memories
for each row execute function public.set_ai_memory_updated_at();

alter table public.ai_memories enable row level security;

drop policy if exists ai_memories_owner_select on public.ai_memories;
create policy ai_memories_owner_select
on public.ai_memories for select using (owner_id = auth.uid());

drop policy if exists ai_memories_owner_insert on public.ai_memories;
create policy ai_memories_owner_insert
on public.ai_memories for insert with check (owner_id = auth.uid());

drop policy if exists ai_memories_owner_update on public.ai_memories;
create policy ai_memories_owner_update
on public.ai_memories for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists ai_memories_owner_delete on public.ai_memories;
create policy ai_memories_owner_delete
on public.ai_memories for delete using (owner_id = auth.uid());

-- Backfill deterministic titles for existing conversations. UI still falls back to the first user message.
update public.ai_conversations
set title = left(trim(split_part(regexp_replace(messages->0->>'content', E'\\s+', ' ', 'g'), E'\\n', 1)), 120)
where (title is null or trim(title) = '')
  and jsonb_typeof(messages) = 'array'
  and jsonb_array_length(messages) > 0
  and coalesce(messages->0->>'role', '') = 'user'
  and coalesce(messages->0->>'content', '') <> '';
