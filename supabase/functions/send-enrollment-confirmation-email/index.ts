import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EnrollmentRequest {
  courseId: string;
  studentId: string;
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

    const { courseId, studentId }: EnrollmentRequest = await req.json();

    // Get course and student details
    const [courseResult, studentResult] = await Promise.all([
      supabase
        .from('courses')
        .select(`
          title,
          description,
          duration_hours,
          level,
          scheduled_date,
          course_type,
          profiles!courses_instructor_id_fkey (
            full_name
          )
        `)
        .eq('id', courseId)
        .single(),
      supabase
        .from('profiles')
        .select('full_name')
        .eq('id', studentId)
        .single()
    ]);

    if (courseResult.error || studentResult.error) {
      throw new Error('Failed to fetch course or student data');
    }

    const course = courseResult.data;
    const student = studentResult.data;
    const instructor = course.profiles;

    const emailResponse = await resend.emails.send({
      from: "EduPlatform <noreply@resend.dev>",
      to: [`student${studentId}@example.com`], // Replace with actual student email
      subject: `Enrollment Confirmed: ${course.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to Your New Course!</h1>
          <p>Dear ${student.full_name},</p>
          <p>Congratulations! You have successfully enrolled in:</p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; margin: 25px 0;">
            <h2 style="margin: 0 0 15px 0; font-size: 24px;">${course.title}</h2>
            ${course.description ? `<p style="margin: 0 0 15px 0; opacity: 0.9;">${course.description}</p>` : ''}
            <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 20px;">
              ${course.duration_hours ? `<span style="background: rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 6px; font-size: 14px;">📚 ${course.duration_hours} hours</span>` : ''}
              ${course.level ? `<span style="background: rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 6px; font-size: 14px;">🎯 ${course.level}</span>` : ''}
              <span style="background: rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 6px; font-size: 14px;">👨‍🏫 ${instructor.full_name}</span>
            </div>
          </div>
          
          ${course.scheduled_date && course.course_type === 'live' ? `
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #856404;">📅 Scheduled Session</h3>
              <p style="margin: 0; color: #856404;">
                <strong>Date & Time:</strong> ${new Date(course.scheduled_date).toLocaleString()}
              </p>
              <p style="margin: 10px 0 0 0; color: #856404; font-size: 14px;">
                Mark your calendar! You'll receive a reminder before the session starts.
              </p>
            </div>
          ` : `
            <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #0c5460;">🚀 Getting Started</h3>
              <p style="margin: 0; color: #0c5460;">
                This is a self-paced course. You can start learning immediately and progress at your own speed.
              </p>
            </div>
          `}
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Access your course materials in the student dashboard</li>
              <li>Complete lessons and assignments at your own pace</li>
              <li>Engage with course materials and track your progress</li>
              <li>Earn your certificate upon successful completion</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://yourplatform.com/dashboard/student" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Start Learning Now
            </a>
          </div>
          
          <p>We're excited to have you on board and look forward to supporting your learning journey!</p>
          
          <p>Best regards,<br>The EduPlatform Team</p>
        </div>
      `,
    });

    console.log("Enrollment confirmation email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending enrollment confirmation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);