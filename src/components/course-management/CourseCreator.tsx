import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModuleManager } from './ModuleManager';

interface Course {
  id?: string;
  title: string;
  description: string;
  category: 'technology' | 'business' | 'design' | 'marketing' | 'health' | 'language' | 'personal_development' | 'academic';
  price: number;
  duration_hours: number;
  level: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  thumbnail_url?: string;
  instructor_id: string;
}

export default function CourseCreator() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [courseId, setCourseId] = useState<string | null>(null);
  
  const [course, setCourse] = useState<Course>({
    title: '',
    description: '',
    category: 'technology',
    price: 0,
    duration_hours: 1,
    level: 'beginner',
    status: 'draft',
    thumbnail_url: '',
    instructor_id: user?.id || ''
  });

  const saveCourse = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a course",
        variant: "destructive"
      });
      return;
    }

    if (!course.title.trim()) {
      toast({
        title: "Error",
        description: "Course title is required",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    
    try {
      if (courseId) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({
            title: course.title,
            description: course.description,
            category: course.category,
            price: course.price,
            duration_hours: course.duration_hours,
            level: course.level,
            status: course.status,
            thumbnail_url: course.thumbnail_url
          })
          .eq('id', courseId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Course updated successfully"
        });
      } else {
        // Create new course
        const { data, error } = await supabase
          .from('courses')
          .insert({
            title: course.title,
            description: course.description,
            category: course.category,
            price: course.price,
            duration_hours: course.duration_hours,
            level: course.level,
            status: course.status,
            thumbnail_url: course.thumbnail_url,
            instructor_id: user.id
          })
          .select()
          .single();

        if (error) throw error;
        
        setCourseId(data.id);
        toast({
          title: "Success",
          description: "Course created successfully"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save course",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const canEdit = true; // User is creating/editing their own course

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/courses')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {courseId ? 'Edit Course' : 'Create New Course'}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    {course.category}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={saveCourse}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : courseId ? 'Update' : 'Create Course'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="content" disabled={!courseId}>
              Content & Modules
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic course information and description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Course Title *</label>
                    <Input
                      value={course.title}
                      onChange={(e) => setCourse(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter course title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={course.category}
                      onValueChange={(value: Course['category']) => setCourse(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="language">Language</SelectItem>
                        <SelectItem value="personal_development">Personal Development</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={course.description}
                    onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    placeholder="Describe what students will learn in this course"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price (₦)</label>
                    <Input
                      type="text"
                      value={course.price}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setCourse(prev => ({ ...prev, price: Number(value) || 0 }));
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration (hours)</label>
                    <Input
                      type="number"
                      value={course.duration_hours}
                      onChange={(e) => setCourse(prev => ({ ...prev, duration_hours: Number(e.target.value) }))}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Level</label>
                    <Select
                      value={course.level}
                      onValueChange={(value) => setCourse(prev => ({ ...prev, level: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="all_levels">All Levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            {courseId ? (
              <ModuleManager courseId={courseId} canEdit={canEdit} />
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Save the course details first to add content and modules
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
                <CardDescription>
                  Configure course visibility and additional settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course Status</label>
                  <Select
                    value={course.status}
                    onValueChange={(value: Course['status']) => setCourse(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="review">Under Review</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Thumbnail URL</label>
                  <Input
                    value={course.thumbnail_url}
                    onChange={(e) => setCourse(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}