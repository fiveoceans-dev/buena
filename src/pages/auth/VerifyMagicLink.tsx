import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';
import { validateMagicLink, getCurrentUser } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';

const VerifyMagicLink = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      const redirectTo = searchParams.get('redirectTo') || '/';

      if (!token) {
        setStatus('error');
        setMessage('No token provided in the URL.');
        return;
      }

      try {
        const result = await validateMagicLink(token);

        if (result.success) {
          setStatus('success');
          setMessage('Successfully signed in! Redirecting...');

          toast({
            title: 'Welcome!',
            description: 'You have been successfully signed in.',
          });

          // Redirect based on user role
          const user = getCurrentUser();
          let redirectPath = '/';

          if (user?.role === 'customer') {
            redirectPath = '/customer/catalog';
          } else if (user?.role === 'admin' || user?.role === 'manager' || user?.role === 'warehouse') {
            redirectPath = '/admin';
          }

          // Redirect after a short delay to show success message
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 2000);
        } else {
          setStatus('error');
          setMessage(result.error || 'Failed to validate magic link.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  const handleRetry = () => {
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'loading' && (
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
          )}

          {status === 'success' && (
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          )}

          {status === 'error' && (
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          )}

          <CardTitle className="text-2xl font-bold text-gray-900">
            {status === 'loading' && 'Verifying magic link'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Verification failed'}
          </CardTitle>

          <CardDescription>
            {status === 'loading' && 'Please wait while we verify your magic link...'}
            {status === 'success' && 'You have been successfully signed in.'}
            {status === 'error' && 'There was a problem verifying your magic link.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {message && (
            <Alert variant={status === 'error' ? 'destructive' : 'default'}>
              {status === 'error' ? (
                <XCircle className="h-4 w-4" />
              ) : status === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Loader2 className="h-4 w-4" />
              )}
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center">
                This could happen if:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• The link has expired (24 hours)</li>
                <li>• The link has already been used</li>
                <li>• There's an issue with the link URL</li>
              </ul>

              <Button onClick={handleRetry} className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Request new magic link
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex justify-center">
              <div className="animate-pulse text-sm text-gray-600">
                This may take a few seconds...
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyMagicLink;

