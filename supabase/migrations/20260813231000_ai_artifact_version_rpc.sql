-- Server-authoritative artifact version creation.
-- Serializes concurrent writers on the current artifact row, creates an immutable
-- snapshot, then advances the current record in one transaction.

create or replace function public.ai_create_artifact_version(
  p_artifact_id uuid,
  p_content text,
  p_language text default null,
  p_metadata jsonb default '{}'::jsonb,
  p_storage_url text default null
)
returns table (
  artifact_id uuid,
  version integer,
  version_id uuid,
  created boolean
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_artifact public.ai_artifacts%rowtype;
  v_next integer;
  v_version_id uuid;
begin
  select * into v_artifact
  from public.ai_artifacts
  where id = p_artifact_id
    and owner_id = auth.uid()
  for update;

  if not found then
    raise exception 'artifact_not_found_or_forbidden';
  end if;

  if coalesce(v_artifact.content, v_artifact.storage_url, '') = coalesce(p_content, '')
     and coalesce(v_artifact.language, '') = coalesce(p_language, '') then
    return query
      select v_artifact.id, greatest(coalesce(v_artifact.version, 1), 1), null::uuid, false;
    return;
  end if;

  v_next := greatest(coalesce(v_artifact.version, 0), 0) + 1;

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
    v_artifact.id,
    v_artifact.owner_id,
    v_next,
    v_artifact.kind,
    v_artifact.title,
    coalesce(p_language, v_artifact.language),
    coalesce(p_content, ''),
    p_storage_url,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_version_id;

  update public.ai_artifacts
  set content = coalesce(p_content, ''),
      language = coalesce(p_language, v_artifact.language),
      storage_url = p_storage_url,
      metadata = coalesce(p_metadata, '{}'::jsonb),
      version = v_next,
      updated_at = now()
  where id = v_artifact.id
    and owner_id = auth.uid();

  return query select v_artifact.id, v_next, v_version_id, true;
end;
$$;

revoke all on function public.ai_create_artifact_version(uuid, text, text, jsonb, text) from public;
grant execute on function public.ai_create_artifact_version(uuid, text, text, jsonb, text) to authenticated;
