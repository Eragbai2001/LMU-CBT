"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/getUser";

// Define user type
interface User {
  name?: string;
  email?: string;
  [key: string]: unknown; // Allow other properties
}

export default function UserProfile() {
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

  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-lg sm:text-xl font-bold flex flex-wrap items-center gap-1 sm:gap-2">
        <span className="font-light text-base sm:text-lg text-gray-800">Hello,</span>
        {loading ? (
          <span className="w-16 sm:w-24 h-5 sm:h-6 bg-gray-300 animate-pulse rounded"></span>
        ) : user ? (
          <span className="text-gray-900 truncate max-w-xs">{user.name}</span>
        ) : (
          ""
        )}
      </h1>

      <p className="text-gray-500 font-light text-sm sm:text-base py-1 sm:py-2">
        Lets learn something new today
      </p>
    </div>
  );
}