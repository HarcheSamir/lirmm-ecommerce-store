// src/utils/schemas.js
import { z } from 'zod';

// --- Authentication Schemas ---
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' })
});

// The schema used by the authStore (no UI concerns like confirmPassword)
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
});

// A new schema specifically for the UI registration form
export const uiRegisterSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email format' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
});


// --- Category Schema ---
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Le nom de la catégorie est requis' }),
  slug: z
    .string()
    .optional()
    .refine(value => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), {
      message: 'Le slug ne peut contenir que des lettres minuscules, des chiffres et des traits d\'union',
    }),
  description: z
    .string()
    .optional(),
});

// --- Product Schema ---
export const productSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Le titre du produit est requis' }),
  sku: z
    .string()
    .min(1, { message: 'Le SKU du produit est requis' })
    .refine(value => !/\s/.test(value), {
      message: 'Le SKU ne doit pas contenir d\'espaces',
    }),
  description: z
    .string()
    .optional(),
});

// --- Variant Schema ---
export const variantSchema = z.object({
    sku: z.string().optional().refine(value => !value || !/\s/.test(value), { message: 'Le SKU ne doit pas contenir d\'espaces' }),
    price: z.preprocess(
        (val) => (val === "" ? undefined : parseFloat(String(val))),
        z.number({ invalid_type_error: 'Le prix doit être un nombre' }).positive({ message: 'Le prix doit être positif' })
    ),
    costPrice: z.preprocess(
        (val) => (val === "" ? undefined : parseFloat(String(val))),
        z.number({ invalid_type_error: 'Le prix coûtant doit être un nombre' }).positive({ message: 'Le prix coûtant doit être positif' }).optional().nullable()
    ),
    stockQuantity: z.preprocess(
        (val) => (val === "" ? undefined : parseInt(String(val), 10)),
        z.number({ invalid_type_error: 'La quantité doit être un nombre entier' }).int().nonnegative({ message: 'La quantité ne peutpas être négative' })
    ),
    lowStockThreshold: z.preprocess(
        (val) => (val === "" ? undefined : parseInt(String(val), 10)),
        z.number({ invalid_type_error: 'Le seuil doit être un nombre entier' }).int().nonnegative({ message: 'Le seuil ne peut pas être négatif' }).optional().nullable()
    ),
    attributes: z.record(z.any()).optional(),
});

// --- Checkout Schema ---
export const checkoutSchema = z.object({
  // Contact fields are now mandatory at the component level
  email: z.string().min(1, 'Email is required').email({ message: 'Invalid email address' }),
  phone: z.string().min(1, 'Phone number is required'),
  
  // Guest-only field, optional at schema level
  guestFullName: z.string().min(1, 'Full name is required').optional(),
  
  // Payment and Shipping fields
  paymentMethod: z.enum(['creditCard', 'cashOnDelivery']),
  country: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  address: z.string().optional(),
  apartment: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  cardHolder: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),

}).superRefine((data, ctx) => {
  // This superRefine handles format validation for fields that are present.
  
  if (data.paymentMethod === 'creditCard') {
    if (data.cardHolder && data.cardHolder.trim() === '') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Name on card is required', path: ['cardHolder'] });
    }
    if (data.cardNumber && !/^\d{4} \d{4} \d{4} \d{4}$/.test(data.cardNumber)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid card number format (e.g., 1234 5678 9101 1121)', path: ['cardNumber'] });
    }
    if (data.cardExpiry && !/^(0[1-9]|1[0-2])\s*\/\s*([0-9]{2})$/.test(data.cardExpiry)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid expiry date (MM / YY)', path: ['cardExpiry'] });
    }
    if (data.cardCvc && !/^\d{3,4}$/.test(data.cardCvc)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid CVC (3 or 4 digits)', path: ['cardCvc'] });
    }
  }

  if (data.phone && !/^\+?[0-9\s-]{7,15}$/.test(data.phone)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid phone number format', path: ['phone'] });
  }
});