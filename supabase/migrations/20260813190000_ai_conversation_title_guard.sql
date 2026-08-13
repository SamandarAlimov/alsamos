-- Long-term title integrity guard.
-- The client persists messages and may also send the auto-generated title on the same
-- UPDATE. Once a user has explicitly renamed a conversation, that auto-generated value
-- must never overwrite the custom title.

create or replace function public.set_ai_conversation_metadata()
returns trigger
language plpgsql
as $$
declare
  old_generated_title text;
  new_generated_title text;
begin
  old_generated_title := public.ai_conversation_title_from_messages(old.messages);
  new_generated_title := public.ai_conversation_title_from_messages(new.messages);

  -- A blank title is never a valid persisted title. Fall back to the generated title
  -- when possible, otherwise keep the existing title.
  if new.title is null or trim(new.title) = '' then
    if new_generated_title is not null and new_generated_title <> '' then
      new.title := new_generated_title;
    else
      new.title := old.title;
    end if;
  -- If the old title was custom and the incoming value is merely the generated title
  -- produced from the current messages, this is an automatic persistence update.
  -- Preserve the user's custom title.
  elsif old.title is not null
    and trim(old.title) <> ''
    and old_generated_title is not null
    and old.title <> old_generated_title
    and new_generated_title is not null
    and new.title = new_generated_title
  then
    new.title := old.title;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

comment on function public.set_ai_conversation_metadata() is
'Keeps AI conversation metadata server-authoritative and prevents automatic message persistence from overwriting manually renamed titles.';
