"use server";

import { z } from "zod";
import { signIn } from "@/auth";
import { getUserFromDb } from "@/lib/getUserFromDb";
import { comparePasswords } from "@/util/password";

// Zod Schema for validation
const authSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .refine((email) => email.endsWith("@lmu.edu.ng"), {
      message: "Only @lmu.edu.ng emails are allowed",
    }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

interface SignInResponse {
  error?: string;
  // Add other properties that the signIn function might return
}

export async function handleLogin(formData: FormData): Promise<SignInResponse> {
    // Type-safe extraction of form data
    const emailValue = formData.get('email');
    const passwordValue = formData.get('password');
    
    // Check if values exist and are strings
    if (!emailValue || !passwordValue) {
      throw new Error("Email and password are required");
    }
    
    const email = emailValue.toString();
    const password = passwordValue.toString();
    
    // Validate with Zod
    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      throw new Error(validation.error.errors[0].message);
    }
    
    try {
      // First, check if user exists without trying to sign in
      const userExists = await getUserFromDb(email);
      
      if (!userExists) {
        throw new Error("User not found. Please check your email or sign up.");
      }
      
      // At this point, we know the user exists, but before attempting to sign in,
      // let's check the password directly
      
      // Get the full user object to access the password hash
      const user = await getUserFromDb(email);
      
      // Assuming you have a function to compare passwords
      if (!user) {
        throw new Error("User not found. Please check your email or sign up.");
      }
      const isValidPassword = user.password && await comparePasswords(password, user.password);
      
      if (!isValidPassword) {
        throw new Error("Incorrect password. Please try again.");
      }
      
      // If we get here, both user exists and password is correct, so sign in should succeed
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      
      return res;
    } catch (error) {
      console.error("Login error:", error);
      
      // If it's our custom error, pass it through
      if (error instanceof Error) {
        throw error;
      }
      
      // For any other unexpected errors
      throw new Error("Authentication failed. Please try again.");
    }
  }
