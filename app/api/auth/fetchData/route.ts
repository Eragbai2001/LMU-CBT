import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
  role?: string; // Added role for authorization
}

// Define the NormalizedUser type
interface NormalizedUser extends User {
  displayName?: string;
  avatarStyle?: string; // Add avatar fields
  avatarSeed?: string; // Add avatar fields
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
    // Get session from your auth.js
    const session = await auth();

    // Use the Supabase SSR client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get Supabase session
    const { data } = await supabase.auth.getSession();
    const supabaseSession = data?.session;

    if (session?.user) {
      const jwt = supabaseSession?.access_token;

      // Get raw user data from either source
      const rawUserData: User | null =
        session?.user || supabaseSession?.user || null;

      // Normalize the user data (if we have any)
      const normalizedUser = rawUserData
        ? normalizeUserData(rawUserData)
        : null;

      // Get avatar data from Prisma if user exists
      let avatarData = {};
      if (normalizedUser?.id) {
        const userProfile = await prisma.user.findUnique({
          where: { id: normalizedUser.id },
          select: {
            avatarStyle: true,
            avatarSeed: true,
          },
        });

        if (userProfile) {
          avatarData = {
            avatarStyle: userProfile.avatarStyle,
            avatarSeed: userProfile.avatarSeed,
          };
        }
      }

      // Include role in the response for authorization checks
      return NextResponse.json({
        user: {
          ...normalizedUser,
          ...avatarData, // Add avatar data
          role: session.user.role || "USER", // Include role from session
        },
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
