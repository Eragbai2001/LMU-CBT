import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { auth } from "@/auth";

// Define the User type
interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  given_name?: string;
  family_name?: string;
  user_metadata?: {
    username?: string;
  };
}

// Define the NormalizedUser type
interface NormalizedUser extends User {
  displayName?: string;
}

function normalizeUserData(user: User): NormalizedUser {
  const normalizedUser: NormalizedUser = { ...user };
  
  // Always prioritize the name field from the database
  if (user.name) {
    normalizedUser.displayName = user.name;
  } else if (user.user_metadata?.username) {
    // Fallback to user_metadata.username if name is not available
    normalizedUser.displayName = user.user_metadata.username;
  } else {
    // Fallback to email prefix or ID if both name and username are missing
    normalizedUser.displayName =
      user.email?.split("@")[0] || user.id?.substring(0, 8) || "User";
  }
  
  return normalizedUser;
}

export async function GET() {
  try {
    // The key fix: Use a different approach with createClient instead
    const supabase = createServerComponentClient({
      cookies: cookies
    });
    
    const session = await auth();
    
    // Get the Supabase session
    const { data } = await supabase.auth.getSession();
    const supabaseSession = data?.session;
      
    if (session?.user) {
      const jwt = supabaseSession?.access_token;
      
      // Get raw user data from either source
      const rawUserData: User | null = session?.user || supabaseSession?.user || null;
      
      // Normalize the user data (if we have any)
      const normalizedUser = rawUserData ? normalizeUserData(rawUserData) : null;
      
      return NextResponse.json({
        user: normalizedUser,
        jwt: jwt || null,
      });
    }
    
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}