"use client"

import { useState } from "react"
import { BookOpen, X, Menu, Home, FileText, Award, BarChart2, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { SidebarItem } from "./sidebar-item"
import UserProfile from "./user-profile"

interface SidebarProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
  isMobile: boolean
}

export function Sidebar({ isSidebarOpen, setIsSidebarOpen, isMobile }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
    { icon: BookOpen, label: "Courses", href: "/dashboard/courses" },
    { icon: FileText, label: "Assessments", href: "/dashboard/exams" },
    { icon: BarChart2, label: "Results", href: "/dashboard/results" },
    { icon: Award, label: "Achievements", href: "/dashboard/achievements" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ]

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-primary text-white shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Aceternity-inspired Sidebar */}
      <div
        className={cn(
          "h-full bg-white border-r shadow-sm transition-all duration-300 ease-in-out z-40",
          isMobile
            ? isSidebarOpen
              ? "fixed inset-y-0 left-0 w-64"
              : "fixed inset-y-0 -left-64 w-64"
            : isSidebarOpen
              ? "w-64"
              : "w-20",
          "flex flex-col",
        )}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="bg-primary/10 p-1.5 rounded-full flex-shrink-0">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h1
              className={cn(
                "text-lg font-bold transition-opacity duration-200 whitespace-nowrap",
                !isSidebarOpen && !isHovered && !isMobile ? "opacity-0 w-0" : "opacity-100 w-auto",
              )}
            >
              UniTest CBT
            </h1>
          </div>
          {!isMobile && (
            <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 flex-shrink-0">
              {isSidebarOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              )}
            </button>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={item.active}
              isCollapsed={isSidebarOpen}
              isHovered={isHovered}
              isMobile={isMobile}
            />
          ))}
        </nav>

        <UserProfile
         
        />
      </div>
    </>
  )
}

