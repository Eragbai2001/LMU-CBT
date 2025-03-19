"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { AssessmentTabs } from "@/components/dashboard/assessment-tabs"

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} isMobile={isMobile} />

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col h-full overflow-hidden ${isMobile ? "" : isSidebarOpen ? "ml-64" : "ml-20"}`}
      >
        <DashboardHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          <AssessmentTabs />
        </main>
      </div>
    </div>
  )
}

