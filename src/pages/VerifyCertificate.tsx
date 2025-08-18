import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  ShieldCheck, 
  ShieldX, 
  Search, 
  Award,
  Calendar,
  User,
  Clock,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useCertificates, Certificate } from '@/hooks/useCertificates';
import { toast } from 'sonner';

export default function VerifyCertificate() {
  const [searchParams] = useSearchParams();
  const [verificationCode, setVerificationCode] = useState('');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { verifyCertificate } = useCertificates();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setVerificationCode(code);
      handleVerification(code);
    }
  }, [searchParams]);

  const handleVerification = async (code?: string) => {
    const codeToVerify = code || verificationCode;
    if (!codeToVerify.trim()) {
      toast.error('Please enter a verification code');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const result = await verifyCertificate(codeToVerify.trim());
      setCertificate(result);
      toast.success('Certificate verified successfully');
    } catch (error: any) {
      setCertificate(null);
      toast.error(error.message || 'Certificate verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerification();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <ShieldCheck className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Certificate Verification</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Verify the authenticity of certificates issued by our platform. 
            Enter the verification code to see detailed certificate information.
          </p>
        </div>

        {/* Verification Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Verify Certificate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter verification code (e.g., ABC12345-DEF6-789G)"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={() => handleVerification()}
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              The verification code can be found on the certificate document.
            </p>
          </CardContent>
        </Card>

        {/* Verification Results */}
        {hasSearched && (
          <div className="max-w-4xl mx-auto">
            {certificate ? (
              <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <ShieldCheck className="h-6 w-6" />
                    Certificate Verified Successfully
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Certificate Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Certificate Information
                        </h3>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">Title:</span>
                            <p className="text-muted-foreground">{certificate.title}</p>
                          </div>
                          <div>
                            <span className="font-medium">Course:</span>
                            <p className="text-muted-foreground">{certificate.course_title}</p>
                          </div>
                          <div>
                            <span className="font-medium">Certificate Number:</span>
                            <p className="text-muted-foreground font-mono">{certificate.certificate_number}</p>
                          </div>
                          {certificate.description && (
                            <div>
                              <span className="font-medium">Description:</span>
                              <p className="text-muted-foreground text-sm">{certificate.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Course Details
                        </h3>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">Instructor:</span>
                            <p className="text-muted-foreground">{certificate.instructor_name}</p>
                          </div>
                          {certificate.course_duration_hours && (
                            <div>
                              <span className="font-medium">Duration:</span>
                              <p className="text-muted-foreground">{certificate.course_duration_hours} hours</p>
                            </div>
                          )}
                          {certificate.grade && (
                            <div>
                              <span className="font-medium">Grade:</span>
                              <p className="text-muted-foreground">{certificate.grade}</p>
                            </div>
                          )}
                          {certificate.score && (
                            <div>
                              <span className="font-medium">Score:</span>
                              <p className="text-muted-foreground">{certificate.score}%</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Dates and Verification */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Completion Date</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(certificate.completion_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Issue Date</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(certificate.issued_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Verification Code</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {certificate.verification_code}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={() => window.print()}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Print Certificate Details
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const url = window.location.href;
                        navigator.clipboard.writeText(url);
                        toast.success('Verification link copied to clipboard');
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Share Verification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <ShieldX className="h-6 w-6" />
                    Certificate Not Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The verification code you entered is either invalid, expired, or the certificate 
                    has been revoked. Please check the code and try again.
                  </p>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-2">Common issues:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Verification code was entered incorrectly</li>
                      <li>• Certificate has been revoked or expired</li>
                      <li>• Code is from a different verification system</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}