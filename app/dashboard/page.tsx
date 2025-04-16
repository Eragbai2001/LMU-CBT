"use client";

import ProgressChart from "@/components/dashboard/assessment-tabs";
import CourseStatistics from "@/components/dashboard/course-statistics";
import Milestones from "@/components/dashboard/milestone";
import StatCard from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";

export default function DashboardMetrics() {
  return (
    <div className="min-h-screen bg-gray-50  flex flex-col gap-11">
      
      <StatCard />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* ProgressChart */}

        <ProgressChart />

        <div className="col-span-1 flex flex-col gap-6">
          <Card className="p-4">
            <Milestones />
          </Card>
          <Card className="p-4">
            <CourseStatistics />
          </Card>
        </div>
      </div>
    </div>
  );
}
