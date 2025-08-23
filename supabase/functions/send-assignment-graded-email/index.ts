import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GradingRequest {
  submissionId: string;
  score: number;
  feedback?: string;
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

    const { submissionId, score, feedback }: GradingRequest = await req.json();

    // Get submission, assignment, and student details
    const { data: submission, error } = await supabase
      .from('assignment_submissions')
      .select(`
        student_id,
        score,
        feedback,
        assignments (
          title,
          max_score,
          lessons (
            title,
            modules (
              courses (
                title
              )
            )
          )
        ),
        profiles!assignment_submissions_student_id_fkey (
          full_name
        )
      `)
      .eq('id', submissionId)
      .single();

    if (error || !submission) {
      throw new Error('Failed to fetch submission data');
    }

    const assignment = submission.assignments;
    const student = submission.profiles;
    const course = assignment.lessons.modules.courses;
    const percentage = assignment.max_score ? Math.round((score / assignment.max_score) * 100) : 0;

    const getGradeStatus = (percentage: number) => {
      if (percentage >= 90) return { status: 'Excellent', color: '#22c55e' };
      if (percentage >= 80) return { status: 'Good', color: '#3b82f6' };
      if (percentage >= 70) return { status: 'Satisfactory', color: '#f59e0b' };
      return { status: 'Needs Improvement', color: '#ef4444' };
    };

    const gradeInfo = getGradeStatus(percentage);

    const emailResponse = await resend.emails.send({
      from: "EduPlatform <noreply@resend.dev>",
      to: [`student${submission.student_id}@example.com`], // Replace with actual student email
      subject: `Assignment Graded: ${assignment.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Assignment Graded</h1>
          <p>Dear ${student.full_name},</p>
          <p>Your assignment has been graded and feedback is now available.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0;">Grade Summary:</h3>
            <p><strong>Assignment:</strong> ${assignment.title}</p>
            <p><strong>Course:</strong> ${course.title}</p>
            <div style="display: flex; align-items: center; margin: 15px 0;">
              <span style="font-size: 24px; font-weight: bold; margin-right: 10px;">${score}/${assignment.max_score}</span>
              <span style="background: ${gradeInfo.color}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px;">
                ${percentage}% - ${gradeInfo.status}
              </span>
            </div>
          </div>
          
          ${feedback ? `
            <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="margin: 0 0 10px 0; color: #1e40af;">Instructor Feedback:</h3>
              <p style="margin: 0; line-height: 1.6;">${feedback}</p>
            </div>
          ` : ''}
          
          <p>Log in to your dashboard to view detailed feedback and continue your learning journey.</p>
          
          <p>Keep up the great work!</p>
          <p>Best regards,<br>The EduPlatform Team</p>
        </div>
      `,
    });

    console.log("Assignment graded email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending assignment graded email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);