import { z } from 'zod'

// ── Step 1: Personal Info ──────────────────────────────────────────
export const step1Schema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Only letters, spaces, hyphens and apostrophes'),

  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Only letters, spaces, hyphens and apostrophes'),

  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((val) => {
      const date = new Date(val)
      const now  = new Date()
      const age  = (now - date) / (1000 * 60 * 60 * 24 * 365.25)
      return age >= 13
    }, 'You must be at least 13 years old')
    .refine((val) => {
      const date = new Date(val)
      return date <= new Date()
    }, 'Date cannot be in the future'),
})

// ── Step 2: Account Details ────────────────────────────────────────
export const step2Schema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include at least one uppercase letter')
      .regex(/[0-9]/, 'Must include at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Must include at least one special character'),

    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// ── Combined (for final submission) ───────────────────────────────
export const fullSchema = step1Schema.merge(
  step2Schema.innerType ? step2Schema.innerType() : step2Schema
)
