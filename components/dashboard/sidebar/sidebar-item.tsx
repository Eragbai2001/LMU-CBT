import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  href: string
  active?: boolean
  isCollapsed: boolean
  isHovered: boolean
  isMobile: boolean
}

export function SidebarItem({
  icon: Icon,
  label,
  href,
  active = false,
  isCollapsed,
  isHovered,
  isMobile,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
        active ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        !isCollapsed || isHovered || isMobile ? "" : "justify-center",
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span
        className={cn(
          "text-sm font-medium whitespace-nowrap transition-all duration-200",
          !isCollapsed && !isHovered && !isMobile ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block",
        )}
      >
        {label}
      </span>
    </Link>
  )
}

