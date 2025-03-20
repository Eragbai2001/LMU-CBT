    import NextAuth from "next-auth";
    import Google from "next-auth/providers/google";
    import CredentialsProvider from "next-auth/providers/credentials";
    import { ZodError } from "zod";
    import { signInSchema } from "./lib/zod";
    import { saltAndHashPassword } from "@/utils/password";
    import { getUserFromDb } from "@/lib/db";
    
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
              const { email, password } = await signInSchema.parseAsync(credentials);
    
              // logic to salt and hash password
              const pwHash = saltAndHashPassword(password);
    
              // logic to verify if the user exists
              const user = await getUserFromDb(email, pwHash);
    
              if (!user) {
                throw new Error("Invalid credentials.");
              }
    
              // return JSON object with the user data
              return user;
            } catch (error) {
              if (error instanceof ZodError) {
                // Return `null` to indicate that the credentials are invalid
                return null;
              }
              throw error;
            }
          },
        }),
      ],
      callbacks: {
        async signIn({ user }) {
          if (!user.email?.endsWith("@lmu.edu.ng")) {
            return false; // Reject sign-in if not LMU email
          }
          return true;
        },
        async session({ session, token }) {
          if (session?.user) {
            session.user.id = token.sub!;
          }
          return session;
        },
      },
      pages: {
        signIn: "/login",
      },
    });