import React from "react";
import { cn } from "@/lib/utils";

interface QuestionContentProps {
  currentQuestion: {
    id: string;
    content: string;
    options: string[];
  };
  currentQuestionIndex: number;
  totalQuestions: number;
  userAnswers: Record<string, string>;
  onAnswerSelect: (questionId: string, answer: string) => void;
}

export default function QuestionContent({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  userAnswers,
  onAnswerSelect
}: QuestionContentProps) {
  const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H"];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-3">
        <div className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full">
          Question{" "}
          <span className="mx-1 font-medium">
            {currentQuestionIndex + 1}
          </span>{" "}
          of {totalQuestions}
        </div>
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          3 points
        </div>
      </div>

      <h2 className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
        {currentQuestion.content}
      </h2>

      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = userAnswers[currentQuestion.id] === option;

          return (
            <div
              key={index}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all duration-200",
                isSelected
                  ? "border-blue-600 bg-blue-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              )}
              onClick={() => onAnswerSelect(currentQuestion.id, option)}
            >
              <div className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  {alphabet[index]}
                </div>
                <div>{option}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}