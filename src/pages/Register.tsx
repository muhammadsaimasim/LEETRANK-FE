import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Trophy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authApi } from '@/api/auth.api.js';
import { registerSchema, type RegisterFormData } from '@/lib/validation';
import { ROUTES, BATCHES } from '@/lib/constants';
import { toast } from 'sonner';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      batch: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await authApi.sendSignupOTP({
        name: data.name,
        email: data.email,
        password: data.password,
        rollno: data.rollno,
        leetcodeUsername: data.leetcodeUsername,
        leetcodeProfileURL: data.leetcodeProfileURL,
        batch: data.batch,
      });
      toast.success('OTP sent to your email! Please verify to complete registration.');
      navigate(ROUTES.VERIFY_OTP, {
        state: { email: data.email, type: 'signup' },
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Trophy className="h-6 w-6" />
            </div>
            LeetRank
          </Link>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground mt-2">Join the leaderboard and start climbing</p>
        </div>

        <div className="rounded-xl border bg-card p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name & Email */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Your Full Name"
                  {...register('name')}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@cloud.neduet.edu.pk"
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
                {/* <p className="text-xs text-muted-foreground">Use your university email (@cloud.neduet.edu.pk)</p> */}
              </div>
            </div>

            {/* Roll Number */}
            <div className="space-y-2">
              <Label htmlFor="rollno">Roll Number</Label>
              <Input
                id="rollno"
                placeholder="e.g. CT-12345"
                {...register('rollno')}
                className={errors.rollno ? 'border-destructive' : ''}
              />
              {errors.rollno && (
                <p className="text-sm text-destructive">{errors.rollno.message}</p>
              )}
              {/* <p className="text-xs text-muted-foreground">Format: CT/AI/DS/CR/GA followed by hyphen and 5 digits</p> */}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* LeetCode Info */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="leetcodeUsername">LeetCode Username</Label>
                <Input
                  id="leetcodeUsername"
                  placeholder="your_username"
                  {...register('leetcodeUsername')}
                  className={errors.leetcodeUsername ? 'border-destructive' : ''}
                />
                {errors.leetcodeUsername && (
                  <p className="text-sm text-destructive">{errors.leetcodeUsername.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="leetcodeProfileURL">LeetCode Profile URL</Label>
                <Input
                  id="leetcodeProfileURL"
                  placeholder="https://leetcode.com/username"
                  {...register('leetcodeProfileURL')}
                  className={errors.leetcodeProfileURL ? 'border-destructive' : ''}
                />
                {errors.leetcodeProfileURL && (
                  <p className="text-sm text-destructive">{errors.leetcodeProfileURL.message}</p>
                )}
              </div>
            </div>

            {/* Batch */}
            <div className="space-y-2">
              <Label>Batch</Label>
              <Select onValueChange={(value) => setValue('batch', value)}>
                <SelectTrigger className={errors.batch ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  {BATCHES.map((batch) => (
                    <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.batch && (
                <p className="text-sm text-destructive">{errors.batch.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
