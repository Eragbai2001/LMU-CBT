import type React from "react"
import { ChevronDown } from "lucide-react"

interface TimeSpendingProps {
  hours: number
  minutes: number
  activeDay: string
  hoursSpent: number
  overallResult: number
  completedCourses: number
}

export default function TimeSpending({
  hours,
  minutes,
  activeDay,
  hoursSpent,
  overallResult,
  completedCourses,
}: TimeSpendingProps) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sun"]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Time Spendings</h2>
        <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1 rounded-md text-sm">
          <span>Weekly</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      <div className="flex items-end justify-between mb-6">
        <h3 className="text-3xl font-bold">
          {hours}
          <span className="text-gray-400 text-xl">h</span> {minutes}
          <span className="text-gray-400 text-xl">m</span>
        </h3>

        <div className="flex space-x-8">
          <StatCard icon={<ClockIcon />} value={hoursSpent} label="Hours Spent" />
          <StatCard icon={<TrophyIcon />} value={overallResult} label="Overall Result" />
          <StatCard icon={<GraduationIcon />} value={completedCourses} label="Completed" />
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 -top-16 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm">
          <div className="text-center">
            <div>8h 20m</div>
            <div className="text-xs text-gray-400">Time spent</div>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
        </div>

        <div className="flex justify-between items-end h-40">
          {days.map((day, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div
                className={`w-8 ${day === activeDay ? "bg-red-500" : "bg-gray-200"} rounded-sm`}
                style={{ height: day === activeDay ? "180px" : `${20 + Math.random() * 60}px` }}
              ></div>
              <span className="text-xs text-gray-500">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
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

function ClockIcon() {
  return (
    <div className="w-5 h-5 text-blue-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    </div>
  )
}

function TrophyIcon() {
  return (
    <div className="w-5 h-5 text-yellow-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
        <path d="M4 22h16"></path>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
      </svg>
    </div>
  )
}

function GraduationIcon() {
  return (
    <div className="w-5 h-5 text-purple-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
      </svg>
    </div>
  )
}

