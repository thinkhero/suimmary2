'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Mail, Lock, User, Chrome } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSendCode = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsCodeSent(true);
      setIsLoading(false);
      toast.success('Verification code sent to your email!');
    }, 1000);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    // Simulate verification
    setTimeout(() => {
      login({
        id: '1',
        email,
        name: email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      });
      setIsLoading(false);
      toast.success('Successfully signed in!');
      onClose();
    }, 1000);
  };

  const handleGoogleAuth = () => {
    // Simulate Google OAuth
    toast.success('Google sign-in coming soon!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to unlock your full quota and save history</p>
          </div>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              {!isCodeSent ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 py-3 rounded-xl"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSendCode}
                    disabled={isLoading || !email}
                    className="w-full bg-gradient-primary hover:opacity-90 text-white py-3 rounded-xl"
                  >
                    {isLoading ? 'Sending...' : 'Send Verification Code'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-700">
                      We sent a verification code to <strong>{email}</strong>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Verification Code</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="pl-10 py-3 rounded-xl text-center tracking-widest"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleVerifyCode}
                    disabled={isLoading || verificationCode.length !== 6}
                    className="w-full bg-gradient-primary hover:opacity-90 text-white py-3 rounded-xl"
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setIsCodeSent(false)}
                    className="w-full text-sm text-gray-600"
                  >
                    Back to email entry
                  </Button>
                </>
              )}
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <Button
                onClick={handleGoogleAuth}
                variant="outline"
                className="w-full py-3 rounded-xl border-2"
              >
                <Chrome className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>

              <div className="text-center text-sm text-gray-500">
                More authentication methods coming soon
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold text-gray-900">Free Account</div>
                <div className="text-gray-500">50 summaries/day</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Premium</div>
                <div className="text-gray-500">Unlimited access</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}