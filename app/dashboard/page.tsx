"use client";

import ProgressChart from "@/components/dashboard/assessment-tabs";
import StatsGroup from "@/components/dashboard/stats-group";

export default function DashboardMetrics() {
  const hoursSpent = 10;
  const overallResult = 85;
  const completedCourses = 5;
  return (
    <div className=" flex items-center gap-32">
      <div className="">
        <ProgressChart />
      </div>

      <div className="">
        <StatsGroup
          hoursSpent={hoursSpent}
          overallResult={overallResult}
          completedCourses={completedCourses}
        />
      </div>
    </div>
  );
}
