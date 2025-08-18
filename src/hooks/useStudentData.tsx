import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  thumbnail?: string | null;
  lastAccessed?: string;
  isNew?: boolean;
  isTrending?: boolean;
  timeSpent: number;
  category: string;
  totalHours: number;
  image?: string | null;
  instructor_name?: string;
  enrollment_id?: string;
  course_id?: string;
}

interface Stats {
  enrolledCourses: number;
  certificates: number;
  totalProgress: number;
  totalTimeSpent: number;
  weeklyGoalProgress: number;
  completedCourses: number;
  streakDays: number;
}

export function useStudentData() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats>({
    enrolledCourses: 0,
    certificates: 0,
    totalProgress: 0,
    totalTimeSpent: 0,
    weeklyGoalProgress: 75,
    completedCourses: 0,
    streakDays: 5
  });

  useEffect(() => {
    if (!user) return;

    async function fetchStudentData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch enrolled courses with instructor details
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
            id,
            course_id,
            progress_percentage,
            enrolled_at,
            courses (
              id,
              title,
              description,
              category,
              duration_hours,
              thumbnail_url,
              profiles!courses_instructor_id_fkey (
                full_name
              )
            )
          `)
          .eq('student_id', user.id)
          .eq('status', 'enrolled');

        if (enrollmentsError) throw enrollmentsError;

        // Transform enrolled courses data
        const transformedEnrolledCourses: Course[] = (enrollmentsData || []).map((enrollment: any) => ({
          id: enrollment.courses.id,
          course_id: enrollment.course_id,
          enrollment_id: enrollment.id,
          title: enrollment.courses.title,
          instructor: enrollment.courses.profiles?.full_name || 'Unknown Instructor',
          instructor_name: enrollment.courses.profiles?.full_name || 'Unknown Instructor',
          progress: enrollment.progress_percentage || 0,
          thumbnail: enrollment.courses.thumbnail_url,
          lastAccessed: enrollment.enrolled_at,
          timeSpent: Math.floor(Math.random() * 180) + 30, // Mock time spent for now
          category: enrollment.courses.category || 'General',
          totalHours: enrollment.courses.duration_hours || 0,
          image: enrollment.courses.thumbnail_url
        }));

        // Fetch recommended courses (published courses not enrolled in)
        const enrolledCourseIds = transformedEnrolledCourses.map(course => course.course_id);
        
        const { data: recommendedData, error: recommendedError } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            description,
            category,
            duration_hours,
            thumbnail_url,
            profiles!courses_instructor_id_fkey (
              full_name
            )
          `)
          .eq('status', 'published')
          .not('id', 'in', `(${enrolledCourseIds.length > 0 ? enrolledCourseIds.join(',') : 'null'})`)
          .limit(4);

        if (recommendedError) throw recommendedError;

        // Transform recommended courses data
        const transformedRecommendedCourses: Course[] = (recommendedData || []).map((course: any) => ({
          id: course.id,
          title: course.title,
          instructor: course.profiles?.full_name || 'Unknown Instructor',
          instructor_name: course.profiles?.full_name || 'Unknown Instructor',
          progress: 0,
          thumbnail: course.thumbnail_url,
          timeSpent: 0,
          category: course.category || 'General',
          totalHours: course.duration_hours || 0,
          image: course.thumbnail_url,
          isNew: Math.random() > 0.7,
          isTrending: Math.random() > 0.8
        }));

        setEnrolledCourses(transformedEnrolledCourses);
        setRecommendedCourses(transformedRecommendedCourses);
        
        // Calculate stats
        const enrolledCount = transformedEnrolledCourses.length;
        const totalProgress = enrolledCount > 0 
          ? Math.round(transformedEnrolledCourses.reduce((acc, course) => acc + course.progress, 0) / enrolledCount)
          : 0;
        const totalTimeSpent = transformedEnrolledCourses.reduce((acc, course) => acc + course.timeSpent, 0);
        const completedCourses = transformedEnrolledCourses.filter(course => course.progress === 100).length;

        setStats({
          enrolledCourses: enrolledCount,
          certificates: completedCourses,
          totalProgress,
          totalTimeSpent,
          weeklyGoalProgress: 75,
          completedCourses,
          streakDays: 5
        });

      } catch (err) {
        console.error('Error fetching student data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStudentData();
  }, [user]);

  return {
    isLoading,
    error,
    enrolledCourses,
    recommendedCourses,
    stats
  };
}