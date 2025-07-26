import { ProfileForm } from "@/components/profile-form";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AISettingsToggle from "@/components/dashboard/settings/AISettingsToggle";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Sparkles } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get user profile from database
  const avatarData = {
    avatarSeed: (session.user.name || "user").toLowerCase().replace(/\s+/g, ""),
  };
    let userProfile = {
    name: session.user.name || "",
    email: session.user.email || "",
    avatarSeed: (session.user.name || "user").toLowerCase().replace(/\s+/g, ""),
  };

 try {
    // Get complete profile from database
    const dbProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        avatarSeed: true,
        departmentId: true,
        levelId: true,
        department: {
          select: { id: true, name: true, code: true }
        },
        level: {
          select: { id: true, name: true, value: true }
        }
      }
    });

    // Merge database data with default data
    if (dbProfile) {
      userProfile = {
        ...userProfile,  // Keep defaults
        ...dbProfile,    // Override with database values
        avatarSeed: dbProfile.avatarSeed || userProfile.avatarSeed, // Ensure avatarSeed is never null
      };
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }


  // Create a profile object from the user data


  return (
    <div className="min-h-screen py-8 bg-white dark:bg-[#0a0a0a]">
      <div className="container max-w-5xl px-4 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-[#8b5cf6] dark:to-[#ec4899] inline-block">
            Your Profile
          </h1>
          <p className="text-gray-600 dark:text-[#a3a3a3] mt-2 flex items-center justify-center gap-2">
            Customize your experience and make it uniquely yours{" "}
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </p>
        </div>
        <ProfileForm user={userProfile} />
       

        <div className="mt-8">
          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 dark:border-[#333333] shadow-lg p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#ffffff] mb-6">
              Application Settings
            </h2>
            <div className="space-y-4">
              <AISettingsToggle />
              <div className="mt-4  pt-4">
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
