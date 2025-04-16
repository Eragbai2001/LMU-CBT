// TestHeader.jsx
import React from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestHeaderProps {
  title: string;
  year?: number;
  timeRemaining: number | null;
  isTimeWarning: boolean;
  onReturnHome: () => void;
}

export default function TestHeader({ 
  title, 
  year, 
  timeRemaining, 
  isTimeWarning, 
  onReturnHome 
}: TestHeaderProps) {
const formatTime = (seconds: number): string => {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
};

  return (
    <header className="px-4 py-3 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={onReturnHome}
            className="mr-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            <div className="text-sm text-gray-600">
              Practice Test {year && `• ${year}`}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "text-lg font-medium py-1 px-3 rounded-lg",
            isTimeWarning
              ? "bg-red-100 text-red-700"
              : "bg-blue-50 text-blue-700"
          )}
        >
          {timeRemaining !== null ? formatTime(timeRemaining) : "--:--"}
        </div>
      </div>
    </header>
  );
}