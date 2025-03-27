"use client";

import { Session } from "next-auth";

interface UserProfileProps {
  session: Session | null;
}

export default function UserProfile({ session }: UserProfileProps) {
  if (!session?.user) return null;

  return (
    <div className="flex items-center space-x-3">
      <div>
        <p className="font-semibold">{session.user.name}</p>
        <p className="text-sm text-gray-500">{session.user.email}</p>
      </div>
    </div>
  );
}
