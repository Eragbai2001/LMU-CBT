import { ProfileForm } from "@/components/profile-form";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ThemeSelector } from "@/components/theme-selector";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get user profile from database
  const avatarData = {
    avatarStyle: "adventurer",
    avatarSeed: (session.user.name || "user").toLowerCase().replace(/\s+/g, ""),
  };

  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        avatarStyle: true,
        avatarSeed: true,
      },
    });

    if (userProfile?.avatarStyle) {
      avatarData.avatarStyle = userProfile.avatarStyle;
    }

    if (userProfile?.avatarSeed) {
      avatarData.avatarSeed = userProfile.avatarSeed;
    }
  } catch (error) {
    console.error("Error fetching avatar data:", error);
    // Continue with default avatar data
  }

  // Create a profile object from the user data
  const profile = {
    name: session.user.name || "",
    email: session.user.email || "",
    ...avatarData,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 py-8">
      <div className="container max-w-5xl px-4 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 inline-block">
            Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Customize your experience and make it uniquely yours ✨
          </p>
        </div>

        <ProfileForm user={profile} />
        <ThemeSelector />
      </div>
    </div>
  );
}
