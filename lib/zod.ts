import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .refine((email) => email.endsWith("@lmu.edu.ng"), {
      message: "Only @lmu.edu.ng emails are allowed",
    }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
