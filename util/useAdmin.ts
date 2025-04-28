// hooks/useAdmin.ts
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAdmin() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const isAdmin = session?.user?.role === "ADMIN"
  const isLoading = status === "loading"

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && !isAdmin) {
      router.push("/unauthorized")
    }
  }, [status, isAdmin, router])

  return { isAdmin, isLoading, user: session?.user }
}