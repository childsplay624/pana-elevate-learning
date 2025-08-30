import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookOpen, Monitor, Users, Award } from "lucide-react";

const TrainingDelivery = () => {
  return (
    <>
      <Helmet>
        <title>Training Delivery | PANA Academy - Excellence in Learning</title>
        <meta name="description" content="Discover PANA Academy's comprehensive training delivery methods, modern technology platforms, and international standard learning environments designed for maximum impact." />
        <meta name="keywords" content="training delivery, learning management system, virtual classroom, training methods, PANA Academy" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pana-navy via-pana-blue to-pana-navy opacity-90"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPgo8L2c+CjwvZz4KPC9zdmc+')]"></div>
            <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-6">
                  <Award className="w-4 h-4" />
                  Excellence in Training Delivery
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                  Training Delivery
                </h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  Innovative methods and approaches designed to maximize learning impact and organizational success through world-class educational experiences
                </p>
              </div>
            </div>
          </section>

          {/* Introduction Section */}
          <section className="py-16 relative">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <div className="max-w-4xl mx-auto bg-white dark:bg-card rounded-2xl shadow-elegant p-8 md:p-12 -mt-16 relative z-10">
                <p className="text-lg text-muted-foreground leading-relaxed text-center">
                  At PANA Academy, training delivery refers to the methods and approaches we use to present learning content and facilitate competency/skill development. We carefully choose our training delivery methods to maximize the impact and effectiveness of our training programs for improved employee performance and organizational success and sustainability.
                </p>
              </div>
            </div>
          </section>

          {/* Training Pillars Grid */}
          <section className="py-16">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Training Methods */}
                <article className="group">
                  <div className="bg-white dark:bg-card rounded-2xl shadow-elegant p-8 h-full transition-all duration-300 hover:shadow-glow hover-scale">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-pana-gold/20 to-pana-gold/10 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-pana-gold" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-pana-gold uppercase tracking-wider">i.</span>
                        <h2 className="text-2xl font-bold text-foreground">Our Training Methods</h2>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Our comprehensive training methods are designed to accommodate different learning styles and professional needs. We employ a blend of traditional and innovative approaches to ensure maximum knowledge retention and practical application.
                    </p>
                  </div>
                </article>

                {/* Training Approach */}
                <article className="group">
                  <div className="bg-white dark:bg-card rounded-2xl shadow-elegant p-8 h-full transition-all duration-300 hover:shadow-glow hover-scale">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-pana-blue/20 to-pana-blue/10 rounded-xl flex items-center justify-center">
                        <Users className="w-8 h-8 text-pana-blue" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-pana-blue uppercase tracking-wider">ii.</span>
                        <h2 className="text-2xl font-bold text-foreground">Our Training Approach</h2>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      We adopt a learner-centered approach that emphasizes practical application, interactive engagement, and continuous assessment. Our methodology ensures that participants can immediately apply their new skills in real-world scenarios.
                    </p>
                  </div>
                </article>

                {/* Training Technology */}
                <article className="group">
                  <div className="bg-white dark:bg-card rounded-2xl shadow-elegant p-8 h-full transition-all duration-300 hover:shadow-glow hover-scale">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-pana-navy/20 to-pana-navy/10 rounded-xl flex items-center justify-center">
                        <Monitor className="w-8 h-8 text-pana-navy" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-pana-navy uppercase tracking-wider">iii.</span>
                        <h2 className="text-2xl font-bold text-foreground">Training Technology & Platforms</h2>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      We use a wide range of modern technologies and digital platforms such as Learning Management Systems (LMS), interactive virtual classrooms, mobile learning applications and physical learning facilities to deliver flexible, accessible, and engaging learning experiences.
                    </p>
                  </div>
                </article>

                {/* Learning Environment */}
                <article className="group">
                  <div className="bg-white dark:bg-card rounded-2xl shadow-elegant p-8 h-full transition-all duration-300 hover:shadow-glow hover-scale">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-pana-gold/20 to-pana-gold/10 rounded-xl flex items-center justify-center">
                        <Award className="w-8 h-8 text-pana-gold" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-pana-gold uppercase tracking-wider">iv.</span>
                        <h2 className="text-2xl font-bold text-foreground">Learning Environment</h2>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        We have both physical and virtual learning environments that are of international standard, designed to facilitate learner engagement such that training delivery aligns with international best practices.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Our training contents are aligned with internationally recognized qualifications, certifications, and industry needs and training sessions are facilitated by experienced and/or certified industry experts.
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <div className="bg-gradient-to-r from-pana-navy to-pana-blue rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPgo8L2c+CjwvZz4KPC9zdmc+')]"></div>
                <div className="relative">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Ready to Experience Our Training Excellence?
                  </h3>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Join thousands of professionals who have transformed their careers through our world-class training delivery methods.
                  </p>
                  <a 
                    href="#contact" 
                    className="inline-flex items-center px-8 py-4 bg-pana-gold text-white font-semibold rounded-xl hover:bg-pana-gold/90 transition-all duration-300 hover-scale shadow-lg"
                  >
                    Get Started Today
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TrainingDelivery;