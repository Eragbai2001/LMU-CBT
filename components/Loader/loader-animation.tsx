"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface LoaderAnimationProps {
  className?: string
  size?: "small" | "medium" | "large"
  text?: string
  showText?: boolean
}

export default function LoaderAnimation({
  className,
  size = "medium",
  text = "Loading...",
  showText = true,
}: LoaderAnimationProps) {
  const [dots, setDots] = useState("")

  // Animate the dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 400)

    return () => clearInterval(interval)
  }, [])

  // Size classes
  const sizeClasses = {
    small: "h-16 w-16",
    medium: "h-24 w-24",
    large: "h-32 w-32",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative">
        {/* Main circle */}
        <div className={cn("rounded-full border-4 border-blue-100", sizeClasses[size])} />

        {/* Spinner */}
        <div
          className={cn(
            "absolute top-0 left-0 rounded-full border-4 border-t-blue-600 animate-spin",
            sizeClasses[size],
          )}
        />

        {/* Educational icons that appear and disappear */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-1/2 w-1/2">
            <div className="absolute inset-0 flex items-center justify-center animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Loading text */}
      {showText && (
        <div className="mt-4 text-blue-600 font-medium">
          {text.split(".")[0]}
          {dots}
        </div>
      )}
    </div>
  )
}
