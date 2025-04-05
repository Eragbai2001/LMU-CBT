import { Edit } from "lucide-react";
import Image from "next/image";

interface ProfileCardProps {
  name: string;
  username: string;
  avatar: string;
  stats: {
    tests: number;
    avgHour: number;
    enrolled: number;
  };
}

export default function ProfileCard({
  name,
  username,
  
  stats,
}: ProfileCardProps) {
  return (
    <div className="p-6 border-l border-2 border-gray-100 hidden lg:block">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium">My Profile</h3>
        <button className="flex items-center text-sm text-gray-500 space-x-1">
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative">
          <Image
            src={ "/profil.jpeg"}
            alt={name}
            width={100}
            height={100}
            className="rounded-full border-4 border-white shadow-sm"
          />
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        <h3 className="mt-4 font-semibold text-lg">{name}</h3>
        <p className="text-gray-500 text-sm">{username}</p>

        <div className="flex justify-between w-full mt-6">
          <StatItem value={stats.tests} label="Tests" />
          <div className="w-px bg-gray-200"></div>
          <StatItem value={stats.avgHour} label="Avg. Hour" suffix="h" />
          <div className="w-px bg-gray-200"></div>
          <StatItem value={stats.enrolled} label="Enrolled" />
        </div>
      </div>

      <CalendarWidget />
    </div>
  );
}

function StatItem({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="font-bold text-lg">
        {value}
        {suffix}
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function CalendarWidget() {
  const days = ["Sat", "Sun", "Mon", "Tue", "Wed"];
  const currentDay = "Mon";

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <button className="p-1">
          <ChevronLeft className="h-5 w-5 text-gray-400" />
        </button>
        <h4 className="font-medium">October 2022</h4>
        <button className="p-1">
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
            flex flex-col items-center p-2 rounded-md
            ${
              day === currentDay
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }
          `}
          >
            <div className="text-sm font-medium">{12}</div>
            <div className="text-xs opacity-70">{day}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}
