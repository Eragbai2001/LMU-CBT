import { CheckCircle, Clock, GraduationCap, Flag } from "lucide-react";
import type React from "react";

export default function StatCard() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Tasks Completed Card */}
      <div className="flex items-center rounded-lg border border-purple-100 dark:border-none bg-white p-4 shadow-sm dark:bg-gray-800/80">
        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
          <CheckCircle className="h-6 w-6 text-purple-500" />
        </div>
        <div>
          <p className="text-3xl font-bold ">10</p>
          <p className="text-sm text-gray-500">Tasks Completed</p>
        </div>
      </div>

      {/* Average Time Card */}
      <div className="flex items-center rounded-lg border dark:border-none border-pink-100 bg-white p-4 shadow-sm dark:bg-gray-800/80">
        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-pink-50">
          <Clock className="h-6 w-6 text-pink-500" />
        </div>
        <div>
          <p className="text-3xl font-bold ">45m</p>
          <p className="text-sm text-gray-500">Avg. Test Duration</p>
        </div>
      </div>

      {/* Courses Enrolled Card */}
      <div className="flex items-center rounded-lg dark:border-none  border border-green-100 bg-white p-4 shadow-sm dark:bg-gray-800/80">
        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
          <GraduationCap className="h-6 w-6 text-green-500" />
        </div>
        <div>
          <p className="text-3xl font-bold ">5</p>
          <p className="text-sm text-gray-500">Active Subjects</p>
        </div>
      </div>

      {/* Flagged Questions Card */}
      <div className="flex items-center rounded-lg border dark:border-none border-yellow-100 bg-white p-4 shadow-sm dark:bg-gray-800/80">
        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-50">
          <Flag className="h-6 w-6 text-yellow-500" />
        </div>
        <div>
          <p className="text-3xl font-bold  ">
            0
          </p>
          <p className="text-sm text-gray-500">Flagged Questions</p>
        </div>
      </div>
    </div>
  );
}
