"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function updateProfile(data: {
  name: string;
  email: string;
  avatarStyle: string;
  avatarSeed: string;
}) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Update user profile in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        avatarStyle: data.avatarStyle,
        avatarSeed: data.avatarSeed,
        // Don't update email as it's the primary identifier
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
