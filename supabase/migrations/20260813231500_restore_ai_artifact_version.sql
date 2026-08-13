-- Server-authoritative restore for AI artifact versions.
-- Restoring creates a NEW immutable version instead of mutating history.

create or replace function public.restore_ai_artifact_version(
  p_artifact_id uuid,
  p_version integer
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  source_version public.ai_artifact_versions%rowtype;
  next_version integer;
  new_version_id uuid;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  select * into source_version
  from public.ai_artifact_versions
  where artifact_id = p_artifact_id
    and version = p_version
    and owner_id = auth.uid()
  for share;

  if not found then
    raise exception 'artifact version not found';
  end if;

  select coalesce(max(version), 0) + 1 into next_version
  from public.ai_artifact_versions
  where artifact_id = p_artifact_id;

  insert into public.ai_artifact_versions (
    artifact_id, owner_id, version, kind, title, language,
    content, storage_url, metadata
  ) values (
    source_version.artifact_id, auth.uid(), next_version,
    source_version.kind, source_version.title, source_version.language,
    source_version.content, source_version.storage_url,
    source_version.metadata || jsonb_build_object('restored_from_version', source_version.version)
  ) returning id into new_version_id;

  update public.ai_artifacts
  set version = next_version,
      kind = source_version.kind,
      title = source_version.title,
      language = source_version.language,
      content = source_version.content,
      storage_url = source_version.storage_url,
      metadata = source_version.metadata,
      updated_at = now()
  where id = p_artifact_id and owner_id = auth.uid();

  if not found then raise exception 'artifact not found'; end if;
  return new_version_id;
end;
$$;

revoke all on function public.restore_ai_artifact_version(uuid, integer) from public;
grant execute on function public.restore_ai_artifact_version(uuid, integer) to authenticated;
