-- AI artifact lifecycle invariants.
-- Run against a Supabase test database after applying the AI artifact migrations.

begin;

do $$
begin
  if to_regprocedure('public.ai_create_artifact(uuid,uuid,uuid,text,text,text,text,jsonb,text)') is null then
    raise exception 'ai_create_artifact RPC is missing';
  end if;
  if to_regprocedure('public.ai_create_artifact_version(uuid,text,text,jsonb,text)') is null then
    raise exception 'ai_create_artifact_version RPC is missing';
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    where t.relname = 'ai_artifact_versions'
      and c.contype = 'u'
      and pg_get_constraintdef(c.oid) ilike '%artifact_id%version%'
  ) then
    raise exception 'ai_artifact_versions must enforce unique artifact/version';
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_class where relname = 'ai_artifacts' and relrowsecurity) then
    raise exception 'RLS is disabled on ai_artifacts';
  end if;
  if not exists (select 1 from pg_class where relname = 'ai_artifact_versions' and relrowsecurity) then
    raise exception 'RLS is disabled on ai_artifact_versions';
  end if;
end $$;

rollback;
