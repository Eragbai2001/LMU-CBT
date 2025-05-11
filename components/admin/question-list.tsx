"use client";

import { Trash2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

interface Question {
  id: number;
  text: string;
  points: number;
  options?: { id: string; text: string }[];
  correctAnswer?: string;
  topic?: string;
  image?: string;
  theoryAnswer?: string;
  yearValue?: number; // Add yearValue to the interface
}

interface QuestionListProps {
  questions: Question[];
  testType: "objective" | "theory";
  error?: string;
  onRemoveQuestion: (id: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function QuestionList({
  questions,
  testType,
  error,
  onRemoveQuestion,
  onBack,
  onNext,
}: QuestionListProps) {
  const totalPoints = questions.reduce((acc, q) => acc + (q.points || 0), 0);
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>(
    {}
  );

  // Group questions by yearValue
  const questionsByYear = useMemo(() => {
    const grouped: Record<number, Question[]> = {};

    // Default for questions without a year
    const currentYear = new Date().getFullYear();

    questions.forEach((q) => {
      const year = q.yearValue || currentYear;
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(q);
    });

    // Initialize expandedYears state for any new years
    Object.keys(grouped).forEach((yearKey) => {
      const year = Number(yearKey);
      if (expandedYears[year] === undefined) {
        setExpandedYears((prev) => ({ ...prev, [year]: true }));
      }
    });

    return grouped;
  }, [questions, expandedYears]);

  // Sort years for display
  const sortedYears = useMemo(() => {
    return Object.keys(questionsByYear)
      .map(Number)
      .sort((a, b) => b - a); // Newest years first
  }, [questionsByYear]);

  const toggleYearExpansion = (year: number) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {questions.length} Question{questions.length !== 1 ? "s" : ""} Added
        </h2>
        <p className="text-sm text-gray-600">
          Total points: <span className="font-semibold">{totalPoints}</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      {questions.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No questions added yet. Add your first question above.</p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto pr-1">
          {sortedYears.map((year) => (
            <div key={year} className="mb-4">
              <div
                className="flex items-center justify-between bg-gray-100 p-3 rounded-t-lg cursor-pointer"
                onClick={() => toggleYearExpansion(year)}
              >
                <h3 className="font-medium text-gray-700">
                  Year: {year} ({questionsByYear[year].length} questions)
                </h3>
                <button className="p-1 text-gray-500 hover:bg-gray-200 rounded">
                  {expandedYears[year] ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
              </div>

              {expandedYears[year] && (
                <div className="border border-gray-200 border-t-0 rounded-b-lg p-2">
                  {questionsByYear[year].map((question, index) => {
                    // Ensure question.id is valid and not NaN, fallback to index if needed
                    const questionKey = Number.isNaN(question.id)
                      ? `question-${year}-${index}`
                      : question.id;

                    return (
                      <div
                        key={questionKey}
                        className="border border-gray-200 rounded-lg p-4 mb-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start">
                          <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                            {String(index + 1)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap justify-between items-start mb-1">
                              <p className="font-medium text-gray-800 text-sm truncate mr-2 flex-1">
                                {question.text}
                              </p>
                              {question.topic && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                  {question.topic}
                                </span>
                              )}
                            </div>

                            {testType === "objective" ? (
                              <div className="mt-2 flex flex-wrap items-center">
                                <div className="text-xs text-gray-500 mr-3">
                                  Correct: {question.correctAnswer}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Options: {question.options?.length || 0}
                                </div>
                              </div>
                            ) : (
                              <div className="mt-2">
                                {question.theoryAnswer ? (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    Reference answer provided
                                  </span>
                                ) : (
                                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                    No reference answer
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="ml-3 flex-shrink-0">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-700 mr-3">
                                {question.points} pt
                                {question.points !== 1 ? "s" : ""}
                              </div>
                              <button
                                onClick={() => onRemoveQuestion(question.id)}
                                className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                title="Remove question"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className={cn(
            "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
            questions.length === 0 &&
              "opacity-50 cursor-not-allowed hover:bg-blue-600"
          )}
          disabled={questions.length === 0}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}
