import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'], 
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email').min(1, 'email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').min(1, 'password is required'),
});