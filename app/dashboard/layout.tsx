"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
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
        setIsMobile(window.innerWidth < 1024);
        setIsSidebarOpen(window.innerWidth >= 1024);
      };
  
      checkIfMobile();
      window.addEventListener("resize", checkIfMobile);
      return () => window.removeEventListener("resize", checkIfMobile);
    }, []);
  

    if (status === "unauthenticated") return null;
    if (status === "loading") return <p>Loading...</p>;
  

    const showSidebar = pathname.startsWith("/dashboard");
  
    return (
      <div className="flex h-screen overflow-hidden bg-slate-50">
        {showSidebar && (
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isMobile={isMobile}
          />
        )}
  
        {/* Main content */}
        <div
          className={`flex-1 flex flex-col h-full overflow-hidden ${
            isMobile ? "" : showSidebar ? (isSidebarOpen ? "ml-64" : "ml-20") : ""
          }`}
        >
          {showSidebar && <DashboardHeader />}
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    );
  }
  
  
