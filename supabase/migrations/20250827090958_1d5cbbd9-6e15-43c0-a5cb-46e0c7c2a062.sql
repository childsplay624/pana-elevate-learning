-- Add missing columns to certificates table
ALTER TABLE public.certificates 
ADD COLUMN IF NOT EXISTS is_valid boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS issued_date timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS instructor_name text,
ADD COLUMN IF NOT EXISTS course_title text,
ADD COLUMN IF NOT EXISTS course_duration_hours integer;

-- Update existing certificates to have default values
UPDATE public.certificates 
SET 
  is_valid = true,
  issued_date = COALESCE(issued_at, created_at, now()),
  title = COALESCE(title, 'Certificate of Completion'),
  description = COALESCE(description, 'Certificate of course completion')
WHERE is_valid IS NULL OR issued_date IS NULL;

-- Drop the conflicting award_certificate functions to resolve overloading
DROP FUNCTION IF EXISTS public.award_certificate(uuid,uuid,uuid,timestamp with time zone);
DROP FUNCTION IF EXISTS public.award_certificate(uuid,uuid,uuid,timestamp with time zone,integer,text);