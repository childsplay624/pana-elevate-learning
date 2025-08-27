-- Add missing updated_at column to certificates to match function usage
ALTER TABLE public.certificates 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Optional: ensure created_at has a default (some rows already have it)
ALTER TABLE public.certificates 
ALTER COLUMN created_at SET DEFAULT now();

-- Add trigger to keep updated_at in sync on updates if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'trg_certificates_updated_at'
  ) THEN
    CREATE TRIGGER trg_certificates_updated_at
    BEFORE UPDATE ON public.certificates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;