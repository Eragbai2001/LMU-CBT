// components/TestPopupModal.tsx

"use client";

import React, { useState, useMemo } from "react";
import { X, FileText, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Test {
  id: string | number;
  title: string;
  description: string;
  duration: number;
  durationOptions: { id: string; minutes: number }[];
  yearOptions: { id: string; value: number }[];
  topicsByYear?: { yearId: string; topics: string[] }[];
  testType?: "objective" | "theory"; // Add test type field
}

interface TestPopupModalProps {
  test: Test;
  onClose: () => void;
}

export default function TestPopupModal({ test, onClose }: TestPopupModalProps) {
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const isTheoryTest = test.testType === "theory";

  const availableTopics = useMemo(() => {
    return (
      test.topicsByYear?.find((y) => y.yearId === selectedYear)?.topics || []
    );
  }, [selectedYear, test.topicsByYear]);

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleStartTest = () => {
    if (!selectedYear || !selectedDuration) return;

    setLoading(true);

    const topicQuery = selectedTopics
      .map((t) => `topic=${encodeURIComponent(t)}`)
      .join("&");
    const durationQuery =
      selectedDuration === "no-time" ? "no-time" : selectedDuration;

    // Fix routing paths to match your app structure
    const testPage = isTheoryTest
      ? "/dashboard/theory-test" // Use the correct path for theory tests
      : "/dashboard/test";      // Use the correct path for objective tests

    router.push(
      `${testPage}?testId=${
        test.id
      }&durationId=${durationQuery}&yearId=${selectedYear}${
        topicQuery ? `&${topicQuery}` : ""
      }`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="relative flex w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side */}
        <div
          className={`hidden md:block w-1/3 ${
            isTheoryTest
              ? "bg-gradient-to-b from-purple-600 to-indigo-700"
              : "bg-gradient-to-b from-blue-600 to-indigo-700"
          } p-8 text-white`}
        >
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold border-b border-opacity-40 pb-2 mb-4">
              {isTheoryTest ? "THEORY TEST" : "OBJECTIVE TEST"}
            </h2>
            <div className="flex items-center mb-4">
              {isTheoryTest ? (
                <FileQuestion className="h-6 w-6 mr-2" />
              ) : (
                <FileText className="h-6 w-6 mr-2" />
              )}
              <span>{test.title}</span>
            </div>
            <div className="text-5xl font-bold mt-auto mb-2">
              Boost Your Skills
            </div>
            <p className="text-blue-100 mb-4">
              Challenge yourself with our {isTheoryTest ? "theory" : "practice"}{" "}
              tests
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-2/3 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Start {isTheoryTest ? "Theory" : "Practice"} Test
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Test type indicator */}
          <div className="mb-6">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                isTheoryTest
                  ? "bg-purple-100 text-purple-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {isTheoryTest ? (
                <>
                  <FileQuestion className="h-4 w-4 mr-1" /> Theory Questions
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-1" /> Multiple Choice
                </>
              )}
            </span>
          </div>

          <div className="space-y-6">
            {/* Subject */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                Subject
              </h3>
              <div className="py-2 px-4 rounded-lg bg-blue-600 text-white font-medium">
                {test.title}
              </div>
            </div>

            {/* Duration */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                Select Duration
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {/* No Timer Option */}
                <button
                  className={cn(
                    "py-2 px-4 rounded-full text-sm font-medium transition-colors",
                    selectedDuration === "no-time"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  )}
                  onClick={() => setSelectedDuration("no-time")}
                >
                  No Time
                </button>

                {/* Actual Duration Options */}
                {test.durationOptions.map((d) => (
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
                ))}
              </div>
            </div>

            {/* Year */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                Select Year
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {test.yearOptions.map((y) => (
                  <button
                    key={y.id}
                    className={cn(
                      "py-2 px-4 rounded-full text-sm font-medium transition-colors",
                      selectedYear === y.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    )}
                    onClick={() => {
                      setSelectedYear(y.id);
                      setSelectedTopics([]); // reset selected topics
                    }}
                  >
                    {y.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics */}
            {availableTopics.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-3">
                  Choose Topics (optional)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableTopics.map((topic) => (
                    <button
                      key={topic}
                      className={cn(
                        "py-2 px-4 rounded-full text-sm font-medium transition-colors",
                        selectedTopics.includes(topic)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                      onClick={() => handleTopicToggle(topic)}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Theory-specific explanation */}
            {isTheoryTest && (
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 text-sm text-purple-800">
                <p className="font-medium mb-1">About Theory Tests:</p>
                <p>
                  This test requires written answers rather than selecting
                  options. You'll be presented with questions to answer in your
                  own words.
                </p>
              </div>
            )}

            {/* Start Button */}
            <button
              className={cn(
                "w-full py-3 px-4 rounded-lg text-white font-medium transition-colors mt-4",
                selectedDuration && selectedYear
                  ? isTheoryTest
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-blue-600 hover:bg-blue-700"
                  : isTheoryTest
                  ? "bg-purple-300 cursor-not-allowed"
                  : "bg-blue-300 cursor-not-allowed"
              )}
              onClick={handleStartTest}
              disabled={!selectedDuration || !selectedYear}
            >
              {loading
                ? "Loading..."
                : `Start ${isTheoryTest ? "Theory" : "Practice"} Test`}
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
