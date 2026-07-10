-- ALSAMOS Mail schema for SOCIAL Supabase project mbhjganbihamoiqmankv.
-- Run this in Lovable -> social project -> SQL editor.
-- Idempotent: CREATE TABLE IF NOT EXISTS, ADD COLUMN IF NOT EXISTS, DROP POLICY IF EXISTS.

create extension if not exists pgcrypto;

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  preferences jsonb default '{"theme":"dark","compactMode":false,"aiEnabled":true}'::jsonb,
  signatures jsonb default '[]'::jsonb,
  email_filters jsonb default '[]'::jsonb,
  notification_preferences jsonb default '{"emailNotifications":true,"desktopNotifications":false,"soundAlerts":true,"dailyDigest":false}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists display_name text,
  add column if not exists avatar_url text,
  add column if not exists preferences jsonb default '{"theme":"dark","compactMode":false,"aiEnabled":true}'::jsonb,
  add column if not exists signatures jsonb default '[]'::jsonb,
  add column if not exists email_filters jsonb default '[]'::jsonb,
  add column if not exists notification_preferences jsonb default '{"emailNotifications":true,"desktopNotifications":false,"soundAlerts":true,"dailyDigest":false}'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  thread_id uuid,
  from_name text not null,
  from_email text not null,
  from_avatar text,
  to_recipients jsonb not null default '[]'::jsonb,
  cc_recipients jsonb default '[]'::jsonb,
  subject text not null,
  snippet text,
  body text not null,
  is_read boolean default false,
  is_starred boolean default false,
  is_verified boolean default false,
  priority text default 'normal',
  folder text default 'inbox',
  labels text[] default '{}',
  attachments jsonb default '[]'::jsonb,
  ai_summary text,
  ai_actions jsonb default '[]'::jsonb,
  timestamp timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.emails
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists thread_id uuid,
  add column if not exists from_name text,
  add column if not exists from_email text,
  add column if not exists from_avatar text,
  add column if not exists to_recipients jsonb default '[]'::jsonb,
  add column if not exists cc_recipients jsonb default '[]'::jsonb,
  add column if not exists subject text,
  add column if not exists snippet text,
  add column if not exists body text,
  add column if not exists is_read boolean default false,
  add column if not exists is_starred boolean default false,
  add column if not exists is_verified boolean default false,
  add column if not exists priority text default 'normal',
  add column if not exists folder text default 'inbox',
  add column if not exists labels text[] default '{}',
  add column if not exists attachments jsonb default '[]'::jsonb,
  add column if not exists ai_summary text,
  add column if not exists ai_actions jsonb default '[]'::jsonb,
  add column if not exists timestamp timestamptz not null default now(),
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.labels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null default '#6366f1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, name)
);

alter table public.labels
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists name text,
  add column if not exists color text not null default '#6366f1',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  to_recipients text default '',
  cc_recipients text default '',
  subject text default '',
  body text default '',
  attachments jsonb default '[]'::jsonb,
  scheduled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.drafts
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists to_recipients text default '',
  add column if not exists cc_recipients text default '',
  add column if not exists subject text default '',
  add column if not exists body text default '',
  add column if not exists attachments jsonb default '[]'::jsonb,
  add column if not exists scheduled_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.scheduled_emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  to_recipients jsonb not null default '[]'::jsonb,
  cc_recipients jsonb default '[]'::jsonb,
  subject text not null,
  body text not null,
  attachments jsonb default '[]'::jsonb,
  scheduled_at timestamptz not null,
  status text not null default 'pending',
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.scheduled_emails
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists to_recipients jsonb default '[]'::jsonb,
  add column if not exists cc_recipients jsonb default '[]'::jsonb,
  add column if not exists subject text,
  add column if not exists body text,
  add column if not exists attachments jsonb default '[]'::jsonb,
  add column if not exists scheduled_at timestamptz,
  add column if not exists status text not null default 'pending',
  add column if not exists sent_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_emails_user_id on public.emails(user_id);
create index if not exists idx_emails_folder on public.emails(folder);
create index if not exists idx_emails_timestamp on public.emails(timestamp desc);
create index if not exists idx_emails_thread_id on public.emails(thread_id);
create index if not exists idx_labels_user_id on public.labels(user_id);
create index if not exists idx_drafts_user_id on public.drafts(user_id);
create index if not exists idx_scheduled_emails_user_id on public.scheduled_emails(user_id);
create index if not exists idx_scheduled_emails_scheduled_at on public.scheduled_emails(scheduled_at);

alter table public.profiles enable row level security;
alter table public.emails enable row level security;
alter table public.labels enable row level security;
alter table public.drafts enable row level security;
alter table public.scheduled_emails enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = user_id);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = user_id);

drop policy if exists "Users can view their own emails" on public.emails;
drop policy if exists "Users can insert their own emails" on public.emails;
drop policy if exists "Users can update their own emails" on public.emails;
drop policy if exists "Users can delete their own emails" on public.emails;
create policy "Users can view their own emails" on public.emails for select using (auth.uid() = user_id);
create policy "Users can insert their own emails" on public.emails for insert with check (auth.uid() = user_id);
create policy "Users can update their own emails" on public.emails for update using (auth.uid() = user_id);
create policy "Users can delete their own emails" on public.emails for delete using (auth.uid() = user_id);

drop policy if exists "Users can view their own labels" on public.labels;
drop policy if exists "Users can create their own labels" on public.labels;
drop policy if exists "Users can update their own labels" on public.labels;
drop policy if exists "Users can delete their own labels" on public.labels;
create policy "Users can view their own labels" on public.labels for select using (auth.uid() = user_id);
create policy "Users can create their own labels" on public.labels for insert with check (auth.uid() = user_id);
create policy "Users can update their own labels" on public.labels for update using (auth.uid() = user_id);
create policy "Users can delete their own labels" on public.labels for delete using (auth.uid() = user_id);

drop policy if exists "Users can view their own drafts" on public.drafts;
drop policy if exists "Users can create their own drafts" on public.drafts;
drop policy if exists "Users can update their own drafts" on public.drafts;
drop policy if exists "Users can delete their own drafts" on public.drafts;
create policy "Users can view their own drafts" on public.drafts for select using (auth.uid() = user_id);
create policy "Users can create their own drafts" on public.drafts for insert with check (auth.uid() = user_id);
create policy "Users can update their own drafts" on public.drafts for update using (auth.uid() = user_id);
create policy "Users can delete their own drafts" on public.drafts for delete using (auth.uid() = user_id);

drop policy if exists "Users can view their own scheduled emails" on public.scheduled_emails;
drop policy if exists "Users can create their own scheduled emails" on public.scheduled_emails;
drop policy if exists "Users can update their own scheduled emails" on public.scheduled_emails;
drop policy if exists "Users can delete their own scheduled emails" on public.scheduled_emails;
create policy "Users can view their own scheduled emails" on public.scheduled_emails for select using (auth.uid() = user_id);
create policy "Users can create their own scheduled emails" on public.scheduled_emails for insert with check (auth.uid() = user_id);
create policy "Users can update their own scheduled emails" on public.scheduled_emails for update using (auth.uid() = user_id);
create policy "Users can delete their own scheduled emails" on public.scheduled_emails for delete using (auth.uid() = user_id);

drop trigger if exists update_profiles_updated_at on public.profiles;
drop trigger if exists update_emails_updated_at on public.emails;
drop trigger if exists update_labels_updated_at on public.labels;
drop trigger if exists update_drafts_updated_at on public.drafts;
drop trigger if exists update_scheduled_emails_updated_at on public.scheduled_emails;
create trigger update_profiles_updated_at before update on public.profiles for each row execute function public.update_updated_at_column();
create trigger update_emails_updated_at before update on public.emails for each row execute function public.update_updated_at_column();
create trigger update_labels_updated_at before update on public.labels for each row execute function public.update_updated_at_column();
create trigger update_drafts_updated_at before update on public.drafts for each row execute function public.update_updated_at_column();
create trigger update_scheduled_emails_updated_at before update on public.scheduled_emails for each row execute function public.update_updated_at_column();
