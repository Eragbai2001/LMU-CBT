import type React from "react"

interface StatCardProps {
  icon: React.ReactNode
  value: number
  label: string
}

export default function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="p-2 rounded-full bg-blue-50">{icon}</div>
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  )
}

