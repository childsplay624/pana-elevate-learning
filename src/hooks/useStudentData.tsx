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

        // Fetch enrolled courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .limit(10);

        if (coursesError) throw coursesError;

        // Mock enrolled courses data
        const mockEnrolledCourses: Course[] = [
          {
            id: '1',
            title: 'React Fundamentals',
            instructor: 'John Doe',
            progress: 65,
            thumbnail: null,
            lastAccessed: '2024-01-15',
            timeSpent: 120,
            category: 'Frontend',
            totalHours: 40
          },
          {
            id: '2',
            title: 'Advanced TypeScript',
            instructor: 'Jane Smith',
            progress: 30,
            thumbnail: null,
            lastAccessed: '2024-01-14',
            timeSpent: 80,
            category: 'Programming',
            totalHours: 35
          }
        ];

        // Mock recommended courses
        const mockRecommendedCourses: Course[] = [
          {
            id: '3',
            title: 'Node.js Backend Development',
            instructor: 'Mike Johnson',
            progress: 0,
            thumbnail: null,
            timeSpent: 0,
            category: 'Backend',
            totalHours: 50,
            isNew: true
          },
          {
            id: '4',
            title: 'Database Design',
            instructor: 'Sarah Wilson',
            progress: 0,
            thumbnail: null,
            timeSpent: 0,
            category: 'Database',
            totalHours: 30,
            isTrending: true
          }
        ];

        setEnrolledCourses(mockEnrolledCourses);
        setRecommendedCourses(mockRecommendedCourses);
        
        // Calculate stats
        const enrolledCount = mockEnrolledCourses.length;
        const totalProgress = enrolledCount > 0 
          ? Math.round(mockEnrolledCourses.reduce((acc, course) => acc + course.progress, 0) / enrolledCount)
          : 0;
        const totalTimeSpent = mockEnrolledCourses.reduce((acc, course) => acc + course.timeSpent, 0);
        const completedCourses = mockEnrolledCourses.filter(course => course.progress === 100).length;

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