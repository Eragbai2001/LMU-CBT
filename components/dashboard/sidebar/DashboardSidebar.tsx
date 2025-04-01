"use client";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/dashboard/sidebar/sidebar";
import {
  LayoutDashboard,
  Timer,
  TrendingUp,
  Shield,
  User,
  Moon,
} from "lucide-react";
import { SidebarLogo } from "@/components/dashboard/sidebar/sidebar-logo";
import CustomSignOut from "@/components/dashboard/sidebar/custom-signout";
import { Dispatch, SetStateAction } from "react";

export default function DashboardSidebar({ 
  onOpenChange
}: { 
  onOpenChange?: (isOpen: boolean) => void 
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Use useCallback to memoize the function and add it to deps array
  const handleOpenChange = useCallback((newOpen: boolean | ((prevState: boolean) => boolean)) => {
    // Handle both direct boolean values and function updates
    const updatedValue = typeof newOpen === 'function' ? newOpen(open) : newOpen;
    
    setOpen(updatedValue);
    if (onOpenChange) {
      onOpenChange(updatedValue);
    }
  }, [open, onOpenChange]);

  useEffect(() => {
    const checkIfMobile = () => {
      const newOpen = window.innerWidth >= 1024;
      handleOpenChange(newOpen);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [handleOpenChange]); // Now handleOpenChange is properly included in deps

  const menuLinks = [
    {
      label: "DASHBOARD",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} className="text-[#3949AB]" />,
    },
    {
      label: "PRACTICE",
      href: "/practice",
      icon: <Timer size={20} className="text-[#3949AB]" />,
    },
    {
      label: "ANALYTICS",
      href: "/analytics",
      icon: <TrendingUp size={20} className="text-[#3949AB]" />,
    },
    {
      label: "RANK",
      href: "/rank",
      icon: <Shield size={20} className="text-yellow-500" />,
    },
    {
      label: "PROFILE",
      href: "/profile",
      icon: <User size={20} className="text-[#3949AB]" />,
    },
  ];

  return (
    <Sidebar 
      open={open} 
      setOpen={handleOpenChange as Dispatch<SetStateAction<boolean>>}
    >
      <SidebarBody className="justify-between">
        <div className="flex flex-1 flex-col">
          <div className="flex items-center space-x-3 mb-10">
            <SidebarLogo />
          </div>

          <div className="flex flex-col gap-2">
            {menuLinks.map((link, idx) => (
              <SidebarLink
                key={idx}
                link={link}
                className={pathname === link.href ? "font-bold" : ""}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-auto">
          <CustomSignOut />
          <SidebarLink
            link={{
              label: "NIGHT MODE",
              href: "#",
              icon: <Moon size={20} className="text-[#3949AB]" />,
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}