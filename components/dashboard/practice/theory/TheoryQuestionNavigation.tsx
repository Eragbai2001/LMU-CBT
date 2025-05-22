import { Flag, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TheoryQuestionNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  questionId: string;
  isFlagged: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFlag: (questionId: string) => void;
  isLastQuestion?: boolean;
}

export default function TheoryQuestionNavigation({
  currentQuestionIndex,
  totalQuestions,
  questionId,
  isFlagged,
  onPrevious,
  onNext,
  onFlag,
  isLastQuestion = false,
}: TheoryQuestionNavigationProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-t border-gray-200 rounded-b-lg">
      <div className="flex items-center">
        <button
          onClick={() => onFlag(questionId)}
          className={cn(
            "flex items-center p-2 mr-3 rounded-md text-sm transition-colors",
            isFlagged
              ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
              : "hover:bg-gray-100 text-gray-600"
          )}
        >
          <Flag size={16} className="mr-1.5" />
          <span>{isFlagged ? "Flagged" : "Flag"}</span>
        </button>

        <span className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
          className={cn(
            "px-4 py-2 flex items-center rounded-md text-sm font-medium",
            currentQuestionIndex === 0
              ? "text-gray-400 cursor-not-allowed"
              : "border border-gray-300 hover:bg-gray-50"
          )}
        >
          <ChevronLeft size={16} className="mr-1" /> Previous
        </button>

        <button
          onClick={onNext}
          className={cn(
            "px-4 py-2 flex items-center rounded-md text-sm font-medium",
            isLastQuestion
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          )}
        >
          {isLastQuestion ? "Submit" : "Next"}
          {!isLastQuestion && <ChevronRight size={16} className="ml-1" />}
        </button>
      </div>
    </div>
  );
}
