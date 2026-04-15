import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .refine((val) => val.endsWith('@cloud.neduet.edu.pk'), {
      message: 'Only university emails (@cloud.neduet.edu.pk) are allowed',
    }),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  rollno: z
    .string()
    .min(1, 'Roll number is required')
    .regex(/^(CT|AI|DS|CR|GA)-\d{5}$/i, 'Roll number must be in format XX-XXXXX (e.g. CT-12345)'),
  leetcodeUsername: z
    .string()
    .min(1, 'LeetCode username is required')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  leetcodeProfileURL: z
    .string()
    .url('Please enter a valid URL')
    .regex(/leetcode\.com/, 'URL must be a LeetCode profile URL'),
  batch: z.string().min(1, 'Please select your batch'),
  programme: z.string().min(1, 'Please select your programme'),
});

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .optional(),
  batch: z.string().optional(),
  rollno: z
    .string()
    .regex(/^(CT|AI|DS|CR|GA)-\d{5}$/i, 'Roll number must be in format XX-XXXXX (e.g. CT-12345)')
    .optional()
    .or(z.literal('')),
});

export const leetcodeUpdateSchema = z.object({
  leetcodeUsername: z
    .string()
    .min(1, 'LeetCode username is required')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  leetcodeProfileURL: z
    .string()
    .url('Please enter a valid URL')
    .regex(/leetcode\.com/, 'URL must be a LeetCode profile URL'),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
      // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      // .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      // .regex(/[0-9]/, 'Password must contain at least one number')
      // .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required to delete account'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type LeetcodeUpdateFormData = z.infer<typeof leetcodeUpdateSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
