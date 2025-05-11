"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  AlertCircle,  Save, ArrowLeft, Flag, 
  CheckCircle, FileQuestion, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import SkeletonLoader from "./skeletonLoader";
import Image from "next/image";

interface Question {
  id: string;
  content: string;
  theoryAnswer?: string; // Reference answer
  image: string | null;
  points: number;
  topic: string;
}

interface TestData {
  test: {
    id: string;
    title: string;
    description: string;
    questionCount: number;
    duration: number;
    year: number;
    points: number;
    selectedTopics: string[] | null;
  };
  questions: Question[];
  sessionId: string;
}

export default function TheoryTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const testId = searchParams.get("testId");
  const durationId = searchParams.get("durationId");
  const yearId = searchParams.get("yearId");
  const selectedTopics = searchParams.getAll("topic");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimeWarning, setIsTimeWarning] = useState(false);
  const [collapseQuestions, setCollapseQuestions] = useState(false);

  // Fetch test data when component mounts
  useEffect(() => {
    if (!testId) {
      setError("Test ID is required");
      setLoading(false);
      return;
    }

    const fetchTestData = async () => {
      try {
        const searchString = window.location.search;
        const response = await fetch(`/api/auth/theory-questions${searchString}`);

        if (!response.ok) {
          throw new Error("Failed to fetch theory test data");
        }

        const data = await response.json();
        setTestData(data);

        if (data.test.duration && durationId !== "no-time") {
          setTimeRemaining(data.test.duration * 60);
        }

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
  }, [testId, durationId, yearId, selectedTopics]);

  // Timer effect
  useEffect(() => {
    if (!timeRemaining || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev && prev > 0) {
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

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
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

  const saveProgress = () => {
    // Implement saving progress logic here
    alert("Your progress has been saved!");
  };

  const goToQuestion = (index: number) => {
    if (testData && index >= 0 && index < testData.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleFinishTest = async () => {
    const hasUnanswered = 
      testData && testData.questions.length > Object.keys(userAnswers).length;

    if (hasUnanswered && 
      !window.confirm("You have unanswered questions. Are you sure you want to finish the test?")) {
      return;
    }

    // Submit answers logic would go here
    console.log("Submitting theory answers:", userAnswers);
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
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = testData.questions[currentQuestionIndex];
  const totalQuestions = testData.questions.length;


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - Question Navigation */}
      <div className={`${collapseQuestions ? 'w-14' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <div className={`${collapseQuestions ? 'hidden' : 'flex'} items-center`}>
            <FileQuestion size={18} className="text-purple-600 mr-2" />
            <span className="font-semibold text-sm">Questions</span>
          </div>
          <button 
            onClick={() => setCollapseQuestions(!collapseQuestions)} 
            className="p-1 rounded hover:bg-gray-100"
            aria-label={collapseQuestions ? "Expand questions panel" : "Collapse questions panel"}
          >
            <ChevronDown 
              size={18} 
              className={`text-gray-500 transform ${collapseQuestions ? 'rotate-90' : ''}`} 
            />
          </button>
        </div>
        
        {/* Question List */}
        <div className="flex-1 overflow-y-auto p-2">
          {testData.questions.map((question, index) => {
            const isAnswered = !!userAnswers[question.id];
            const isFlagged = flaggedQuestions.has(question.id);
            const isActive = index === currentQuestionIndex;
            
            return (
              <button
                key={question.id}
                onClick={() => goToQuestion(index)}
                className={cn(
                  "w-full text-left py-3 px-2 mb-1 rounded-lg text-sm relative group transition-all",
                  isActive ? "bg-purple-50 text-purple-900" : "hover:bg-gray-50",
                  collapseQuestions ? "justify-center" : "justify-between"
                )}
              >
                <div className="flex items-center">
                  {isAnswered ? (
                    <CheckCircle size={16} className="text-green-600 mr-2" />
                  ) : (
                    <span className={`flex items-center justify-center w-5 h-5 rounded-full mr-2 
                      ${isActive ? 'bg-purple-200 text-purple-900' : 'bg-gray-200 text-gray-700'}`}>
                      {index + 1}
                    </span>
                  )}
                  {!collapseQuestions && (
                    <span className={`truncate ${isActive ? "font-medium" : ""}`}>
                      {question.content.length > 30 
                        ? question.content.substring(0, 30) + "..." 
                        : question.content}
                    </span>
                  )}
                </div>
                
                {isFlagged && !collapseQuestions && (
                  <Flag size={14} className="text-yellow-600 ml-2 flex-shrink-0" />
                )}
                
                {isFlagged && collapseQuestions && (
                  <Flag size={14} className="text-yellow-600 absolute top-1 right-1" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Timer */}
        <div className="p-3 border-t border-gray-200 flex justify-center">
          {timeRemaining !== null ? (
            <div className={cn(
              "font-mono font-bold text-center",
              isTimeWarning ? "text-red-600" : "text-gray-800",
              collapseQuestions ? "text-sm" : "text-xl"
            )}>
              {formatTime(timeRemaining)}
            </div>
          ) : (
            <div className={collapseQuestions ? "text-sm" : "text-base"}>No Time Limit</div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/dashboard/practice")}
                className="p-1 mr-2 rounded-full hover:bg-gray-100"
                aria-label="Return to dashboard"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-800">{testData.test.title}</h1>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-3">Theory Test</span>
                  <span>Year: {testData.test.year}</span>
                  {testData.test.selectedTopics && testData.test.selectedTopics.length > 0 && (
                    <div className="ml-4 flex flex-wrap gap-1">
                      {testData.test.selectedTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={saveProgress}
                className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                <Save size={16} className="mr-1.5" />
                Save
              </button>
              
              <button 
                onClick={handleFinishTest}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Submit Answers
              </button>
            </div>
          </div>
        </header>
        
        {/* Question Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm">
            {/* Question Header */}
            <div className="border-b border-gray-200 p-5 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-purple-600">{currentQuestion.points}</span>
                  {currentQuestion.topic && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {currentQuestion.topic}
                    </span>
                  )}
                </div>
              </div>
              
              <button 
                onClick={() => handleFlagQuestion(currentQuestion.id)}
                className={cn(
                  "p-2 rounded-full",
                  flaggedQuestions.has(currentQuestion.id) 
                    ? "bg-yellow-100 text-yellow-700" 
                    : "text-gray-400 hover:bg-gray-100"
                )}
                aria-label={flaggedQuestions.has(currentQuestion.id) ? "Unflag question" : "Flag question"}
              >
                <Flag size={18} />
              </button>
            </div>
            
            {/* Question Content */}
            <div className="p-5">
              <h3 className="text-lg font-medium mb-5">{currentQuestion.content}</h3>
              
              {currentQuestion.image && (
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <Image 
                    src={currentQuestion.image} 
                    alt="Question image" 
                    className="max-h-64 object-contain mx-auto"
                    width={500}
                    height={500}
                  />
                </div>
              )}
              
              {/* Answer Text Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer:
                </label>
                <textarea
                  value={userAnswers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                  rows={10}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-y"
                />
              </div>
              
              {/* Question Navigation */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => goToQuestion(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className={`px-4 py-2 flex items-center rounded-lg text-sm font-medium ${
                    currentQuestionIndex === 0 
                      ? "text-gray-400 cursor-not-allowed" 
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <ArrowLeft size={16} className="mr-1" /> Previous
                </button>
                
                <button
                  onClick={() => goToQuestion(Math.min(totalQuestions - 1, currentQuestionIndex + 1))}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                  className={`px-4 py-2 flex items-center rounded-lg text-sm font-medium ${
                    currentQuestionIndex === totalQuestions - 1 
                      ? "text-gray-400 cursor-not-allowed" 
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Next <ArrowLeft size={16} className="ml-1 transform rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
