-- Alsamos AI artifact storage foundation.
-- Objects are private; clients receive short-lived signed URLs through the app repository.

insert into storage.buckets (id, name, public)
values ('ai-artifacts', 'ai-artifacts', false)
on conflict (id) do update set public = false;

create policy "AI artifacts owner can read objects"
on storage.objects for select
to authenticated
using (
  bucket_id = 'ai-artifacts'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "AI artifacts owner can upload objects"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'ai-artifacts'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "AI artifacts owner can update objects"
on storage.objects for update
to authenticated
using (
  bucket_id = 'ai-artifacts'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'ai-artifacts'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "AI artifacts owner can delete objects"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'ai-artifacts'
  and (storage.foldername(name))[1] = auth.uid()::text
);
