-- Long-term AI context enforcement.
-- The database remains the source of truth for conversation titles and project instructions.

create or replace function public.ai_conversation_title_from_messages(payload jsonb)
returns text
language plpgsql
immutable
as $$
declare
  item jsonb;
  content text;
begin
  if jsonb_typeof(payload) <> 'array' then
    return null;
  end if;

  for item in select value from jsonb_array_elements(payload)
  loop
    if coalesce(item->>'role', '') = 'user' and coalesce(item->>'content', '') <> '' then
      content := regexp_replace(trim(item->>'content'), E'\\s+', ' ', 'g');
      return left(content, 120);
    end if;
  end loop;

  return null;
end;
$$;

create or replace function public.set_ai_conversation_metadata()
returns trigger
language plpgsql
as $$
declare
  generated_title text;
begin
  -- Never overwrite a user-selected title.
  if new.title is null or trim(new.title) = '' then
    generated_title := public.ai_conversation_title_from_messages(new.messages);
    if generated_title is not null and generated_title <> '' then
      new.title := generated_title;
    end if;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists ai_conversations_metadata on public.ai_conversations;
create trigger ai_conversations_metadata
before insert or update of messages, title on public.ai_conversations
for each row execute function public.set_ai_conversation_metadata();

-- Existing rows that still have no title are populated once. Existing custom titles remain untouched.
update public.ai_conversations
set title = public.ai_conversation_title_from_messages(messages)
where (title is null or trim(title) = '')
  and public.ai_conversation_title_from_messages(messages) is not null;

comment on function public.ai_conversation_title_from_messages(jsonb) is
'Generates a deterministic <=120 character AI conversation title from the first user message.';

comment on trigger ai_conversations_metadata on public.ai_conversations is
'Keeps AI conversation metadata server-authoritative and preserves explicit user titles.';
