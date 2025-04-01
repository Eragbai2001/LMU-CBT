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
} from "lucide-react";
import { SidebarLogo } from "@/components/dashboard/sidebar/sidebar-logo";
import CustomSignOut from "@/components/dashboard/sidebar/custom-signout";

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const checkIfMobile = () => {
      setOpen(window.innerWidth >= 1024);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  if (status === "unauthenticated") return null;
  if (status === "loading") return <p>Loading...</p>;

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

  const showSidebar = pathname.startsWith("/dashboard");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {showSidebar && (
        <Sidebar open={open} setOpen={setOpen}>
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
                  icon: <Moon size={20} className="text-[#3949AB]0" />,
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
      )}

      <div
        className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ${
          showSidebar ? (open ? "md:ml-[60px]" : "md:ml-[60px]") : ""
        }`}
      >
         <DashboardHeader />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
