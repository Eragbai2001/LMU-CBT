"use client";

import ProgressChart from "@/components/dashboard/assessment-tabs";
import CourseStatistics from "@/components/dashboard/course-statistics";
import Milestones from "@/components/dashboard/milestone";
import StatCard from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import RecentActivity from "@/components/dashboard/recent-activity";

export default function DashboardMetrics() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col gap-4">
      <StatCard />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2 flex flex-col gap-4">
          <ProgressChart />
          <RecentActivity />
        </div>
        <div className="col-span-1 flex flex-col gap-4">
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
