import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { signInSchema } from "./lib/zod";
import { comparePasswords } from "@/util/password";
import { getUserFromDb, createUserInDb } from "@/lib/getUserFromDb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials) {
            throw new Error("No credentials provided");
          }

          // Validate input
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          // Get user from database
          const user = await getUserFromDb(email);
          if (!user) {
            throw new Error(
              "User not found. Please check your email or sign up."
            );
          }

          // Check if the user was registered via OAuth (no password stored)
          if (!user.password) {
            throw new Error(
              "This email is registered via Google or another OAuth provider. Use that method to log in."
            );
          }

          // Compare password
          const isValidPassword = await comparePasswords(
            password,
            user.password
          );
          if (!isValidPassword) {
            throw new Error("Incorrect password. Please try again.");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? "Unknown User",
          };
        } catch (error) {
          console.error("Authentication error:", error);

          if (error instanceof ZodError) {
            return Promise.reject(
              new Error(
                "Invalid input format. Please enter a valid email and password."
              )
            );
          }

          return Promise.reject(error);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Check domain first
      if (!user.email?.endsWith("@lmu.edu.ng")) {
        console.log("Rejected non-LMU email:", user.email);
        return false;
      }
      const existingUser = await getUserFromDb(user.email);

      if (!existingUser && account?.provider === "google") {
        // Automatically create user if they sign in with Google
        await createUserInDb({
          email: user.email,
          name: user.name ?? "Unknown User",
          password: null, // OAuth users don't have a password
        });
      }

      return true;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
        session.user.email = token.email ?? ""; // ✅ FIXED: Ensure email is always a string
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
});
