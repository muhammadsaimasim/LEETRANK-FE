import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/api/auth.api.js';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken } = useAuth();

  const type: 'signup' | 'forgot-password' = location.state?.type || 'signup';
  const email: string = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      navigate(type === 'signup' ? ROUTES.REGISTER : ROUTES.FORGOT_PASSWORD, { replace: true });
    }
  }, [email, navigate, type]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      if (type === 'signup') {
        const response = await authApi.verifySignupOTP(email, otpString);
        loginWithToken(response.token, response.user);
        toast.success('Account created successfully!');
        navigate(ROUTES.LEADERBOARD, { replace: true });
      } else {
        const response = await authApi.verifyForgotPasswordOTP(email, otpString);
        toast.success('OTP verified! Set your new password.');
        navigate(ROUTES.RESET_PASSWORD, {
          replace: true,
          state: { resetToken: response.resetToken, email },
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      if (type === 'signup') {
        // Re-send OTP via the resend endpoint
        const response = await fetch(
          `${(await import('@/Environment/env.js')).BASE_URL}/otp/resend`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, type: 'signup' }),
          }
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || 'Failed to resend');
      } else {
        await authApi.sendForgotPasswordOTP(email);
      }
      toast.success('A new OTP has been sent to your email');
      setCooldown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  const title = type === 'signup' ? 'Verify Your Email' : 'Verify OTP';
  const subtitle = `We've sent a 6-digit code to ${email}`;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pattern-grid opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary mb-5">
            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground text-sm">{subtitle}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-14 text-center text-xl font-bold"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || cooldown > 0}
                className="font-medium text-primary hover:underline underline-offset-4 disabled:opacity-50 disabled:no-underline"
              >
                {cooldown > 0 ? (
                  `Resend in ${cooldown}s`
                ) : isResending ? (
                  <span className="inline-flex items-center gap-1">
                    <RefreshCw className="h-3 w-3 animate-spin" /> Sending...
                  </span>
                ) : (
                  'Resend OTP'
                )}
              </button>
            </p>
            <Link
              to={type === 'signup' ? ROUTES.REGISTER : ROUTES.FORGOT_PASSWORD}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Go back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
