"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function updateProfile(data: {
  name: string;
  email: string;
  avatarSeed: string;
  departmentId?: string | null; // Add these fields
  levelId?: string | null;
  // Removed enableAiAssistant as it's now handled by local storage
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
        avatarSeed: data.avatarSeed,
        departmentId: data.departmentId, // Add these fields here too
        levelId: data.levelId,

        // Removed enableAiAssistant as it's now handled by local storage
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
