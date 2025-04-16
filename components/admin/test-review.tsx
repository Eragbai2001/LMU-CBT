"use client";

import { Save, Check, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface TestData {
  title: string;
  description: string;
  icon: string;
  totalQuestions: number;
  duration: number;
  year: number;
  questions: Question[];
  isPopular: boolean;
}

interface TestReviewProps {
  testData: TestData;
  onBack: () => void;
  onSave: () => void;
}

export default function TestReview({
  testData,
  onBack,
  onSave,
}: TestReviewProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Review Test</h2>

      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium mb-2">Test Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Title</p>
              <p className="font-medium">{testData.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{testData.duration} minutes</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-medium">{testData.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Number of Questions</p>
              <p className="font-medium">{testData.totalQuestions}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{testData.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Questions Added</p>
              <p className="font-medium">
                {testData.questions.length} questions
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Popular</p>
              <p className="font-medium">{testData.isPopular ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Questions Preview</h3>
          <div className="max-h-96 overflow-y-auto pr-2">
            {testData.questions.map((question, index) => (
              <div
                key={question.id}
                className="border border-gray-200 rounded-lg p-4 mb-4"
              >
                <div className="flex items-start">
                  <span className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-medium mr-3 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <p className="font-medium mb-3">{question.text}</p>
                      {question.topic && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {question.topic}
                        </span>
                      )}
                    </div>

                    {question.image && (
                      <div className="bg-gray-100 p-3 rounded-md text-center mb-3 relative">
                        <div className="aspect-video bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                          <span className="ml-2 text-gray-500">
                            Image attached
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 mb-2">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className={cn(
                            "flex items-center p-2 rounded-md",
                            question.correctAnswer === option.id
                              ? "bg-green-50 border border-green-200"
                              : ""
                          )}
                        >
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm",
                              question.correctAnswer === option.id
                                ? "bg-green-600 text-white"
                                : "bg-gray-100"
                            )}
                          >
                            {option.id}
                          </div>
                          <span>{option.text}</span>
                          {question.correctAnswer === option.id && (
                            <Check className="h-4 w-4 text-green-600 ml-auto" />
                          )}
                        </div>
                      ))}
                    </div>

                    {question.solution && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm font-medium text-yellow-800 mb-1">
                          Solution:
                        </p>
                        <p className="text-sm text-yellow-700">
                          {question.solution}
                        </p>
                      </div>
                    )}

                    <p className="text-sm text-gray-500 mt-3">
                      {question.points} points
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Save className="h-4 w-4 mr-2" /> Save Test
        </button>
      </div>
    </div>
  );
}
