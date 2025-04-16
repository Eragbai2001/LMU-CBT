"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Test {
  id: string | number;
  title: string;
  description: string;
  duration: number; // Added duration for default time
  durationOptions: { id: string; minutes: number }[];
  yearOptions: { id: string; value: number }[];
  // Add displayDuration as a prop
}
interface TestPopupModalProps {
  test: Test;
  onClose: () => void;
}

export default function TestPopupModal({
  test,
  onClose,
}: // Destructure displayDuration
TestPopupModalProps) {
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStartTest = async () => {
    if (selectedDuration && selectedYear) {
      setLoading(true);
      try {
        let durationId = selectedDuration;

        // Handle "default" and "no-time" options
        if (selectedDuration === "default") {
          durationId = "default"; // Use a special identifier for default time
        } else if (selectedDuration === "no-time") {
          durationId = "no-time"; // Use a special identifier for no time
        }

        // Navigate to the test page with query parameters
        router.push(
          `/dashboard/test?testId=${test.id}&durationId=${durationId}&yearId=${selectedYear}`
        );
      } catch (error) {
        console.error("Error starting test:", error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="relative flex w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left side - Accent panel */}
        <div className="hidden md:block w-1/3 bg-gradient-to-b from-blue-600 to-indigo-700 p-8 text-white">
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold border-b border-blue-400 pb-2 mb-4">
              START NEW TEST
            </h2>
            <div className="text-5xl font-bold mt-auto mb-2">
              Boost
              <br />
              Your
              <br />
              Skills
            </div>
            <p className="text-blue-100 mb-4">
              Challenge yourself with our practice tests
            </p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-2/3 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Start New Practice Test
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Subject Display */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                Subject
              </h3>
              <div className="py-2 px-4 rounded-lg bg-blue-600 text-white font-medium">
                {test.title}
              </div>
            </div>

            {/* Duration Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                Select Duration
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {/* Other Duration Options */}
                {test.durationOptions.length > 0 ? (
                  test.durationOptions.map((d) => (
                    <button
                      key={d.id}
                      className={cn(
                        "py-2 px-4 rounded-full text-sm font-medium transition-colors",
                        selectedDuration === d.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                      onClick={() => setSelectedDuration(d.id)}
                    >
                      {d.minutes} mins
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">No duration options available</p>
                )}
              </div>
            </div>

            {/* Year Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                Select Year
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {test.yearOptions.length > 0 ? (
                  test.yearOptions.map((y) => (
                    <button
                      key={y.id}
                      className={cn(
                        "py-2 px-4 rounded-full text-sm font-medium transition-colors",
                        selectedYear === y.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                      onClick={() => setSelectedYear(y.id)}
                    >
                      {y.value}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">No year options available</p>
                )}
              </div>
            </div>

            {/* Start Button */}
            <button
              className={cn(
                "w-full py-3 px-4 rounded-lg text-white font-medium transition-colors mt-4",
                selectedDuration && selectedYear
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-300 cursor-not-allowed"
              )}
              onClick={handleStartTest}
              disabled={!selectedDuration || !selectedYear}
            >
              {loading ? "Loading..." : "Start Practice Test"}
            </button>

            <div className="text-center">
              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                No thanks, maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
