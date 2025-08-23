import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReminderRequest {
  courseId: string;
  reminderType: '24h' | '1h' | '15m';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { courseId, reminderType }: ReminderRequest = await req.json();

    // Get course details and enrolled students
    const [courseResult, enrollmentsResult] = await Promise.all([
      supabase
        .from('courses')
        .select(`
          title,
          scheduled_date,
          zoom_meeting_id,
          profiles!courses_instructor_id_fkey (
            full_name
          )
        `)
        .eq('id', courseId)
        .eq('course_type', 'live')
        .single(),
      supabase
        .from('enrollments')
        .select(`
          student_id,
          profiles!enrollments_student_id_fkey (
            full_name
          )
        `)
        .eq('course_id', courseId)
        .eq('status', 'enrolled')
    ]);

    if (courseResult.error || enrollmentsResult.error) {
      throw new Error('Failed to fetch course or enrollment data');
    }

    const course = courseResult.data;
    const enrollments = enrollmentsResult.data;
    const instructor = course.profiles;

    if (!course.scheduled_date) {
      throw new Error('Course has no scheduled date');
    }

    const sessionDate = new Date(course.scheduled_date);
    const now = new Date();
    const timeDiff = sessionDate.getTime() - now.getTime();
    const hoursUntil = Math.round(timeDiff / (1000 * 60 * 60));
    const minutesUntil = Math.round(timeDiff / (1000 * 60));

    const getReminderText = (type: string) => {
      switch (type) {
        case '24h': return { time: '24 hours', urgency: 'info' };
        case '1h': return { time: '1 hour', urgency: 'warning' };
        case '15m': return { time: '15 minutes', urgency: 'urgent' };
        default: return { time: 'soon', urgency: 'info' };
      }
    };

    const reminder = getReminderText(reminderType);
    const urgencyColor = {
      info: '#3b82f6',
      warning: '#f59e0b',
      urgent: '#ef4444'
    }[reminder.urgency];

    // Send emails to all enrolled students
    const emailPromises = enrollments.map(enrollment => {
      const student = enrollment.profiles;
      
      return resend.emails.send({
        from: "EduPlatform <noreply@resend.dev>",
        to: [`student${enrollment.student_id}@example.com`], // Replace with actual student email
        subject: `⏰ Reminder: ${course.title} starts in ${reminder.time}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: ${urgencyColor}; color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">⏰ Session Reminder</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px;">Starting in ${reminder.time}!</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
              <p>Dear ${student.full_name},</p>
              
              <p>This is a friendly reminder that your scheduled session is starting ${reminder.time === '15 minutes' ? 'very soon' : `in ${reminder.time}`}!</p>
              
              <div style="background: white; border: 2px solid ${urgencyColor}; border-radius: 8px; padding: 25px; margin: 25px 0;">
                <h2 style="margin: 0 0 15px 0; color: ${urgencyColor};">${course.title}</h2>
                <div style="display: grid; gap: 10px;">
                  <p style="margin: 0;"><strong>📅 Date & Time:</strong> ${sessionDate.toLocaleString()}</p>
                  <p style="margin: 0;"><strong>👨‍🏫 Instructor:</strong> ${instructor.full_name}</p>
                  ${minutesUntil > 0 
                    ? `<p style="margin: 0;"><strong>⏱️ Time Remaining:</strong> ${hoursUntil > 0 ? `${hoursUntil} hours` : `${minutesUntil} minutes`}</p>`
                    : `<p style="margin: 0; color: ${urgencyColor}; font-weight: bold;">🚨 Session is starting now!</p>`
                  }
                </div>
              </div>
              
              ${course.zoom_meeting_id ? `
                <div style="background: #e7f3ff; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin: 0 0 15px 0; color: #0c5460;">💻 Join Information</h3>
                  <p style="margin: 0 0 10px 0; color: #0c5460;">
                    <strong>Meeting ID:</strong> ${course.zoom_meeting_id}
                  </p>
                  <p style="margin: 0; color: #0c5460; font-size: 14px;">
                    We recommend joining a few minutes early to test your audio and video settings.
                  </p>
                </div>
              ` : ''}
              
              <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #0c5460;">📋 Pre-Session Checklist</h3>
                <ul style="margin: 0; padding-left: 20px; color: #0c5460; line-height: 1.8;">
                  <li>Test your camera and microphone</li>
                  <li>Ensure stable internet connection</li>
                  <li>Have your course materials ready</li>
                  <li>Find a quiet, well-lit space</li>
                  <li>Close unnecessary applications</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://yourplatform.com/dashboard/student" style="background: ${urgencyColor}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Go to Dashboard
                </a>
              </div>
              
              ${reminderType === '15m' 
                ? `<p style="color: ${urgencyColor}; font-weight: bold; text-align: center;">⚠️ This session starts very soon! Please join now to avoid missing the beginning.</p>`
                : `<p>We look forward to seeing you in the session. If you have any technical difficulties, please contact support immediately.</p>`
              }
              
              <p>Best regards,<br>The EduPlatform Team</p>
            </div>
          </div>
        `,
      });
    });

    const emailResults = await Promise.allSettled(emailPromises);
    const successCount = emailResults.filter(result => result.status === 'fulfilled').length;
    const failureCount = emailResults.filter(result => result.status === 'rejected').length;

    console.log(`Session reminder emails sent: ${successCount} successful, ${failureCount} failed`);

    return new Response(JSON.stringify({ 
      success: true, 
      sent: successCount, 
      failed: failureCount 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending session reminder emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);