"use client";

import { Trash2, AlertCircle } from "lucide-react";

interface Question {
  id: number;
  text: string;
  points: number;
  options: { id: string; text: string }[];
  correctAnswer: string;
  image?: string;
  topic?: string;
  solution?: string;
}

interface QuestionListProps {
  questions: Question[];
  error?: string;
  onRemoveQuestion: (id: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function QuestionList({
  questions,
  error,
  onRemoveQuestion,
  onBack,
  onNext,
}: QuestionListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">
        Added Questions ({questions.length})
      </h2>

      {questions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No questions added yet. Use the form above to add questions.
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={
                typeof question.id === "string"
                  ? question.id
                  : `question-${index}`
              }
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-medium mr-3">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{question.text}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {question.points} points • {question.options.length}{" "}
                      options
                      {question.image && " • Has image"}
                      {question.topic && ` • Topic: ${question.topic}`}
                      {question.solution && " • Has solution"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveQuestion(question.id)}
                  className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-500 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" /> {error}
        </p>
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
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={questions.length === 0}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}
