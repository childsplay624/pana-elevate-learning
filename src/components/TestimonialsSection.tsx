import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Dr. Sarah Okonkwo",
      position: "Head of Learning & Development",
      company: "Shell Nigeria",
      image: "SO",
      rating: 5,
      content: "PANA Academy's energy sector training program transformed our team's capabilities. The practical approach and industry expertise delivered immediate value to our operations."
    },
    {
      name: "Michael Adebayo",
      position: "Digital Transformation Director",
      company: "Access Bank",
      image: "MA",
      rating: 5,
      content: "The digital leadership program exceeded our expectations. Our executives gained crucial skills that directly translated to improved organizational performance."
    },
    {
      name: "Fatima Al-Hassan", 
      position: "Operations Manager",
      company: "Total Energies",
      image: "FA",
      rating: 5,
      content: "Outstanding consulting services! PANA Academy helped us streamline our processes and achieve 30% efficiency improvement within six months."
    },
    {
      name: "James Okafor",
      position: "CEO",
      company: "TechAdvance Solutions",
      image: "JO", 
      rating: 5,
      content: "The research and development partnership with PANA Academy has been invaluable. Their insights helped us stay ahead of industry trends."
    },
    {
      name: "Aisha Mohammed",
      position: "Project Manager",
      company: "NNPC Limited",
      image: "AM",
      rating: 5,
      content: "Exceptional training quality and professional delivery. The technical excellence program equipped our team with skills that made an immediate impact."
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-pana-navy via-pana-blue to-pana-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Hear from industry leaders who have transformed their organizations through PANA Academy's programs.
          </p>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start space-x-6">
                {/* Quote Icon */}
                <Quote className="w-12 h-12 text-pana-gold flex-shrink-0 mt-2" />
                
                {/* Testimonial Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-pana-gold text-pana-gold" />
                    ))}
                  </div>
                  
                  <blockquote className="text-lg md:text-xl text-white leading-relaxed mb-6">
                    "{testimonials[currentIndex].content}"
                  </blockquote>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pana-gold rounded-full flex items-center justify-center text-pana-navy font-bold">
                      {testimonials[currentIndex].image}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonials[currentIndex].name}</div>
                      <div className="text-gray-300 text-sm">{testimonials[currentIndex].position}</div>
                      <div className="text-pana-gold text-sm font-medium">{testimonials[currentIndex].company}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-2 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex ? 'bg-pana-gold' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Client Logos Grid */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-8">Trusted by Industry Leaders</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-70">
            {['Shell', 'Total', 'Chevron', 'NNPC', 'Access Bank', 'MTN'].map((company, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/20 rounded-lg p-4 h-16 flex items-center justify-center mb-2">
                  <span className="text-white font-semibold text-sm">{company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-4">Join Our Success Stories</h3>
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
            Ready to transform your organization? Let's discuss how PANA Academy can help you achieve your goals.
          </p>
          <Button variant="hero" size="lg">
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;