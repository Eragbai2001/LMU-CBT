import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { signInSchema } from "./lib/zod";
import { comparePasswords } from "@/util/password";
import { getUserFromDb, createUserInDb } from "@/lib/getUserFromDb";

// Add this type declaration to extend the user object
declare module "next-auth" {
  interface User {
    role?: "ADMIN" | "USER";
    id?: string;
  }

  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "ADMIN" | "USER";
    id: string;
  }
}

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
            role: user.role ?? "USER", // Include the role from the database
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

      // Get or create user in database
      let dbUser = await getUserFromDb(user.email);

      if (!dbUser && account?.provider === "google") {
        // Determine if the user should be an admin based on the email
        const adminEmails = ["admin2@example.com", "admin3@example.com"];
        const isAdmin = adminEmails.includes(user.email);

        // Create new user
        dbUser = await createUserInDb({
          email: user.email,
          name: user.name ?? "Unknown User",
          password: null, // OAuth users don't have a password
          role: isAdmin ? "ADMIN" : "USER", // Assign role based on email
        });

        // If user creation failed, deny sign-in
        if (!dbUser) {
          console.error("Failed to create user in database");
          return false;
        }
      }

      // Add role to user object to be used in the JWT callback
      if (dbUser) {
        user.role = dbUser.role;
        user.id = dbUser.id;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        // This will run when the user signs in
        token.role = user.role || "USER";
        token.id = user.id ?? "";
      } else if (!token.role) {
        // Fetch the user's role from the database for existing sessions
        const dbUser = await getUserFromDb(token.email as string);
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser.id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // Add role and id to the session
        session.user.role = token.role;
        session.user.id = token.id as string;
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
