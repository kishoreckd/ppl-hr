import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid work email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

export const signupSchema = loginSchema.extend({
  name: z.string().trim().min(2, 'Enter the employee name.'),
  role: z.enum(['Employee', 'Manager', 'Admin']),
})

export const emailSchema = z.object({
  email: z.string().trim().email('Enter a valid work email.'),
})

export const resetSchema = z.object({
  password: z.string().min(8, 'New password must be at least 8 characters.'),
  token: z.string().trim().min(6, 'Enter the reset token from email.'),
})

export type LoginSchemaType = z.infer<typeof loginSchema>
export type SignupSchemaType = z.infer<typeof signupSchema>
export type EmailSchemaType = z.infer<typeof emailSchema>
export type ResetSchemaType = z.infer<typeof resetSchema>
