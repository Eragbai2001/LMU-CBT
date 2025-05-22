import { ProfileForm } from "@/components/profile-form";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AISettingsToggle from "@/components/dashboard/settings/AISettingsToggle";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get user profile from database
  const avatarData = {
    avatarSeed: (session.user.name || "user").toLowerCase().replace(/\s+/g, ""),
  };

  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        avatarSeed: true,
      },
    });

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
    <div className="min-h-screen py-8">
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
        
        <div className="mt-8">
          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-lg p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Application Settings
            </h2>
            <div className="space-y-4">
              <AISettingsToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
