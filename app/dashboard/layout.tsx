"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/dashboard/sidebar/sidebar";
import { ReactNode } from "react";
import DashboardHeader from "@/components/dashboard/header";
import {
  LayoutDashboard,
  Timer,
  TrendingUp,
  Shield,
  User,
  Moon,
  Menu,
} from "lucide-react";
import { SidebarLogo } from "@/components/dashboard/sidebar/sidebar-logo";
import CustomSignOut from "@/components/dashboard/sidebar/custom-signout";
import LoaderAnimation from "@/components/Loader/loader-animation";

export default function Layout({
  children,
  message = "Loading your content",
}: {
  children: ReactNode;
  message?: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Calculate UI state
  const showSidebar = pathname.startsWith("/dashboard");
  const showHeader =
    !pathname.includes("/dashboard/practice/test") &&
    !pathname.includes("/dashboard/practice/theory");

  // All hooks must be called at the top level, before any conditions
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 770) {
        setOpen(false); // Close sidebar on smaller screens
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar");
      if (open && sidebar && !sidebar.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    console.log("Current pathname:", pathname);
    console.log("Header visible:", showHeader);
  }, [pathname]);

  // Prepare menu links
  const menuLinks = [
    {
      label: "DASHBOARD",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} className="text-[#3949AB]" />,
    },
    {
      label: "PRACTICE",
      href: "/dashboard/practice",
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
      href: "/dashboard/profile",
      icon: <User size={20} className="text-[#3949AB]" />,
    },
  ];

  // Use conditional rendering instead of early returns
  if (status === "unauthenticated") {
    return null;
  }

  if (status === "loading") {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <LoaderAnimation size="large" text={message} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Overlay when sidebar is open on mobile */}
      {showSidebar && open && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      {showSidebar && (
        <div
          id="mobile-sidebar"
          className={`fixed top-0 left-0 h-full z-50 ${
            open ? "block" : "hidden"
          } lg:relative lg:flex lg:w-10`}
        >
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between">
              <div className="flex items-center space-x-3 mb-10">
                <SidebarLogo />
              </div>

              <div className="flex flex-1 flex-col">
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
        </div>
      )}

      <div
        className={`flex-1 flex flex-col lg:flex-col h-full overflow-hidden transition-all duration-300 ${
          showSidebar && open ? "lg:ml-[256px]" : "lg:ml-[70px]"
        }`}
      >
        {/* Header for smaller screens */}
        {showHeader && (
          <div className="w-full sticky top-0 z-30 flex justify-between items-center p-4 bg-white lg:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            <DashboardHeader />
          </div>
        )}

        {/* Main content container */}
        <div className="flex flex-col flex-1 overflow-auto">
          {/* Header for larger screens */}
          {showHeader && (
            <div className="hidden lg:block w-full px-7">
              <DashboardHeader />
              {/* Main content */}
            </div>
          )}
          <main className={`${showHeader ? "px-10" : "p-0"}`}>{children}</main>
        </div>
      </div>
    </div>
  );
}
