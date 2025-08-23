import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubmissionRequest {
  assignmentId: string;
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

    const { assignmentId, studentId }: SubmissionRequest = await req.json();

    // Get assignment and student details
    const [assignmentResult, studentResult] = await Promise.all([
      supabase
        .from('assignments')
        .select(`
          title,
          due_date,
          lessons (
            title,
            modules (
              course_id,
              courses (
                title,
                instructor_id
              )
            )
          )
        `)
        .eq('id', assignmentId)
        .single(),
      supabase
        .from('profiles')
        .select('full_name')
        .eq('id', studentId)
        .single()
    ]);

    if (assignmentResult.error || studentResult.error) {
      throw new Error('Failed to fetch assignment or student data');
    }

    const assignment = assignmentResult.data;
    const student = studentResult.data;
    const course = assignment.lessons.modules.courses;

    const emailResponse = await resend.emails.send({
      from: "EduPlatform <noreply@resend.dev>",
      to: [`student${studentId}@example.com`], // Replace with actual student email
      subject: `Assignment Submitted: ${assignment.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Assignment Submission Confirmed</h1>
          <p>Dear ${student.full_name},</p>
          <p>Your assignment has been successfully submitted!</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">Assignment Details:</h3>
            <p><strong>Assignment:</strong> ${assignment.title}</p>
            <p><strong>Course:</strong> ${course.title}</p>
            ${assignment.due_date ? `<p><strong>Due Date:</strong> ${new Date(assignment.due_date).toLocaleDateString()}</p>` : ''}
            <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <p>Your instructor will review your submission and provide feedback. You'll receive another email when your assignment has been graded.</p>
          
          <p>Thank you for your hard work!</p>
          <p>Best regards,<br>The EduPlatform Team</p>
        </div>
      `,
    });

    console.log("Assignment submission email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending assignment submission email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);