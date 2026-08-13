-- The title-lock trigger also runs on INSERT. OLD is unavailable during INSERT,
-- so handle creation separately before evaluating update-only rename state.

create or replace function public.set_ai_conversation_metadata()
returns trigger
language plpgsql
as $$
declare
  generated_title text;
  messages_changed boolean;
  title_changed boolean;
begin
  if tg_op = 'INSERT' then
    if new.title_locked is null then
      new.title_locked := false;
    end if;

    if not new.title_locked and (new.title is null or trim(new.title) = '') then
      generated_title := public.ai_conversation_title_from_messages(new.messages);
      if generated_title is not null and generated_title <> '' then
        new.title := generated_title;
      end if;
    end if;

    new.updated_at := now();
    return new;
  end if;

  messages_changed := new.messages is distinct from old.messages;
  title_changed := new.title is distinct from old.title;

  if title_changed and not messages_changed then
    new.title_locked := true;
  elsif old.title_locked then
    new.title := old.title;
    new.title_locked := true;
  end if;

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
