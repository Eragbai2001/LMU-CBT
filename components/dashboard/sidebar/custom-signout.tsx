"use client";

import { LogOut } from "lucide-react";
import { handleSignOut } from "@/app/api/auth/[...nextauth]/route";
import { SidebarLink } from "./sidebar";


export default function CustomSignOut() {


  const handleLogout = async () => {
    const result = await handleSignOut();
    if (result?.success) {
      window.location.href = "/login"; // Trigger full page reload
    }
  };

  return (
    <SidebarLink
      link={{
        label: "LOG OUT",
        href: "", // Leave empty to use button instead
        icon: <LogOut size={20} className="text-[#3949AB]" />,
      }}
      onClick={() => handleLogout()} // Wrap handleLogout in an anonymous function
    />
  );
}
