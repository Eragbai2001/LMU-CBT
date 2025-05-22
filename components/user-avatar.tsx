"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: {
    name?: string | null;
    avatarStyle?: string;
    avatarSeed?: string;
  };
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  const avatarUrl =
    user.avatarStyle && user.avatarSeed
      ? `https://api.dicebear.com/7.x/${user.avatarStyle}/svg?seed=${user.avatarSeed}`
      : undefined;

  // Get initials for the fallback
  const initials = user.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U";

  return (
    <Avatar className={className}>
      {avatarUrl ? (
        // Using regular img tag instead of AvatarImage for better compatibility
        <img
          src={avatarUrl || "/placeholder.svg"}
          alt={user.name || "User"}
          className="h-full w-full object-cover"
        />
      ) : null}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
