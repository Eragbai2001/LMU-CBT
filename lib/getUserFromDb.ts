import { db } from "@/lib/db";
import { Role } from "@prisma/client";

/**
 * Fetches a user from the database by email
 */
export async function getUserFromDb(email: string) {
  if (!email) {
    console.error("getUserFromDb called without an email");
    return null;
  }

  try {
    // Ensure we're not using a stale connection
    await db.$connect();

    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

/**
 * Creates a new user in the database
 */
export async function createUserInDb({
  email,
  name,
  password = null,
  role = "USER",
}: {
  email: string;
  name: string;
  password?: string | null;
  role?: "ADMIN" | "USER";
}) {
  if (!email) {
    console.error("createUserInDb called without an email");
    return null;
  }

  try {
    // Ensure we're not using a stale connection
    await db.$connect();

    // Create user with proper role enum
    const newUser = await db.user.create({
      data: {
        email,
        name,
        password,
        role: role as Role,
      },
    });

    console.log(`User created successfully with ID: ${newUser.id}`);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}
