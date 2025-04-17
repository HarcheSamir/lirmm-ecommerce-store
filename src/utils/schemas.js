// src/utils/schemas.js
import { z } from 'zod'

// Login form schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' })
})

// Registration form schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .min(2, { message: 'Name must be at least 2 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'Confirm password is required' })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Book form schema
export const bookSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be 100 characters or less' }),
  description: z
    .string()
    .max(500, { message: 'Description must be 500 characters or less' })
    .optional()
    .nullable(),
  author: z
    .string()
    .min(1, { message: 'Author is required' })
    .max(100, { message: 'Author must be 100 characters or less' }),
  publishedAt: z
    .string()
    .optional()
    .nullable()
    .refine(val => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid date format'
    })
})