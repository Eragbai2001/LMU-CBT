import StatCard from "./stat-card";
import ClockIcon from "../icons/clock-icon";
import TrophyIcon from "../icons/trophy-icon";
import GraduationIcon from "../icons/graduation-icon";

interface StatsGroupProps {
  hoursSpent: number;
  overallResult: number;
  completedCourses: number;
}

export default function StatsGroup({
  hoursSpent,
  overallResult,
  completedCourses,
}: StatsGroupProps) {
  return (
    <div className="flex  flex-col gap-4 md:gap-28 ">
      <StatCard icon={<ClockIcon />} value={hoursSpent} label="Hours Spent" />
      <StatCard
        icon={<TrophyIcon />}
        value={overallResult}
        label="Overall Result"
      />
      <StatCard
        icon={<GraduationIcon />}
        value={completedCourses}
        label="Completed"
      />
    </div>
  );
}
