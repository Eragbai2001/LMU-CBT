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
  }: {
    email: string;
    name: string;
  }) {
    try {
      return await db.user.create({
        data: {
          email,
          name,
          password: null, // No need to cast explicitly
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }
  