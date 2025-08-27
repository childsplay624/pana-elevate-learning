-- Recreate the award_certificate function with proper security settings
CREATE OR REPLACE FUNCTION public.award_certificate(
  _user_id uuid, 
  _course_id uuid, 
  _enrollment_id uuid, 
  _completion_date timestamp with time zone,
  _score integer DEFAULT NULL,
  _grade text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  _course_data RECORD;
  _certificate_id UUID;
  _cert_number TEXT;
  _verification_code TEXT;
BEGIN
  -- Check if certificate already exists
  SELECT id INTO _certificate_id 
  FROM public.certificates 
  WHERE user_id = _user_id 
    AND course_id = _course_id
    AND enrollment_id = _enrollment_id
  LIMIT 1;

  IF _certificate_id IS NOT NULL THEN
    RETURN _certificate_id;
  END IF;

  -- Get course and instructor data
  SELECT 
    c.title,
    c.duration_hours,
    COALESCE(p.full_name, 'PANA Academy Instructor') as instructor_name
  INTO _course_data
  FROM public.courses c
  LEFT JOIN public.profiles p ON p.id = c.instructor_id
  WHERE c.id = _course_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Course not found';
  END IF;

  -- Generate unique certificate number and verification code
  LOOP
    _cert_number := 'CERT-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 10000)::text, 4, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.certificates WHERE certificate_number = _cert_number);
  END LOOP;

  LOOP
    _verification_code := 'VC-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.certificates WHERE verification_code = _verification_code);
  END LOOP;

  -- Create certificate
  INSERT INTO public.certificates (
    user_id,
    course_id,
    enrollment_id,
    certificate_number,
    title,
    description,
    issued_date,
    completion_date,
    grade,
    score,
    instructor_name,
    course_title,
    course_duration_hours,
    verification_code,
    is_valid,
    created_at,
    updated_at
  ) VALUES (
    _user_id,
    _course_id,
    _enrollment_id,
    _cert_number,
    _course_data.title || ' - Certificate of Completion',
    'This certificate is awarded in recognition of successful completion of the course: ' || _course_data.title,
    now(),
    _completion_date,
    _grade,
    _score,
    _course_data.instructor_name,
    _course_data.title,
    _course_data.duration_hours,
    _verification_code,
    true,
    now(),
    now()
  ) RETURNING id INTO _certificate_id;

  -- Update enrollment with certificate info
  UPDATE public.enrollments 
  SET 
    status = 'completed',
    completed_at = _completion_date,
    progress_percentage = 100
  WHERE id = _enrollment_id;

  -- Award points for completion if gamification function exists  
  BEGIN
    PERFORM public.award_points(
      _user_id, 
      100, 
      'course_completion', 
      'Completed course: ' || _course_data.title,
      _course_id
    );
  EXCEPTION WHEN OTHERS THEN
    -- Ignore if gamification is not set up
    NULL;
  END;

  RETURN _certificate_id;
END;
$function$;