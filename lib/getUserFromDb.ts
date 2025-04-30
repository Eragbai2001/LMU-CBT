import { db } from "@/lib/db"; // Use the singleton Prisma instance

export async function getUserFromDb(email: string) {
  try {
    return await db.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function createUserInDb({
  email,
  name,
  password = null, // Default to null for OAuth users
  role = "USER", // Default role is USER
}: {
  email: string;
  name: string;
  password?: string | null;
  role?: "ADMIN" | "USER"; // Add role to the function parameters
}) {
  try {
    return await db.user.create({
      data: {
        email,
        name,
        password, // This now allows both null and actual passwords
        role, // Include the role in the database creation
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}
