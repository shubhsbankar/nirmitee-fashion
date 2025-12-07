// lib/schemas/auth.ts
import { z } from "zod";

/**
 * Password policy:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 */
const PASSWORD_MIN_LENGTH = 8;
const uppercaseRe = /[A-Z]/;
const lowercaseRe = /[a-z]/;
const numberRe = /[0-9]/;
const specialCharRe = /[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~]/;

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, { message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` })
  .superRefine((val, ctx) => {
    if (!uppercaseRe.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least one uppercase letter (A-Z).",
      });
    }
    if (!lowercaseRe.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least one lowercase letter (a-z).",
      });
    }
    if (!numberRe.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least one number (0-9).",
      });
    }
    if (!specialCharRe.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least one special character (e.g. !@#$%).",
      });
    }
  });

export const emailSchema = z.string().email({ message: "Please provide a valid email address." });

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string(), // keep minimal here; can merge with passwordSchema if needed
});

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name cannot exceed 50 characters")
  // .regex(/^[A-Za-z ]+$/, "Name can contain only alphabets and spaces");


/**
 * Signup schema (email, password, confirmPassword)
 * Uses the same password rules and verifies confirmPassword matches password.
 */
export const signupSchema = z
  .object({
    fullName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export const otpStringSchema = z
  .string()
  .regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits." });

export const OTPSchema = z.object({
   email: emailSchema,
   otp: otpStringSchema
});

export const resetPasswordSchema = z
      .object({
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string()
      }).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

  export const mediaEditSchema = z.object({
    _id: z.string().min(3, '_id is required'),
    alt: z.string().min(3, 'alt is required'),
    title: z.string().min(3, '_title is required'),
  });

  export const categorySchema = z.object({
    _id: z.string().min(3, '_id is optional').optional(),
    name: nameSchema,
    slug: z.string().min(3, '_slug is required'),
  });

  export const productSchema = z.object({
    _id: z.string().min(3, '_id is optional').optional(),
    name: nameSchema,
    slug: z.string().min(3, '_slug is required'),
    category: z.string().min(3,'Category is required'),
    mrp: z.union([
      z.number().positive('Expected positive value. Received negative'),
      z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 
                                                      "Please enter valid number")
    ]),
    sellingPrice: z.union([
      z.number().positive('Expected positive value. Received negative'),
      z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 
                                                      "Please enter valid number")
    ]),
    discountPercentage: z.union([
      z.number().positive('Expected positive value. Received negative'),
      z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 
                                                      "Please enter valid number")
    ]),
    description: z.string().min(3,'description is required'),
    media: z.array(z.string()).optional()
  });

  export const productVariantSchema = z.object({
    _id: z.string().min(3, '_id is optional').optional(),
    product: z.string().min(3, 'product is required'),
    stock: z.union([
      z.number().positive('Expected positive value. Received negative'),
      z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 
                                                      "Please enter valid number")
    ]),
    sku:z.string().min(3,'color is required'),
    color: z.string().min(3,'color is required'),
    size: z.string().min(1,'size is required'),
    mrp: z.union([
      z.number().positive('Expected positive value. Received negative'),
      z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 
                                                      "Please enter valid number")
    ]),
    sellingPrice: z.union([
      z.number().positive('Expected positive value. Received negative'),
      z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 
                                                      "Please enter valid number")
    ]),
    discountPercentage: z.union([
      z.number().positive('Expected positive value. Received negative'),
      z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 
                                                      "Please enter valid number")
    ]),
    media: z.array(z.string()).optional()
  });

  export const couponSchema = z.object({
    _id: z.string().min(3, '_id is optional').optional(),
    discountPercentage: z.union([
      z.number().positive('Expected positive value. Received negative'),
      z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 
                                                      "Please enter valid number")
    ]),
    code: z.string().min(3, '_id is optional'),
    validity:z.coerce.date(),
    minShoppingAmount: z.union([
      z.number().positive('Expected positive value. Received negative'),
      z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, 
                                                      "Please enter valid number")
    ]),
  });



/** Types inferred from schemas */
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
export type Otp = z.infer<typeof OTPSchema>;
