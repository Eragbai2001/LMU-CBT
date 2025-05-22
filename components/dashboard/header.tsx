"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/getUser";
import { Bell, BookOpen } from "lucide-react";
import Link from "next/link";

// Define user type with avatar properties
interface User {
  name?: string;
  email?: string;
  avatarStyle?: string;
  avatarSeed?: string;
  displayName?: string;
  [key: string]: unknown; // Allow other properties
}

export default function UserProfileWithCard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  // Generate avatar URL from user data
  const getAvatarUrl = (user: User | null) => {
    if (!user || !user.avatarStyle || !user.avatarSeed) {
      // Default avatar if no custom one is set
      return `https://api.dicebear.com/7.x/adventurer/svg?seed=${
        user?.name?.toLowerCase().replace(/\s+/g, "") || "student"
      }`;
    }
    return `https://api.dicebear.com/7.x/${user.avatarStyle}/svg?seed=${user.avatarSeed}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
            {loading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse rounded-full"></div>
            ) : (
              <img
                src={getAvatarUrl(user) || "/placeholder.svg"}
                alt="User avatar"
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* User info */}
          <div>
            <h1 className="text-lg sm:text-xl font-bold flex flex-wrap items-center gap-1 sm:gap-2">
              <span className="font-light text-base sm:text-lg text-gray-800">
                Hello,
              </span>
              {loading ? (
                <span className="w-16 sm:w-24 h-5 sm:h-6 bg-gray-300 animate-pulse rounded"></span>
              ) : user ? (
                <span className="text-gray-900 truncate max-w-xs">
                  {user.displayName ||
                    user.name ||
                    user.email?.split("@")[0] ||
                    ""}
                </span>
              ) : (
                ""
              )}
            </h1>

            <p className="text-gray-500 font-light text-sm sm:text-base py-1">
              Lets learn something new today
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-500" />
          </button>
          <Link
            href="/dashboard/profile"
            className="hidden sm:block text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Optional: Student status card */}
      {/* <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
          <div className="bg-blue-100 p-2 rounded-full">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">Current Course</p>
            <p className="text-base font-semibold text-blue-700">
              Computer Science 101
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
