-- Fix existing local fonts that were incorrectly marked as 'active'
-- This will change status from 'active' to 'local' for fonts that come from local paths

UPDATE public.fonts
SET status = 'local'
WHERE status = 'active'
  AND font_file_url LIKE '/api/fonts/local/%';

-- Verify the change
SELECT 
  name, 
  font_file_url, 
  status,
  created_at
FROM public.fonts
WHERE status = 'local'
ORDER BY created_at DESC;
