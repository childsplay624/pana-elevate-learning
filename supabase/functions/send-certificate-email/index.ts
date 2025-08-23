import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CertificateRequest {
  certificateId: string;
  userId: string;
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

    const { certificateId, userId }: CertificateRequest = await req.json();

    // Get certificate and user details
    const [certificateResult, userResult] = await Promise.all([
      supabase
        .from('certificates')
        .select(`
          certificate_number,
          title,
          course_title,
          instructor_name,
          completion_date,
          grade,
          score,
          verification_code,
          course_duration_hours
        `)
        .eq('id', certificateId)
        .single(),
      supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single()
    ]);

    if (certificateResult.error || userResult.error) {
      throw new Error('Failed to fetch certificate or user data');
    }

    const certificate = certificateResult.data;
    const user = userResult.data;

    const emailResponse = await resend.emails.send({
      from: "EduPlatform <noreply@resend.dev>",
      to: [`student${userId}@example.com`], // Replace with actual user email
      subject: `🎉 Certificate Ready: ${certificate.course_title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0 0 10px 0; font-size: 28px;">🎊 Congratulations!</h1>
            <p style="margin: 0; font-size: 18px; opacity: 0.9;">Your certificate is ready!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 18px; margin: 0 0 20px 0;">Dear ${user.full_name},</p>
            
            <p>We're thrilled to announce that you have successfully completed <strong>${certificate.course_title}</strong> and earned your certificate!</p>
            
            <div style="background: white; border: 2px solid #667eea; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
              <div style="border: 3px solid #f0f2f5; border-radius: 8px; padding: 20px; background: linear-gradient(45deg, #f8f9fa 0%, #ffffff 100%);">
                <h2 style="margin: 0 0 15px 0; color: #667eea; font-size: 24px;">Certificate of Completion</h2>
                <h3 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">${certificate.course_title}</h3>
                
                <div style="margin: 20px 0;">
                  <p style="margin: 5px 0; color: #666;"><strong>Recipient:</strong> ${user.full_name}</p>
                  <p style="margin: 5px 0; color: #666;"><strong>Instructor:</strong> ${certificate.instructor_name}</p>
                  <p style="margin: 5px 0; color: #666;"><strong>Completion Date:</strong> ${new Date(certificate.completion_date).toLocaleDateString()}</p>
                  ${certificate.course_duration_hours ? `<p style="margin: 5px 0; color: #666;"><strong>Course Duration:</strong> ${certificate.course_duration_hours} hours</p>` : ''}
                  ${certificate.grade ? `<p style="margin: 5px 0; color: #666;"><strong>Grade:</strong> ${certificate.grade}</p>` : ''}
                </div>
                
                <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0; font-size: 14px; color: #1e40af;">
                    <strong>Certificate #:</strong> ${certificate.certificate_number}<br>
                    <strong>Verification Code:</strong> ${certificate.verification_code}
                  </p>
                </div>
              </div>
            </div>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; color: #155724;">🏆 Achievement Unlocked!</h3>
              <ul style="margin: 0; padding-left: 20px; color: #155724; line-height: 1.8;">
                <li>Successfully completed all course requirements</li>
                <li>Demonstrated mastery of course objectives</li>
                <li>Earned professional development credentials</li>
                <li>Gained valuable skills and knowledge</li>
              </ul>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #856404;">📥 Download & Share</h3>
              <p style="margin: 0; color: #856404;">
                Your certificate is available for download in your dashboard. You can also verify its authenticity using the verification code above on our verification portal.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://yourplatform.com/dashboard/student/certificates" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 15px;">
                Download Certificate
              </a>
              <a href="https://yourplatform.com/verify-certificate" style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Verify Certificate
              </a>
            </div>
            
            <p>Share your achievement on social media and add this credential to your professional profile. We're proud of your dedication and commitment to learning!</p>
            
            <p>Thank you for choosing EduPlatform for your professional development. We look forward to supporting your continued learning journey.</p>
            
            <p style="margin-top: 30px;">Best regards,<br><strong>The EduPlatform Team</strong></p>
          </div>
        </div>
      `,
    });

    console.log("Certificate email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending certificate email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);