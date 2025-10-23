-- Migration: Add line_colors column to page_edits table
-- Created: 2025-10-18
-- Description: Adds JSONB column to store individual line colors for each page

-- Add line_colors column to page_edits table
ALTER TABLE public.page_edits
ADD COLUMN IF NOT EXISTS line_colors JSONB DEFAULT '{}'::jsonb;

-- Add comment to document the column
COMMENT ON COLUMN public.page_edits.line_colors IS 'Stores individual color for each line index, e.g., {"0": "black", "1": "blue-dark", "2": "red"}';
