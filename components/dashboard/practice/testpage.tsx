"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import SkeletonLoader from "./skeletonLoader";
import TestHeader from "./testpageheader";
import StatsBar from "./statsbar";
import QuestionContent from "./questioncontent";
import QuestionNavigation from "./questionNavigation";

interface Question {
  id: string;
  content: string;
  options: string[];
  image: string;
  points: number;
}

interface TestData {
  test: {
    id: string;
    title: string;
    description: string;
    questionCount: number;
    duration: number;
    year: number;
    image: string;
    points: number;
  };
  questions: Question[];
  sessionId: string;
}

// Skeleton loader with improved layout

export default function TestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const testId = searchParams.get("testId");
  const durationId = searchParams.get("durationId");
  const yearId = searchParams.get("yearId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimeWarning, setIsTimeWarning] = useState(false);

  // Fetch test data when component mounts
  useEffect(() => {
    if (!testId) {
      setError("Test ID is required");
      setLoading(false);
      return;
    }

    const fetchTestData = async () => {
      try {
        const response = await fetch(
          `/api/auth/test-questions?testId=${testId}${
            durationId ? `&durationId=${durationId}` : ""
          }${yearId ? `&yearId=${yearId}` : ""}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch test data");
        }

        const data = await response.json();
        setTestData(data);

        // Initialize timer if duration is available
        if (data.test.duration) {
          setTimeRemaining(data.test.duration * 60); // Convert minutes to seconds
        }

        // Add a small delay to make the skeleton loader visible
        setTimeout(() => {
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching test data:", error);
        setError("Failed to load test. Please try again.");
        setLoading(false);
      }
    };

    fetchTestData();
  }, [testId, durationId, yearId]);

  // Timer effect
  useEffect(() => {
    if (!timeRemaining || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev && prev > 0) {
          // Set warning when less than 5 minutes remain
          if (prev <= 300 && !isTimeWarning) {
            setIsTimeWarning(true);
          }
          return prev - 1;
        }
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isTimeWarning]);

  // Format time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(questionId)) {
        newFlagged.delete(questionId);
      } else {
        newFlagged.add(questionId);
      }
      return newFlagged;
    });
  };

  const goToNextQuestion = () => {
    if (testData && currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const goToQuestion = (index: number) => {
    if (testData && index >= 0 && index < testData.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleFinishTest = async () => {
    const hasUnanswered =
      testData && testData.questions.length > Object.keys(userAnswers).length;

    if (
      hasUnanswered &&
      !window.confirm(
        "You have unanswered questions. Are you sure you want to finish the test?"
      )
    ) {
      return;
    }

    console.log("Finishing test with answers:", userAnswers);
    router.push("/dashboard");
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error || !testData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-6">
            {error || "An unknown error occurred"}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = testData.questions[currentQuestionIndex];
  const totalQuestions = testData.questions.length;
  const answeredQuestionsCount = Object.keys(userAnswers).length;
  const progressPercentage = Math.round(
    (answeredQuestionsCount / totalQuestions) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <TestHeader
        title={testData.test.title}
        year={testData.test.year}
        timeRemaining={timeRemaining}
        isTimeWarning={isTimeWarning}
        onReturnHome={() => router.push("/dashboard/practice")}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Bar */}
        <StatsBar
          progressPercentage={progressPercentage}
          answeredQuestionsCount={answeredQuestionsCount}
          totalQuestions={totalQuestions}
          flaggedCount={flaggedQuestions.size}
          duration={testData.test.duration}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main question content */}
          <div className="flex-grow">
            <QuestionContent
              currentQuestion={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              userAnswers={userAnswers}
              onAnswerSelect={handleAnswerSelect}
            />

            {/* Navigation controls */}
            <QuestionNavigation
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              questionId={currentQuestion.id}
              isFlagged={flaggedQuestions.has(currentQuestion.id)}
              onPrevious={goToPreviousQuestion}
              onNext={goToNextQuestion}
              onFlag={handleFlagQuestion}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 bg-white rounded-lg shadow-sm p-6 ">
            {/* Timer */}
            <div className="mb-6 text-center">
              <div
                className={cn(
                  "text-3xl font-bold",
                  isTimeWarning ? "text-red-600" : "text-gray-800"
                )}
              >
                {timeRemaining !== null ? formatTime(timeRemaining) : "--:--"}
              </div>
              <div className="text-sm text-gray-500">Time Remaining</div>
            </div>

            <div className="h-px bg-gray-200 my-6"></div>

            {/* Progress */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2 text-gray-500 uppercase">
                Progress
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all duration-500",
                    progressPercentage > 75 ? "bg-green-500" : "bg-blue-600"
                  )}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {answeredQuestionsCount}/{totalQuestions} Questions Answered (
                {progressPercentage}%)
              </div>
            </div>

            <div className="h-px bg-gray-200 my-6"></div>

            {/* Question navigation */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-500 uppercase">
                Questions
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {testData.questions.map((question, index) => {
                  const isAnswered = !!userAnswers[question.id];
                  const isFlagged = flaggedQuestions.has(question.id);
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={question.id}
                      onClick={() => goToQuestion(index)}
                      className={cn(
                        "w-full h-10 flex items-center justify-center rounded text-sm font-medium transition-colors",
                        isCurrent && "ring-2 ring-blue-600",
                        isAnswered
                          ? "bg-blue-100 text-blue-700"
                          : isFlagged
                          ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-gray-200 my-6"></div>

            {/* Legend */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-gray-500 uppercase">
                Legend
              </h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-100 rounded-full mr-1"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-50 border border-yellow-200 rounded-full mr-1"></div>
                  <span>Flagged</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-100 rounded-full mr-1"></div>
                  <span>Unanswered</span>
                </div>
              </div>
            </div>

            {/* Finish button */}
            <button
              onClick={handleFinishTest}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Finish Test
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
