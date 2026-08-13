-- Atomic creation of an artifact and its immutable v1 snapshot.
-- The RPC is owner-authoritative and keeps current state and history consistent.

create or replace function public.ai_create_artifact(
  p_message_id uuid,
  p_conversation_id uuid,
  p_project_id uuid,
  p_kind text,
  p_title text,
  p_language text,
  p_content text,
  p_metadata jsonb default '{}'::jsonb,
  p_storage_url text default null
)
returns table (
  artifact_id uuid,
  version integer,
  version_id uuid
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_artifact_id uuid;
  v_version_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  if p_kind not in ('code', 'image', 'document') then
    raise exception 'invalid_artifact_kind';
  end if;

  insert into public.ai_artifacts (
    owner_id,
    conversation_id,
    message_id,
    project_id,
    kind,
    title,
    language,
    content,
    metadata,
    storage_url,
    version
  ) values (
    auth.uid(),
    p_conversation_id,
    p_message_id,
    p_project_id,
    p_kind,
    p_title,
    p_language,
    p_content,
    coalesce(p_metadata, '{}'::jsonb),
    p_storage_url,
    1
  )
  returning id into v_artifact_id;

  insert into public.ai_artifact_versions (
    artifact_id,
    owner_id,
    version,
    kind,
    title,
    language,
    content,
    storage_url,
    metadata
  ) values (
    v_artifact_id,
    auth.uid(),
    1,
    p_kind,
    p_title,
    p_language,
    coalesce(p_content, ''),
    p_storage_url,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_version_id;

  return query select v_artifact_id, 1, v_version_id;
end;
$$;

revoke all on function public.ai_create_artifact(uuid, uuid, uuid, text, text, text, text, jsonb, text) from public;
grant execute on function public.ai_create_artifact(uuid, uuid, uuid, text, text, text, text, jsonb, text) to authenticated;
