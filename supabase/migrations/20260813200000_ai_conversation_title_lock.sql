-- Make manual conversation renames explicit and durable.
-- A rename is an UPDATE of title without a messages change. Once detected,
-- subsequent message persistence must never replace the title automatically.

alter table public.ai_conversations
  add column if not exists title_locked boolean not null default false;

create index if not exists ai_conversations_user_title_locked_idx
  on public.ai_conversations(user_id, title_locked);

create or replace function public.set_ai_conversation_metadata()
returns trigger
language plpgsql
as $$
declare
  generated_title text;
  messages_changed boolean;
  title_changed boolean;
begin
  messages_changed := new.messages is distinct from old.messages;
  title_changed := new.title is distinct from old.title;

  -- Explicit rename: title changes while the conversation payload does not.
  -- Mark it as user-controlled so future automatic message persistence cannot
  -- overwrite it.
  if title_changed and not messages_changed then
    new.title_locked := true;
  elsif new.title_locked then
    -- Once locked, preserve the existing title during message persistence.
    new.title := old.title;
    new.title_locked := true;
  end if;

  -- New conversations and unlocked conversations receive a generated title.
  if not new.title_locked then
    generated_title := public.ai_conversation_title_from_messages(new.messages);
    if (new.title is null or trim(new.title) = '')
      and generated_title is not null
      and generated_title <> '' then
      new.title := generated_title;
    end if;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

comment on column public.ai_conversations.title_locked is
'Whether the user explicitly renamed this conversation; locked titles are preserved during automatic message persistence.';
