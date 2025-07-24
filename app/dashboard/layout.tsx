"use client";

import { useState, useEffect } from "react";
import { useSession, SessionProvider } from "next-auth/react";
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
  Sun,
  Menu,
} from "lucide-react";
import { useTheme } from "next-themes";
import { SidebarLogo } from "@/components/dashboard/sidebar/sidebar-logo";
import CustomSignOut from "@/components/dashboard/sidebar/custom-signout";
import LoaderAnimation from "@/components/Loader/loader-animation";
import NextTopLoader from 'nextjs-toploader';

// Create a client component that uses useSession
function DashboardLayoutContent({
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
  const { theme, setTheme, resolvedTheme } = useTheme(); // Add resolvedTheme
  const [mounted, setMounted] = useState(false);

  // Define constants before any hooks are called
  const showSidebar = pathname.startsWith("/dashboard");
  const showHeader =
    !pathname.includes("/dashboard/practice/test") &&
    !pathname.includes("/dashboard/practice/theory") &&
    !pathname.includes("/dashboard/profile") &&
    !pathname.includes("/dashboard/practice");

  // Group all useEffect hooks together to maintain consistent order
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

  // Close sidebar when clicking outside
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

  // Debug logging effect - ensuring it's always called
  useEffect(() => {
    console.log("Current pathname:", pathname);
    console.log("Header visible:", showHeader);
  }, [pathname, showHeader]);

  // Add this effect to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (status === "unauthenticated") return null;
  if (status === "loading")
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <LoaderAnimation size="large" text={message} />
      </div>
    );

  const menuLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} className="text-indigo-600" />,
    },
    {
      label: "Practice",
      href: "/dashboard/practice",
      icon: <Timer size={20} className="text-indigo-600" />,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: <User size={20} className="text-indigo-600" />,
    },
  ];

  // Check if we should display dark or light mode icon
  // This needs to consider both the theme setting and what's actually applied
  const isDarkMode = mounted && resolvedTheme === "dark";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0a0a0a]">
      {/* NextTopLoader - This automatically detects all navigation */}
      <NextTopLoader
        color="#3b82f6"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
      />

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
          } lg:relative lg:flex lg:w-10`}>
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between">
              <div
                className={`flex items-center px-5 mb-10 ${
                  open ? "w-full" : ""
                }`}>
                <SidebarLogo />
              </div>

              <div
                className={`flex flex-1 px-5 flex-col ${open ? "w-full" : ""}`}>
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
              <div
                className={`flex flex-col gap-4 px-5 mt-auto ${
                  open ? "w-full" : ""
                }`}>
                <CustomSignOut />
              </div>
            </SidebarBody>
          </Sidebar>
        </div>
      )}

      <div
        className={`flex-1 flex flex-col lg:flex-col h-full overflow-hidden transition-all duration-300 ${
          showSidebar && open ? "lg:ml-[202px]" : "lg:ml-[25px]"
        }`}>
        {/* Header for smaller screens */}
        {showHeader && (
          <div className="w-full sticky top-0 z-30 flex justify-between items-center p-4 bg-white lg:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 focus:outline-none"
              aria-label="Toggle menu">
              <Menu size={24} />
            </button>
            <DashboardHeader />
          </div>
        )}

        {/* Main content container */}
        <div className="flex flex-col flex-1 overflow-auto">
          {/* Header for larger screens */}
          {showHeader && (
            <div className="hidden lg:block w-full px-10 ">
              <DashboardHeader />
            </div>
          )}
          <main className={`${showHeader ? "px-10" : "p-0"}`}>{children}</main>
        </div>
      </div>
    </div>
  );
}

// Create a wrapper component that provides the session
export default function Layout({
  children,
  message = "Loading your content",
}: {
  children: ReactNode;
  message?: string;
}) {
  return (
    <SessionProvider>
      <DashboardLayoutContent message={message}>
        {children}
      </DashboardLayoutContent>
    </SessionProvider>
  );
}