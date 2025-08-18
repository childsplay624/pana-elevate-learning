import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Award, Calendar, Clock, TrendingUp, 
  AlertCircle, Info, Target, CheckCircle, ChevronRight, 
  Plus, Trophy, RefreshCw, FileText, Video, FileCode, 
  AlertTriangle, Download, Play, Code 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DashboardLayout } from '@/components/DashboardLayout';

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
  image?: string | null; // Alias for thumbnail
  [key: string]: any; // Allow additional properties
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
  const { profile } = useAuth();
  
  // Mock data for demonstration
  const isLoading = false;
  const error = false;
  const enrolledCourses: Course[] = [];
  const recommendedCourses: Course[] = [];
  const rawStats = {
    enrolledCourses: 0,
    certificates: 0,
    totalProgress: 0,
    totalTimeSpent: 0
  };

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
                      <Card key={course.id} className="h-full">
                        <CardContent className="p-4">
                          <h3 className="font-medium">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">{course.instructor}</p>
                          <Progress value={course.progress} className="mt-2" />
                        </CardContent>
                      </Card>
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

          {/* Quick Actions */}
          <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <BookOpen className="h-6 w-6 text-blue-500" />
                    <span className="text-sm font-medium">Continue Learning</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <Plus className="h-6 w-6 text-green-500" />
                    <span className="text-sm font-medium">New Course</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <Award className="h-6 w-6 text-amber-500" />
                    <span className="text-sm font-medium">My Certificates</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <Calendar className="h-6 w-6 text-purple-500" />
                    <span className="text-sm font-medium">Study Schedule</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <Target className="h-6 w-6 text-red-500" />
                    <span className="text-sm font-medium">Set Goals</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <TrendingUp className="h-6 w-6 text-emerald-500" />
                    <span className="text-sm font-medium">Progress Report</span>
                  </Button>
                </div>
          </div>

          {/* Learning Resources */}
          <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Learning Resources</h2>
                    <p className="text-muted-foreground text-sm">
                      {isLoading ? (
                        <Skeleton className="h-4 w-64 inline-block" />
                      ) : (
                        'Recommended resources to enhance your learning'
                      )}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Resource Card 1 */}
                  <Card className="group hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <Badge variant="outline" className="text-xs">PDF</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                        Complete Guide to React Hooks
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        Master React Hooks with this comprehensive guide covering all the essential hooks and patterns.
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>2.4 MB</span>
                        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resource Card 2 */}
                  <Card className="group hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <Badge variant="outline" className="text-xs">Video</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                        TypeScript Crash Course
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        Learn TypeScript fundamentals and advanced patterns in this comprehensive video tutorial.
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>45 min</span>
                        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
                          <Play className="h-3.5 w-3.5" />
                          Watch Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resource Card 3 */}
                  <Card className="group hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                          <FileCode className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <Badge variant="outline" className="text-xs">Code</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                        React Performance Optimization
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        Code examples and patterns for optimizing React application performance.
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>12 files</span>
                        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
                          <Code className="h-3.5 w-3.5" />
                          View Code
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resource Card 4 */}
                  <Card className="group hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                          <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <Badge variant="outline" className="text-xs">Article</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                        State Management in 2023
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        Comparing different state management solutions for modern React applications.
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>8 min read</span>
                        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
                          <BookOpen className="h-3.5 w-3.5" />
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Study Goals */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Study Goals</CardTitle>
                        <CardDescription>Track your learning objectives and milestones</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary">
                        <Plus className="mr-1 h-4 w-4" /> New Goal
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">Weekly Learning Time</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {isLoading ? (
                              <Skeleton className="h-4 w-16 inline-block" />
                            ) : (
                              `${stats.weeklyGoalProgress}% of 5h`
                            )}
                          </span>
                        </div>
                        <Progress 
                          value={stats.weeklyGoalProgress} 
                          className="h-2 bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="font-medium">Course Completion</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {isLoading ? (
                              <Skeleton className="h-4 w-16 inline-block" />
                            ) : (
                              `${stats.completedCourses} of ${stats.enrolledCourses} courses`
                            )}
                          </span>
                        </div>
                        <Progress 
                          value={stats.enrolledCourses ? (stats.completedCourses / stats.enrolledCourses) * 100 : 0} 
                          className="h-2 bg-muted"
                        />
                      </div>

                      <div className="pt-2">
                        <Button variant="outline" className="w-full">
                          View All Goals <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-950/50 border-blue-200 dark:border-blue-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      Weekly Streak
                    </CardTitle>
                    <CardDescription>Keep your learning streak going!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold mb-2">
                        {isLoading ? (
                          <Skeleton className="h-10 w-16 mx-auto" />
                        ) : (
                          `🔥 ${stats.streakDays}`
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {isLoading ? (
                          <Skeleton className="h-4 w-32 mx-auto mt-1" />
                        ) : stats.streakDays > 0 ? (
                          `${stats.streakDays}-day streak! Keep it up!`
                        ) : (
                          'Start a new learning streak today!'
                        )}
                      </p>
                      <Button variant="outline" className="mt-4" size="sm">
                        View Calendar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
                    <p className="text-muted-foreground text-sm">
                      {isLoading ? (
                        <Skeleton className="h-4 w-64 inline-block" />
                      ) : (
                        'Your latest learning activities and achievements'
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">View Calendar</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <RefreshCw className="h-4 w-4" />
                      <span className="sr-only">Refresh</span>
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your recent learning activities and progress</CardDescription>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Activity information</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>This shows your recent learning activities and progress updates.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {Array(3).fill(0).map((_, i) => (
                          <div key={i} className="flex items-start space-x-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : enrolledCourses.length > 0 ? (
                      <div className="space-y-4">
                        {enrolledCourses.slice(0, 5).map((course) => (
                          <div 
                            key={course.id} 
                            className="flex items-start space-x-4 p-3 hover:bg-muted/50 rounded-lg transition-colors"
                            aria-label={`Activity for ${course.title}`}
                          >
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">
                                You're making progress in <span className="text-primary">{course.title}</span>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {course.progress}% complete • Last accessed {course.lastAccessed || 'recently'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
                        <p className="text-muted-foreground mb-4">
                          Your learning activity will appear here once you start your courses.
                        </p>
                        <Button>Explore Courses</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
        </TooltipProvider>
      </div>
    </DashboardLayout>
  );
}
