"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  Save,
  ArrowLeft,
  Flag,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

import TheoryQuestion from "./TheoryQuestion";

import AIAssistancePanel from "./AIAssistancePanel";
import TheoryTestSkeleton from "./TheoryTestSkeleton";
import AnswerFeedbackDisplay from "./AnswerFeedbackDisplay";

interface TheoryQuestion {
  id: string;
  content: string;
  image?: string | null;
  points: number;
  topic: string;
  theoryAnswer?: string | null;
  solution?: string | null;
}

interface TheoryTestData {
  test: {
    id: string;
    title: string;
    description: string;
    questionCount: number;
    year: number;
    selectedTopics: string[] | null;
  };
  questions: TheoryQuestion[];
  sessionId: string | null;
}

export default function TheoryTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const testId = searchParams.get("testId");
  const yearId = searchParams.get("yearId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testData, setTestData] = useState<TheoryTestData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState("question");
  const [showReferencePoints, setShowReferencePoints] = useState(false);

  const totalQuestions = testData?.questions.length || 0;
  const [isChecking, setIsChecking] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<{
    score?: number;
    feedback: string;
    strengths?: string[];
    improvements?: string[];
  } | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch test data with offline support
  useEffect(() => {
    if (!testId) return;

    const fetchData = async () => {
      setLoading(true);

      // Try to get data from cache first
      const cacheKey = `theory_test_${testId}_${yearId}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          setTestData(parsedData);

          // Also load saved answers if any
          const savedAnswers = localStorage.getItem(`theory_answers_${testId}`);
          if (savedAnswers) {
            setUserAnswers(JSON.parse(savedAnswers));
          }

          setLoading(false);
        } catch (e) {
          console.error("Error parsing cached data", e);
          // Continue to fetch fresh data
        }
      }

      // Only fetch fresh data if online
      if (navigator.onLine) {
        try {
          const response = await fetch(
            `/api/auth/theory-questions?testId=${testId}&yearId=${yearId}`
          );

          // Better error handling - don't throw directly
          if (!response.ok) {
            const errorText = await response
              .text()
              .catch(() => "No error details");
            console.error(`Server error (${response.status}): ${errorText}`);
            setError(
              `Failed to load test (${response.status}). Please try again.`
            );
            setLoading(false);
            return; // Early return to avoid further processing
          }

          const data = await response.json();

          // Cache the data
          localStorage.setItem(cacheKey, JSON.stringify(data));
          setTestData(data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching theory test:", err);
          setError(
            "Failed to load test. Please check your connection and try again."
          );
          setLoading(false);
        }
      } else if (!cachedData) {
        // No cached data and offline
        setError("You're offline and no cached data is available.");
        setLoading(false);
      }
    };

    fetchData();
  }, [testId, yearId]);

  // Save answers to local storage whenever they change
  useEffect(() => {
    if (testId && Object.keys(userAnswers).length > 0) {
      localStorage.setItem(
        `theory_answers_${testId}`,
        JSON.stringify(userAnswers)
      );
    }
  }, [userAnswers, testId]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const goToNextQuestion = () => {
    if (testData && currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
    }
  };

   const handleFinishTest = async () => {
    if (testData) {
      try {
        const completedTest = {
          testId: testData.test.id,
          sessionId: testData.sessionId, // Pass the practice session ID
          answers: userAnswers,
          completedAt: new Date().toISOString(),
        };
  
        // Save to localStorage as backup
        localStorage.setItem(
          `completed_theory_${testData.test.id}`,
          JSON.stringify(completedTest)
        );
        
        // Send to server API
        const response = await fetch('/api/submit-test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(completedTest)
        });
        
        if (!response.ok) {
          throw new Error('Failed to save test results');
        }
        
        // Redirect to results page
        router.push(`/results?testId=${testData.test.id}&sessionId=${testData.sessionId}`);
      } catch (error) {
        console.error('Error saving test results:', error);
        router.push('/dashboard/practice');
      }
    }
  };

  const toggleAIPanel = () => {
    setAiPanelOpen(!aiPanelOpen);
  };

  const handleFlagQuestion = (id: string) => {
    setFlaggedQuestions((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const handleSaveAnswer = () => {
    // Save the answer
    const currentQuestion = testData?.questions[currentQuestionIndex];
    if (currentQuestion?.id) {
      handleAnswerChange(
        currentQuestion.id,
        userAnswers[currentQuestion.id] || ""
      );
    }

    // Show temporary confirmation
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000);
  };

  const handleCheckAnswer = async () => {
    if (!currentQuestion?.id || !userAnswers[currentQuestion.id]) {
      // Show a message that they need to answer first
      return;
    }

    setIsChecking(true);

    try {
      const response = await fetch("/api/check-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          userAnswer: userAnswers[currentQuestion.id],
          referenceAnswer:
            currentQuestion.solution || currentQuestion.theoryAnswer,
          questionContent: currentQuestion.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to check answer");
      }

      const result = await response.json();
      setAnswerFeedback(result);
    } catch (error) {
      console.error("Error checking answer:", error);
      setAnswerFeedback({
        feedback:
          "We couldn't check your answer right now. Please try again later.",
      });
    } finally {
      setIsChecking(false);
    }
  };

  if (loading) {
    return <TheoryTestSkeleton />;
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
            {error || "Failed to load test data"}
          </p>
          <button
            onClick={() => router.push("/dashboard/practice")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = testData.questions[currentQuestionIndex];
  const progressPercentage = Math.round(
    ((currentQuestionIndex + 1) / totalQuestions) * 100
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-10  ">
        <div className="max-w-6xl mx-auto px-4 py-3 border-b border-gray-200 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard/practice")}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft size={18} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {testData?.test.title}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Theory Test • {testData?.test.year}
                  </span>
                  {testData?.test.selectedTopics &&
                    testData.test.selectedTopics.length > 0 && (
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                        {testData.test.selectedTopics[0]}
                      </span>
                    )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleFlagQuestion(currentQuestion?.id || "")}
                className={cn(
                  "flex items-center gap-1 px-3 py-1 rounded-full text-sm",
                  flaggedQuestions.has(currentQuestion?.id || "")
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Flag size={14} />
                {flaggedQuestions.has(currentQuestion?.id || "")
                  ? "Flagged"
                  : "Flag"}
              </button>

              <button
                onClick={toggleAIPanel}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                <Lightbulb size={14} />
                AI Help
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span>{progressPercentage}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  progressPercentage > 75 ? "bg-green-500" : "bg-purple-600"
                )}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content with tabs */}

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row w-full">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab navigation */}
          <div className="bg-white ">
            <div className="px-6 py-2">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("question")}
                  className={cn(
                    "px-4 py-3 font-medium text-sm border-b-2 transition-colors",
                    activeTab === "question"
                      ? "border-purple-600 text-purple-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  Question
                </button>
                <button
                  onClick={() => setActiveTab("answer")}
                  className={cn(
                    "px-4 py-3 font-medium text-sm border-b-2 transition-colors ml-8",
                    activeTab === "answer"
                      ? "border-purple-600 text-purple-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  Your Answer
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div className=" p-6">
              {activeTab === "question" ? (
                /* Question Content */
                <TheoryQuestion question={currentQuestion} />
              ) : (
                /* Answer Editor with Preview Mode */
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                    <h3 className="text-lg font-medium text-gray-800">
                      Your Answer
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className="flex items-center gap-1 text-sm py-1 px-3 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                      >
                        {isPreviewMode ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                        {isPreviewMode ? "Edit" : "Preview"}
                      </button>
                      <button
                        onClick={toggleAIPanel}
                        className="flex items-center gap-1 text-sm py-1 px-3 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        <Lightbulb size={14} />
                        AI Help
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    {isPreviewMode ? (
                      <div className="min-h-[300px] prose prose-purple max-w-none p-3 bg-gray-50 rounded-lg">
                        {currentQuestion?.solution ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: currentQuestion.solution.replace(
                                /\n/g,
                                "<br/>"
                              ),
                            }}
                          />
                        ) : (
                          <p className="text-gray-400 italic">
                            No solution available
                          </p>
                        )}
                      </div>
                    ) : (
                      <textarea
                        value={userAnswers[currentQuestion?.id || ""] || ""}
                        onChange={(e) =>
                          currentQuestion?.id &&
                          handleAnswerChange(currentQuestion.id, e.target.value)
                        }
                        placeholder="Type your answer here..."
                        rows={10}
                        className="w-full min-h-[300px] p-4 border rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none resize-y"
                      />
                    )}

                    <AnswerFeedbackDisplay
                      answerFeedback={answerFeedback}
                      isChecking={isChecking}
                    />

                    {showConfirmation && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center text-green-700">
                          <CheckCircle size={16} className="mr-2" />
                          <p>Your answer has been saved successfully.</p>
                        </div>
                      </div>
                    )}

                    {currentQuestion?.theoryAnswer && (
                      <div className="mt-4">
                        <button
                          onClick={() =>
                            setShowReferencePoints(!showReferencePoints)
                          }
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          <HelpCircle size={14} className="mr-1" />
                          {showReferencePoints
                            ? "Hide reference points"
                            : "View reference points"}
                        </button>

                        {showReferencePoints && (
                          <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="font-medium text-blue-800 mb-2">
                              Reference Points
                            </h4>
                            <div className="text-sm text-blue-700 whitespace-pre-line">
                              {currentQuestion.theoryAnswer}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end mt-4 gap-2">
                      <button
                        onClick={handleCheckAnswer}
                        disabled={
                          !currentQuestion?.id ||
                          !userAnswers[currentQuestion?.id] ||
                          !userAnswers[currentQuestion?.id]?.trim()
                        }
                        className={cn(
                          "flex items-center gap-1 px-4 py-2 rounded-lg",
                          !currentQuestion?.id ||
                            !userAnswers[currentQuestion?.id] ||
                            !userAnswers[currentQuestion?.id]?.trim()
                            ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                        )}
                      >
                        <CheckCircle size={16} />
                        Check My Answer
                      </button>
                      <button
                        onClick={handleSaveAnswer}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Save size={16} />
                        Save Draft
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Assistance Panel */}
        <div
          className={cn(
            "lg:w-[400px] bg-white rounded-lg shadow-sm ml-0 lg:ml-6 flex flex-col transition-all",
            aiPanelOpen
              ? "fixed inset-0  lg:static lg:inset-auto" // Full screen on mobile, side panel on desktop
              : "hidden" // Hidden when closed
          )}
        >
          <AIAssistancePanel
            isOpen={true}
            onClose={() => setAiPanelOpen(false)}
            questionContent={currentQuestion?.content || ""}
            currentAnswer={
              currentQuestion?.id ? userAnswers[currentQuestion.id] || "" : ""
            }
          />
        </div>
      </div>

      {/* Enhanced Question Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={cn(
              "flex items-center gap-1 px-4 py-2 rounded-lg",
              currentQuestionIndex === 0
                ? "text-gray-400 cursor-not-allowed"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex gap-2">
            {(() => {
              // Determine start index to center current question when possible
              let startIdx = Math.max(0, currentQuestionIndex - 2);

              // Adjust if we're near the end to always show 5 buttons when possible
              if (
                totalQuestions >= 5 &&
                currentQuestionIndex > totalQuestions - 3
              ) {
                startIdx = Math.max(0, totalQuestions - 5);
              }

              return Array.from(
                { length: Math.min(totalQuestions, 5) },
                (_, i) => {
                  const questionNum = startIdx + i;
                  if (questionNum >= totalQuestions) return null;

                  const qId = testData?.questions[questionNum]?.id;
                  const hasAnswer = qId && !!userAnswers[qId];
                  const isFlagged = qId && flaggedQuestions.has(qId);
                  const isCurrent = questionNum === currentQuestionIndex;

                  return (
                    <button
                      key={questionNum}
                      onClick={() => goToQuestion(questionNum)}
                      className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-lg text-sm",
                        isCurrent
                          ? "bg-purple-600 text-white"
                          : hasAnswer
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : isFlagged
                          ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                    >
                      {questionNum + 1}
                    </button>
                  );
                }
              );
            })()}

            {totalQuestions > 5 &&
              currentQuestionIndex < totalQuestions - 3 && (
                <>
                  <span className="flex items-center text-gray-400">...</span>
                  <button
                    onClick={() => goToQuestion(totalQuestions - 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    {totalQuestions}
                  </button>
                </>
              )}
          </div>

          <button
            onClick={() => {
              if (currentQuestionIndex === totalQuestions - 1) {
                handleFinishTest();
              } else {
                goToNextQuestion();
              }
            }}
            className={cn(
              "flex items-center gap-1 px-4 py-2 rounded-lg",
              currentQuestionIndex === totalQuestions - 1
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-purple-600 text-white hover:bg-purple-700"
            )}
          >
            {currentQuestionIndex === totalQuestions - 1
              ? "Finish Test"
              : "Next"}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
