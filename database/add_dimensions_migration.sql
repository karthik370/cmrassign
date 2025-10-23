-- Migration: Add dimensions column to page_edits table
-- Created: 2025-10-18
-- Description: Adds JSONB column to store page-specific dimension settings

-- Add dimensions column to page_edits table
ALTER TABLE public.page_edits
ADD COLUMN IF NOT EXISTS dimensions JSONB DEFAULT '{"lineBoxHeight": 30.5, "lineSpacing": 23, "marginLeft": 40, "marginRight": -125, "marginTop": 93}'::jsonb;

-- Add comment to document the column
COMMENT ON COLUMN public.page_edits.dimensions IS 'Stores page-specific dimension settings: lineBoxHeight, lineSpacing, marginLeft, marginRight, marginTop';
