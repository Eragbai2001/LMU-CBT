import { z } from "zod";

// Password validation: Mid-level strength
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(32, "Password must not exceed 32 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one digit")
  .regex(/[\W_]/, "Password must contain at least one special character");

export const signInSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .refine((email) => email.endsWith("@lmu.edu.ng"), {
      message: "Only @lmu.edu.ng emails are allowed",
    }),
  password: passwordSchema,
});

export const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z
    .string()
    .email("Invalid email format")
    .refine((email) => email.endsWith("@lmu.edu.ng"), {
      message: "Only @lmu.edu.ng emails are allowed",
    }),
  password: passwordSchema,
});

// Reset Password Validation Schema
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z
    .string()
    .min(8, "Confirm Password must be at least 8 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
