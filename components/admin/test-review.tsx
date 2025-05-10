"use client";

import { Save, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface Question {
  id: number;
  text: string;
  points: number;
  options?: { id: string; text: string }[];
  correctAnswer?: string;
  image?: string;
  topic?: string;
  solution?: string;
  theoryAnswer?: string;
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
  points: number;
  testType: "objective" | "theory";
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
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave();
    } catch (error) {
      console.error("Error saving test:", error);
    } finally {
      setLoading(false);
    }
  };

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
              <p className="text-sm text-gray-500">Test Type</p>
              <p className="font-medium capitalize">{testData.testType}</p>
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
            <div>
              <p className="text-sm text-gray-500">Points</p>
              <p className="font-medium">{testData.points}</p>
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
                        <div className="aspect-video bg-gray-200 flex items-center justify-center overflow-hidden">
                          <Image
                            width={50}
                            height={20}
                            src={question.image}
                            alt="Question image"
                            className="object-contain w-full h-full"
                            onError={() => {
                              // Fallback if image fails to load
                              const parent =
                                document.querySelector(".aspect-video");
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="flex items-center justify-center w-full h-full">
                                    <svg class="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span class="ml-2 text-gray-500">Image failed to load</span>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {testData.testType === "objective" && question.options ? (
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
                    ) : testData.testType === "theory" &&
                      question.theoryAnswer ? (
                      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm font-medium text-blue-800 mb-1">
                          Reference Answer:
                        </p>
                        <p className="text-sm text-blue-700">
                          {question.theoryAnswer}
                        </p>
                      </div>
                    ) : null}

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
          onClick={handleSave}
          className={`px-6 py-2 rounded-lg flex items-center justify-center transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" /> Save Test
            </>
          )}
        </button>
      </div>
    </div>
  );
}
