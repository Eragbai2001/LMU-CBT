import { User } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserProfileProps {
  isCollapsed: boolean
  isHovered: boolean
  isMobile: boolean
  name: string
  studentId: string
}

export function UserProfile({ isCollapsed, isHovered, isMobile, name, studentId }: UserProfileProps) {
  return (
    <div className="p-4 border-t">
      <div className={cn("flex items-center gap-3", !isCollapsed || isHovered || isMobile ? "" : "justify-center")}>
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-primary" />
        </div>
        <div
          className={cn(
            "transition-all duration-200 overflow-hidden",
            !isCollapsed && !isHovered && !isMobile ? "w-0 opacity-0" : "w-auto opacity-100",
          )}
        >
          <p className="text-sm font-medium whitespace-nowrap">{name}</p>
          <p className="text-xs text-gray-500 whitespace-nowrap">Student ID: {studentId}</p>
        </div>
      </div>
    </div>
  )
}

