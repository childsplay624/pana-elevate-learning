import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  category: string;
  duration_hours: number;
  price: number;
  level: string;
  thumbnail_url: string;
  instructor_name?: string;
  enrolled_count?: number;
}

export default function UpcomingCoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchUpcomingCourses();
  }, []);

  const fetchUpcomingCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          instructor_id,
          category,
          duration_hours,
          price,
          level,
          thumbnail_url,
          profiles!courses_instructor_id_fkey(full_name)
        `)
        .eq('status', 'published')
        .limit(6);

      if (error) throw error;

      const coursesWithInstructor = data?.map(course => ({
        ...course,
        instructor_name: course.profiles?.full_name || 'Unknown Instructor',
        enrolled_count: Math.floor(Math.random() * 150) + 20 // Placeholder enrollment count
      })) || [];

      setCourses(coursesWithInstructor);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to enroll in courses.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          student_id: user.id,
          course_id: courseId,
          status: 'enrolled',
          progress_percentage: 0
        });

      if (error) throw error;

      toast({
        title: "Enrollment Successful",
        description: "You have been enrolled in the course!",
      });
    } catch (error: any) {
      toast({
        title: "Enrollment Failed",
        description: error.message || "Failed to enroll in course.",
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'oil_and_gas': 'bg-primary/10 text-primary',
      'renewable_energy': 'bg-green-500/10 text-green-600',
      'engineering': 'bg-blue-500/10 text-blue-600',
      'safety': 'bg-red-500/10 text-red-600',
      'technology': 'bg-purple-500/10 text-purple-600',
      'leadership': 'bg-orange-500/10 text-orange-600',
    };
    return colors[category as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Upcoming Courses</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our latest professional development programs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-96 animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Upcoming Courses</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our latest professional development programs designed by industry experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20">
              <div className="relative overflow-hidden rounded-t-lg">
                {course.thumbnail_url ? (
                  <img 
                    src={course.thumbnail_url} 
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <div className="text-primary text-6xl opacity-20">📚</div>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge className={getCategoryColor(course.category)}>
                    {course.category.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                {course.level && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">
                      {course.level}
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  by {course.instructor_name}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration_hours}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.enrolled_count} enrolled</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-2xl font-bold text-foreground">
                    {course.price === 0 ? 'Free' : `₦${course.price.toLocaleString()}`}
                  </div>
                  <Button 
                    onClick={() => handleEnroll(course.id)}
                    className="group/btn"
                  >
                    Enroll Now
                    <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="group">
            View All Courses
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}