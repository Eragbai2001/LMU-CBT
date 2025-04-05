"use server";
import { handlers, signOut } from "@/auth"; // Referring to the auth.ts we just created
export const { GET, POST } = handlers;
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function handleSignOut() {
  // Pass a redirect URL to NextAuth's signOut function
  await signOut({ redirectTo: "/login" });
  return { success: true };
}

export async function getSupabaseServerClient() {
  return createRouteHandlerClient({ cookies });
}
