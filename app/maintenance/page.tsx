"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getMaintenanceStatus } from "@/lib/maintenance"
import MaintenanceMode from "@/components/maintenance/maintenance-mode"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function MaintenancePage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get("returnUrl") || "/"
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function checkUserAndMaintenanceStatus() {
      try {
        // Check if user is logged in and is admin
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const userRole = session?.user?.user_metadata?.role
        const isUserAdmin = userRole === "ADMIN"
        setIsAdmin(isUserAdmin)

        // Get maintenance message
        const { message } = await getMaintenanceStatus()
        setMessage(message)
      } catch (error) {
        console.error("Error checking maintenance status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUserAndMaintenanceStatus()
  }, [supabase])

  const handleOverride = async () => {
    // Set a cookie to override maintenance mode for this session
    document.cookie = "maintenance_override=true; path=/; max-age=3600;"
    router.push(returnUrl)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return <MaintenanceMode message={message} isAdmin={isAdmin} onOverride={handleOverride} />
}
