import { CheckCircle, Clock, GraduationCap } from "lucide-react"
import type React from "react"



export default function StatCard() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {/* Tasks Completed Card */}
    <div className="flex items-center rounded-lg border border-purple-100 bg-white p-6 shadow-sm">
      <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
        <CheckCircle className="h-6 w-6 text-purple-500" />
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-800">10</p>
        <p className="text-sm text-gray-500">Tasks Completed</p>
      </div>
    </div>

    {/* Average Time Card */}
    <div className="flex items-center rounded-lg border border-pink-100 bg-white p-6 shadow-sm">
      <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-50">
        <Clock className="h-6 w-6 text-pink-500" />
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-800">2h</p>
        <p className="text-sm text-gray-500">Average Time</p>
      </div>
    </div>

    {/* Courses Enrolled Card */}
    <div className="flex items-center rounded-lg border border-green-100 bg-white p-6 shadow-sm">
      <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
        <GraduationCap className="h-6 w-6 text-green-500" />
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-800">12</p>
        <p className="text-sm text-gray-500">Courses Enrolled</p>
      </div>
    </div>
  </div>
  )
}

