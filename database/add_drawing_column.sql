-- Add drawing_data column to page_edits table to store annotations/drawings

ALTER TABLE public.page_edits 
ADD COLUMN IF NOT EXISTS drawing_data JSONB DEFAULT '[]'::jsonb;

-- Add comment
COMMENT ON COLUMN public.page_edits.drawing_data IS 'Stores drawing strokes (pen, eraser, lines) as JSON array';
