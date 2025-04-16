import React from "react";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  questionId: string;
  isFlagged: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFlag: (id: string) => void;
}

export default function QuestionNavigation({
  currentQuestionIndex,
  totalQuestions,
  questionId,
  isFlagged,
  onPrevious,
  onNext,
  onFlag
}: QuestionNavigationProps) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
      <button
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        className={cn(
          "px-4 py-2 rounded-lg flex items-center transition-colors",
          currentQuestionIndex === 0
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        <ChevronLeft size={16} className="mr-1" />
        Previous
      </button>

      <button
        onClick={() => onFlag(questionId)}
        className={cn(
          "px-4 py-2 rounded-lg flex items-center transition-colors",
          isFlagged
            ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        <Flag
          size={16}
          className={cn("mr-1", isFlagged && "fill-yellow-600")}
        />
        {isFlagged ? "Unflag" : "Flag"}
      </button>

      <button
        onClick={onNext}
        disabled={currentQuestionIndex === totalQuestions - 1}
        className={cn(
          "px-4 py-2 rounded-lg flex items-center transition-colors",
          currentQuestionIndex === totalQuestions - 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        Next
        <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  );
}