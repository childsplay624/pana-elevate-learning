import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, Award, Globe } from "lucide-react";
import heroImage from "@/assets/hero-training.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Professional training environment" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pana-navy/90 via-pana-navy/70 to-pana-blue/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-white space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Empowering Talent
                <span className="block text-pana-gold">Across Sectors</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-lg">
                Transform your career with world-class training, consulting, and certification programs designed for today's professionals.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-pana-gold/20 rounded-lg mb-2">
                  <Users className="w-6 h-6 text-pana-gold" />
                </div>
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm text-gray-300">Professionals Trained</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-pana-gold/20 rounded-lg mb-2">
                  <Award className="w-6 h-6 text-pana-gold" />
                </div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-gray-300">Certifications Issued</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-pana-gold/20 rounded-lg mb-2">
                  <Globe className="w-6 h-6 text-pana-gold" />
                </div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-gray-300">Corporate Partners</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group">
                Explore Programs
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-white/20">
              <p className="text-sm text-gray-300 mb-4">Trusted by industry leaders</p>
              <div className="flex items-center space-x-6 opacity-70">
                <div className="text-sm font-medium">Shell</div>
                <div className="text-sm font-medium">Total</div>
                <div className="text-sm font-medium">Chevron</div>
                <div className="text-sm font-medium">NNPC</div>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6 animate-slide-in-right">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-3">Energy Sector Excellence</h3>
              <p className="text-gray-200 mb-4">Specialized training in oil & gas, renewable energy, and technical operations.</p>
              <Button variant="outline" size="sm" className="bg-transparent border-pana-gold text-pana-gold hover:bg-pana-gold hover:text-pana-navy">
                Learn More
              </Button>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-3">Digital Transformation</h3>
              <p className="text-gray-200 mb-4">Stay ahead with cutting-edge digital skills and technology leadership.</p>
              <Button variant="outline" size="sm" className="bg-transparent border-pana-gold text-pana-gold hover:bg-pana-gold hover:text-pana-navy">
                Learn More
              </Button>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-3">Leadership Development</h3>
              <p className="text-gray-200 mb-4">Build exceptional leadership skills for the modern workplace.</p>
              <Button variant="outline" size="sm" className="bg-transparent border-pana-gold text-pana-gold hover:bg-pana-gold hover:text-pana-navy">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-10 w-20 h-20 bg-pana-gold/20 rounded-full animate-float hidden lg:block"></div>
      <div className="absolute bottom-1/4 left-10 w-16 h-16 bg-pana-blue/20 rounded-full animate-float animation-delay-1000 hidden lg:block"></div>
    </section>
  );
};

export default HeroSection;