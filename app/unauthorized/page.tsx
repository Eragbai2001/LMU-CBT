// app/unauthorized/page.tsx
"use client"

import { useRouter } from "next/navigation"

export default function UnauthorizedPage() {
  const router = useRouter()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Unauthorized Access</h1>
          <p className="mt-2 text-sm text-gray-600">
            You dont have permission to access this page.
          </p>
        </div>
        
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}