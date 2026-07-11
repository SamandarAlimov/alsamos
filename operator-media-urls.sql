-- ALSAMOS media URL rewrite after copying Supabase Storage objects to Oracle MinIO.
-- Run in Lovable -> social project -> SQL editor only after object copy counts match.
-- This script is non-destructive: it rewrites references, it does not delete Supabase Storage objects.

begin;

-- Profiles.
update public.profiles
set avatar_url = replace(avatar_url, 'https://mbhjganbihamoiqmankv.supabase.co/storage/v1/object/public/message-attachments/', 'https://media.alsamos.com/media/avatar/')
where avatar_url like 'https://mbhjganbihamoiqmankv.supabase.co/storage/v1/object/public/message-attachments/%';

update public.profiles
set cover_url = replace(cover_url, 'https://mbhjganbihamoiqmankv.supabase.co/storage/v1/object/public/message-attachments/', 'https://media.alsamos.com/media/avatar/')
where cover_url like 'https://mbhjganbihamoiqmankv.supabase.co/storage/v1/object/public/message-attachments/%';

-- Posts and stories store arrays/strings; exact copied key mapping should be reviewed before running.
-- If paths were copied preserving the old object path under media/legacy/, use the replace below.
update public.posts
set media_urls = (
  select coalesce(array_agg(replace(u, 'https://mbhjganbihamoiqmankv.supabase.co/storage/v1/object/public/message-attachments/', 'https://media.alsamos.com/media/legacy/message-attachments/')), '{}')
  from unnest(media_urls) as u
)
where media_urls is not null
  and exists (
    select 1 from unnest(media_urls) as u
    where u like 'https://mbhjganbihamoiqmankv.supabase.co/storage/v1/object/public/message-attachments/%'
  );

update public.stories
set media_url = replace(media_url, 'https://mbhjganbihamoiqmankv.supabase.co/storage/v1/object/public/message-attachments/', 'https://media.alsamos.com/media/legacy/message-attachments/')
where media_url like 'https://mbhjganbihamoiqmankv.supabase.co/storage/v1/object/public/message-attachments/%';

update public.story_highlight_items
set media_url = replace(media_url, 'https://mbhjganbihamoiqmankv.supabase.co/storage/v1/object/public/message-attachments/', 'https://media.alsamos.com/media/legacy/message-attachments/')
where media_url like 'https://mbhjganbihamoiqmankv.supabase.co/storage/v1/object/public/message-attachments/%';

-- Messages.
update public.messages
set media_url = replace(media_url, 'https://mbhjganbihamoiqmankv.supabase.co/storage/v1/object/public/message-attachments/', 'https://media.alsamos.com/media/legacy/message-attachments/')
where media_url like 'https://mbhjganbihamoiqmankv.supabase.co/storage/v1/object/public/message-attachments/%';

-- Mail attachment JSON usually stores path/url. Keep this conservative because attachment structure varies.
-- Review rows before uncommenting custom jsonb rewrites.
-- select id, attachments from public.emails where attachments::text like '%supabase.co/storage/v1/object%';

commit;
