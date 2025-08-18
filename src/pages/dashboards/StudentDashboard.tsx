import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStudentData } from '@/hooks/useStudentData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Award, Calendar, Clock, TrendingUp, 
  AlertCircle, Info, Target, CheckCircle, ChevronRight, 
  Plus, Trophy, RefreshCw, FileText, Video, FileCode, 
  AlertTriangle, Download, Play, Code 
} from 'lucide-react';
import { CourseCard } from '@/components/dashboard/CourseCard';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { CourseProgressChart } from '@/components/dashboard/CourseProgressChart';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Define interfaces for our data models
interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

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
  [key: string]: any;
}

// Type guard to check if stats has all required properties
function isCompleteStats(stats: any): stats is Stats {
  return (
    stats &&
    typeof stats.enrolledCourses === 'number' &&
    typeof stats.certificates === 'number' &&
    typeof stats.totalProgress === 'number' &&
    typeof stats.totalTimeSpent === 'number' &&
    typeof stats.weeklyGoalProgress === 'number' &&
    typeof stats.completedCourses === 'number' &&
    typeof stats.streakDays === 'number'
  );
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

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  description: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  tooltip?: string;
  isLoading?: boolean;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  tooltip,
  isLoading = false,
  className = ''
}) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        {title}
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </CardTitle>
      <div className="h-4 w-4 text-muted-foreground">
        <Icon />
      </div>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-24 mb-1" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
      <p className="text-xs text-muted-foreground">
        {isLoading ? <Skeleton className="h-4 w-32 mt-1" /> : description}
      </p>
    </CardContent>
  </Card>
);

const DashboardError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="p-3 bg-red-50 rounded-full mb-4">
      <AlertCircle className="h-8 w-8 text-red-500" />
    </div>
    <h3 className="text-lg font-semibold mb-2">Failed to load dashboard</h3>
    <p className="text-muted-foreground mb-6 max-w-md">
      We couldn't load your dashboard data. Please check your connection and try again.
    </p>
    <Button onClick={onRetry} variant="outline">
      Retry
    </Button>
  </div>
);

export default function StudentDashboard() {
  const { profile, signOut } = useAuth();
  const { 
    isLoading, 
    error, 
    enrolledCourses = [], 
    recommendedCourses = [], 
    stats: rawStats = {
      enrolledCourses: 0,
      certificates: 0,
      totalProgress: 0,
      totalTimeSpent: 0
    }
  } = useStudentData();

  // Ensure stats has all required properties with default values
  const stats: Stats = isCompleteStats(rawStats) 
    ? rawStats 
    : {
        ...rawStats,
        weeklyGoalProgress: 0,
        completedCourses: 0,
        streakDays: 0
      };
  
  const userProfile = profile as UserProfile | null;
  const [retryCount, setRetryCount] = useState(0);
  const handleRetry = () => setRetryCount(prev => prev + 1);

  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <DashboardError onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary 
      fallback={
        <div className="min-h-screen bg-background flex">
          <Sidebar />
          <div className="flex-1 p-8 flex items-center justify-center">
            <DashboardError onRetry={() => window.location.reload()} />
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="border-b pb-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, {userProfile?.first_name || userProfile?.full_name || 'Student'}!
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {isLoading ? (
                      <Skeleton className="h-5 w-64 inline-block" />
                    ) : (
                      'Here\'s what\'s happening with your learning today.'
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={signOut}>
                        Sign Out
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sign out of your account</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <TooltipProvider>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Enrolled Courses"
                  value={stats.enrolledCourses}
                  description={
                    stats.enrolledCourses === 0 
                      ? 'Start your learning journey' 
                      : `${stats.enrolledCourses} active ${stats.enrolledCourses === 1 ? 'course' : 'courses'}`
                  }
                  icon={BookOpen}
                  tooltip="Number of courses you're currently enrolled in"
                  isLoading={isLoading}
                />

                <StatCard
                  title="Certificates"
                  value={stats.certificates}
                  description={
                    stats.certificates === 0
                      ? 'Complete courses to earn certificates'
                      : `${stats.certificates} earned`
                  }
                  icon={Award}
                  tooltip="Certificates earned from completed courses"
                  isLoading={isLoading}
                />

                <StatCard
                  title="Learning Progress"
                  value={`${stats.totalProgress}%`}
                  description={
                    <div className="mt-1">
                      <Progress value={stats.totalProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Overall completion rate
                      </p>
                    </div>
                  }
                  icon={TrendingUp}
                  tooltip="Your overall learning progress across all courses"
                  isLoading={isLoading}
                />

                <StatCard
                  title="Time Spent"
                  value={`${Math.floor((stats.totalTimeSpent || 0) / 60)}h ${(stats.totalTimeSpent || 0) % 60}m`}
                  description={
                    (stats.totalTimeSpent || 0) === 0
                      ? 'Start learning to track time'
                      : 'Total learning time this month'
                  }
                  icon={Clock}
                  tooltip="Total time spent learning this month"
                  isLoading={isLoading}
                />
              </div>

              {/* Data Visualization */}
              <div className="grid grid-cols-1 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Study Progress</CardTitle>
                    <CardDescription>Your learning activity over the past week</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px] w-full">
                    <ProgressChart isLoading={isLoading} />
                  </CardContent>
                </Card>
              </div>

              {/* Course Progress Section */}
              <div className="grid grid-cols-1 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Progress</CardTitle>
                    <CardDescription>Your progress across all enrolled courses</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[500px] w-full">
                    <CourseProgressChart 
                      data={enrolledCourses.map(course => ({
                        name: course.title,
                        value: course.progress,
                        color: '#0088FE'
                      }))} 
                      isLoading={isLoading} 
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Recommended Courses */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Recommended For You</h2>
                    <p className="text-muted-foreground text-sm">
                      {isLoading ? (
                        <Skeleton className="h-4 w-64 inline-block" />
                      ) : (
                        'Courses we think you\'ll love based on your interests'
                      )}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="h-40 w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : recommendedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {recommendedCourses.slice(0, 4).map((course) => (
                      <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        instructor={course.instructor}
                        progress={course.progress}
                        thumbnail={course.thumbnail || course.image}
                        lastAccessed={course.lastAccessed}
                        className="h-full"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md px-4">
                      Complete some courses or update your interests to get personalized recommendations.
                    </p>
                    <Button>Update Interests</Button>
                  </div>
                )}
              </div>
            </TooltipProvider>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}