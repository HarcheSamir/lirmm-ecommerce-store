// src/utils/schemas.js
import { z } from 'zod';

// --- Authentication Schemas (Existing) ---
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email format' }), // Added email validation
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' })
});

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
});

// --- New Category Schema ---
export const categorySchema = z.object({
  // Renamed from 'title' in form to 'name' for API consistency
  name: z
    .string()
    .min(1, { message: 'Le nom de la catégorie est requis' }),
  slug: z
    .string()
    .optional() // Making slug optional as API might generate it or it can be empty
    .refine(value => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), {
      message: 'Le slug ne peut contenir que des lettres minuscules, des chiffres et des traits d\'union',
    }),
  description: z
    .string()
    .optional(),
  // parentId and imageUrl are handled separately, not part of basic form validation here
});

// --- New Product Schema ---
// Validates only the core product fields, not variants/images/categories which are complex objects
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
  // isActive is usually handled by a toggle/checkbox, not typically in schema unless complex logic needed
});

// --- Variant Schema (Optional - useful if editing variants directly later) ---
// This isn't directly used by the main product form validation hook, but useful for reference
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
    attributes: z.record(z.any()).optional(), // Keep attributes flexible for now
});

export const checkoutSchema = z.object({
  // Always required
  email: z.string().email({ message: 'Invalid email address' }),
  paymentMethod: z.enum(['creditCard', 'cashOnDelivery']),

  // Field for guest's name
  guestFullName: z.string().min(1, 'Full name is required').optional(),

  // These fields are now ALL optional at the base level.
  // Their requirement is conditional, defined in the .superRefine below.
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
  // This logic is triggered by a hidden field in the form that tracks the delivery method.
  // We need to access the deliveryMethod from outside the form data.
  // Since we cannot do that directly here, we will handle this in the component.
  // The schema will only validate based on payment method.
  // The component will decide which fields to pass for validation.

  // This part remains correct: Validate card details if it's the chosen method.
  if (data.paymentMethod === 'creditCard') {
    if (!data.cardHolder || data.cardHolder.trim() === '') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Name on card is required', path: ['cardHolder'] });
    }
    if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(data.cardNumber || '')) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid card number format', path: ['cardNumber'] });
    }
    if (!/^(0[1-9]|1[0-2])\s*\/\s*[0-9]{2}$/.test(data.cardExpiry || '')) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid expiry date (MM/YY)', path: ['cardExpiry'] });
    }
    if (!/^\d{3,4}$/.test(data.cardCvc || '')) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid CVC', path: ['cardCvc'] });
    }
  }

  // A different approach is needed for delivery method. Let's adjust the component instead.
});


export const uiRegisterSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email format' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
});