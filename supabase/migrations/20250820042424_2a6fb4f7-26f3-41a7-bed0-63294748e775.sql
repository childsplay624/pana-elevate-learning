-- Add missing columns to courses table for course type and live course functionality
ALTER TABLE public.courses 
ADD COLUMN course_type text DEFAULT 'self_paced',
ADD COLUMN zoom_meeting_id text,
ADD COLUMN scheduled_date timestamp with time zone;

-- Add check constraint for course_type
ALTER TABLE public.courses 
ADD CONSTRAINT course_type_check CHECK (course_type IN ('self_paced', 'live'));