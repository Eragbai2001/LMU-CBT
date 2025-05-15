import React from "react";

interface AnswerFeedback {
  score?: number;
  feedback: string;
  strengths?: string[];
  improvements?: string[];
}

interface AnswerFeedbackDisplayProps {
  answerFeedback: AnswerFeedback | null;
  isChecking: boolean;
}

export default function AnswerFeedbackDisplay({
  answerFeedback,
  isChecking
}: AnswerFeedbackDisplayProps) {
  return (
    <>
      {answerFeedback && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-medium text-blue-800 mb-2">
            Answer Feedback
            {answerFeedback.score !== undefined && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 rounded-md text-sm">
                {answerFeedback.score}/10
              </span>
            )}
          </h4>
          
          <div className="prose prose-sm max-w-none text-blue-700 mb-3">
            <p>{answerFeedback.feedback}</p>
          </div>
          
          {answerFeedback.strengths && answerFeedback.strengths.length > 0 && (
            <div className="mt-3">
              <h5 className="font-medium text-green-700 mb-1">Strengths:</h5>
              <ul className="list-disc pl-5 text-sm text-green-700">
                {answerFeedback.strengths.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          {answerFeedback.improvements && answerFeedback.improvements.length > 0 && (
            <div className="mt-3">
              <h5 className="font-medium text-amber-700 mb-1">Areas for Improvement:</h5>
              <ul className="list-disc pl-5 text-sm text-amber-700">
                {answerFeedback.improvements.map((improvement, i) => (
                  <li key={i}>{improvement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {isChecking && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
          <div className="animate-pulse flex items-center">
            <span className="mr-3">Checking your answer</span>
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-1 animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      )}
    </>
  );
}