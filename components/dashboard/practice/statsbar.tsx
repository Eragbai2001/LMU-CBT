import React from "react";

interface StatsBarProps {
  progressPercentage: number;
  answeredQuestionsCount: number;
  totalQuestions: number;
  flaggedCount: number;
  duration: number;
}

export default function StatsBar({
  progressPercentage,
  answeredQuestionsCount,
  totalQuestions,
  flaggedCount,
  duration
}: StatsBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 justify-between">
      <div className="flex flex-wrap gap-6">
        <div>
          <div className="text-sm text-gray-500">Progress</div>
          <div className="font-medium">{progressPercentage}%</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Answered</div>
          <div className="font-medium">
            {answeredQuestionsCount}/{totalQuestions}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Flagged</div>
          <div className="font-medium">{flaggedCount}</div>
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Duration</div>
        <div className="font-medium">{duration} min</div>
      </div>
    </div>
  );
}