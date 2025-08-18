import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  
  const stats = [
    {
      title: 'Total Revenue',
      value: '₦2,847,500',
      change: '+12.3%',
      trend: 'up',
      icon: DollarSign
    },
    {
      title: 'New Users',
      value: '1,247',
      change: '+8.7%',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Course Completions',
      value: '89',
      change: '+23.1%',
      trend: 'up',
      icon: BookOpen
    },
    {
      title: 'Active Sessions',
      value: '456',
      change: '-2.4%',
      trend: 'down',
      icon: Activity
    }
  ];

  const topCourses = [
    { name: 'Introduction to Programming', enrollments: 1234, revenue: '₦487,200' },
    { name: 'Web Development Bootcamp', enrollments: 987, revenue: '₦395,400' },
    { name: 'Data Science Fundamentals', enrollments: 765, revenue: '₦306,000' },
    { name: 'Mobile App Development', enrollments: 543, revenue: '₦217,200' },
    { name: 'UI/UX Design Principles', enrollments: 432, revenue: '₦172,800' }
  ];

  const userActivity = [
    { metric: 'Daily Active Users', value: '2,847', change: '+5.2%' },
    { metric: 'Weekly Active Users', value: '12,456', change: '+8.1%' },
    { metric: 'Monthly Active Users', value: '45,231', change: '+12.7%' },
    { metric: 'Average Session Duration', value: '24m 32s', change: '+3.4%' }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Monitor platform performance and user engagement</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant={stat.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </Badge>
                    <span className="text-xs text-muted-foreground">from last period</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top Performing Courses
              </CardTitle>
              <CardDescription>Based on enrollments and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCourses.map((course, index) => (
                  <div key={course.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{course.name}</p>
                        <p className="text-sm text-muted-foreground">{course.enrollments} enrollments</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{course.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Activity Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                User Activity
              </CardTitle>
              <CardDescription>User engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userActivity.map((activity) => (
                  <div key={activity.metric} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{activity.metric}</p>
                      <p className="text-2xl font-bold">{activity.value}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      {activity.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chart integration coming soon</p>
                <p className="text-sm">Connect with Recharts or Chart.js for detailed visualizations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}