-- Add new columns to framework_maps for enhanced framework management
ALTER TABLE public.framework_maps 
ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS canvas_positions jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_template boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS template_category text DEFAULT NULL;

-- Create index for template queries
CREATE INDEX IF NOT EXISTS idx_framework_maps_is_template ON public.framework_maps(is_template) WHERE is_template = true;
CREATE INDEX IF NOT EXISTS idx_framework_maps_template_category ON public.framework_maps(template_category) WHERE template_category IS NOT NULL;