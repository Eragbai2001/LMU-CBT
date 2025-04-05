"use client";

import { LogOut } from "lucide-react";
import { handleSignOut } from "@/app/api/auth/[...nextauth]/route";
import { SidebarLink } from "./sidebar";
import { useRouter } from "next/navigation";

export default function CustomSignOut() {
  const router = useRouter();

  const handleLogout = async () => {
    const result = await handleSignOut();
    if (result?.success) {
      router.push("/login");
    }
  };

  return (
    <SidebarLink
      link={{
        label: "LOG OUT",
        href: "", // Leave empty to use button instead
        icon: <LogOut size={20} className="text-[#3949AB]" />,
      }}
      onClick={handleLogout} // Use onClick instead of href="javascript:void(0)"
    />
  );
}
