-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  image_initials TEXT DEFAULT NULL,
  avatar_url TEXT DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for testimonials
CREATE POLICY "Anyone can view active testimonials" 
ON public.testimonials 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage all testimonials" 
ON public.testimonials 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data from the existing testimonials
INSERT INTO public.testimonials (name, position, company, content, rating, image_initials, display_order) VALUES
('Dr. Sarah Okonkwo', 'Head of Learning & Development', 'Shell Nigeria', 'PANA Academy''s energy sector training program transformed our team''s capabilities. The practical approach and industry expertise delivered immediate value to our operations.', 5, 'SO', 1),
('Michael Adebayo', 'Digital Transformation Director', 'Access Bank', 'The digital leadership program exceeded our expectations. Our executives gained crucial skills that directly translated to improved organizational performance.', 5, 'MA', 2),
('Fatima Al-Hassan', 'Operations Manager', 'Total Energies', 'Outstanding consulting services! PANA Academy helped us streamline our processes and achieve 30% efficiency improvement within six months.', 5, 'FA', 3),
('James Okafor', 'CEO', 'TechAdvance Solutions', 'The research and development partnership with PANA Academy has been invaluable. Their insights helped us stay ahead of industry trends.', 5, 'JO', 4),
('Aisha Mohammed', 'Project Manager', 'NNPC Limited', 'Exceptional training quality and professional delivery. The technical excellence program equipped our team with skills that made an immediate impact.', 5, 'AM', 5);