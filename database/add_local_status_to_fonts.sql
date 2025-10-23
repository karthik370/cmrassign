-- Migration: Add 'local' as a valid status for fonts table
-- This allows distinguishing between actual uploaded fonts and local fonts used in projects

-- Drop existing constraint
ALTER TABLE public.fonts 
DROP CONSTRAINT IF EXISTS fonts_status_check;

-- Add new constraint with 'local' included
ALTER TABLE public.fonts 
ADD CONSTRAINT fonts_status_check 
CHECK (status IN ('uploaded', 'active', 'failed', 'local'));

-- Verify the constraint
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.fonts'::regclass
  AND conname = 'fonts_status_check';
