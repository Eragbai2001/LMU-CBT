"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Award,
  Check,
  Clock,
  Eye,
  HelpCircle,
  Info,
  Lightbulb,
  X,
  ClipboardCopy,
  FileText, // Added for theory-specific display
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

// Define a more specific type for theory questions if available
// For now, using 'any' for flexibility
interface TheoryQuestionResult {
  id: string;
  question: string;
  yourAnswer: string;
  correctAnswer?: string; // Or reference answer
  status: "correct" | "incorrect" | "partial" | "skipped"; // Adjusted for theory
  score?: number;
  feedback?: string;
  section?: string;
  explanation?: string;
  points?: number; // Points for the question
}

interface TheoryTestResult {
  testName: string;
  studentName?: string;
  overallScore: number; // Percentage or total points
  totalPossiblePoints?: number;
  achievedPoints?: number;
  performanceRating: string; // e.g., "Excellent", "Needs Improvement"
  timeTaken?: string;
  timeAllowed?: string;
  questions: TheoryQuestionResult[];
  strengths?: string[];
  improvements?: string[];
  sectionPerformance?: Array<{
    name: string;
    score: number; // Percentage or points
    totalQuestions?: number;
    correctQuestions?: number;
  }>;
  // Theory specific fields
  testType: "Theory";
  totalQuestions: number; // Still relevant
  correctAnswers: number; // Count of fully correct (if applicable)
  partiallyCorrectAnswers?: number;
  incorrectAnswers: number;
  skippedQuestions: number;
}

export default function TheoryResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get("testId");
  const sessionId = searchParams.get("sessionId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<TheoryTestResult | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  // Fetch results data
  useEffect(() => {
    if (!testId || !sessionId) {
      setError("Missing required parameters: testId and sessionId.");
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        // IMPORTANT: This API endpoint will need to be created or adjusted
        // to serve theory test results.
        const response = await fetch(
          `/api/theory-result?testId=${testId}&sessionId=${sessionId}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `Server returned ${response.status}` }));
          throw new Error(errorData.message || `Server returned ${response.status}`);
        }

        const data = await response.json();
        // Add a type check or transformation if the API returns a different structure
        setTestResult(data as TheoryTestResult);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching theory test results:", error);
        setError(error.message || "Failed to load test results. Please try again.");
        setLoading(false);
      }
    };

    fetchResults();
  }, [testId, sessionId]);

  // Display loading state
  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent align-[-0.125em]"></div>
        <p className="mt-4 text-gray-600">Loading your theory test results...</p>
      </div>
    );
  }

  // Display error state
  if (error || !testResult) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <Info size={32} className="text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700 mb-6">
          {error || "Failed to load theory test results"}
        </p>
        <Button onClick={() => router.push("/dashboard/practice/theory")}>
          Return to Theory Practice
        </Button>
      </div>
    );
  }

  // Calculate percentages for the charts
  const correctPercentage = testResult.totalQuestions > 0 ? (testResult.correctAnswers / testResult.totalQuestions) * 100 : 0;
  const incorrectPercentage = testResult.totalQuestions > 0 ? (testResult.incorrectAnswers / testResult.totalQuestions) * 100 : 0;
  const skippedPercentage = testResult.totalQuestions > 0 ? (testResult.skippedQuestions / testResult.totalQuestions) * 100 : 0;
  const partiallyCorrectPercentage = testResult.totalQuestions > 0 && testResult.partiallyCorrectAnswers ? (testResult.partiallyCorrectAnswers / testResult.totalQuestions) * 100 : 0;


  // Get performance badge color
  const getBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 75) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  // Get status icon and color for theory questions
  const getStatusDisplay = (status: TheoryQuestionResult["status"]) => {
    switch (status) {
      case "correct":
        return {
          icon: <Check className="h-5 w-5 text-green-500" />,
          color: "text-green-500",
          bgColor: "bg-green-50 border-green-100",
        };
      case "incorrect":
        return {
          icon: <X className="h-5 w-5 text-red-500" />,
          color: "text-red-500",
          bgColor: "bg-red-50 border-red-100",
        };
      case "partial":
        return {
          icon: <Check className="h-5 w-5 text-yellow-500" />, // Or a different icon
          color: "text-yellow-600",
          bgColor: "bg-yellow-50 border-yellow-100",
        };
      case "skipped":
        return {
          icon: <Clock className="h-5 w-5 text-gray-400" />,
          color: "text-gray-400",
          bgColor: "bg-gray-50 border-gray-200",
        };
      default:
        return {
          icon: <Info className="h-5 w-5 text-gray-500" />,
          color: "text-gray-500",
          bgColor: "bg-gray-50 border-gray-200",
        };
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">{testResult.testName} - Theory Results</h1>
          <p className="text-gray-500">
            {testResult.studentName || "Your Results"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={`px-3 py-1 text-sm font-medium ${getBadgeColor(
              testResult.overallScore
            )}`}
          >
            <Award className="mr-1 h-4 w-4" /> {testResult.performanceRating}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            Download PDF
          </Button>
          <Button
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Copied!
              </>
            ) : (
              <>
                <ClipboardCopy className="mr-2 h-4 w-4" /> Share Results
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Question Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Overall Score</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={
                          testResult.overallScore >= 80 ? "#4ade80" :
                          testResult.overallScore >= 60 ? "#facc15" :
                          "#f87171"
                        }
                        strokeWidth="10"
                        strokeDasharray={`${testResult.overallScore * 2.83} ${283 - testResult.overallScore * 2.83}`}
                        strokeDashoffset="70.75" // Starts the circle at the top
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-5xl font-bold">
                        {testResult.overallScore}%
                      </span>
                      {testResult.achievedPoints !== undefined && testResult.totalPossiblePoints !== undefined && (
                         <span className="text-sm text-gray-500 mt-1">
                           {testResult.achievedPoints} / {testResult.totalPossiblePoints} points
                         </span>
                       )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className={`grid ${testResult.partiallyCorrectAnswers !== undefined ? 'grid-cols-4' : 'grid-cols-3'} gap-4 mb-6`}>
                  <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                    <span className="text-2xl font-bold text-green-600">{testResult.correctAnswers}</span>
                    <span className="text-sm text-green-700">Correct</span>
                    <span className="text-xs text-green-600 mt-1">{correctPercentage.toFixed(0)}%</span>
                  </div>
                  {testResult.partiallyCorrectAnswers !== undefined && (
                    <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
                      <span className="text-2xl font-bold text-yellow-600">{testResult.partiallyCorrectAnswers}</span>
                      <span className="text-sm text-yellow-700">Partial</span>
                      <span className="text-xs text-yellow-600 mt-1">{partiallyCorrectPercentage.toFixed(0)}%</span>
                    </div>
                  )}
                  <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
                    <span className="text-2xl font-bold text-red-600">{testResult.incorrectAnswers}</span>
                    <span className="text-sm text-red-700">Incorrect</span>
                    <span className="text-xs text-red-600 mt-1">{incorrectPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-2xl font-bold text-gray-600">{testResult.skippedQuestions}</span>
                    <span className="text-sm text-gray-700">Skipped</span>
                    <span className="text-xs text-gray-600 mt-1">{skippedPercentage.toFixed(0)}%</span>
                  </div>
                </div>

                {testResult.timeTaken && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Time Taken</span>
                      <span className="text-sm text-gray-500">
                        {testResult.timeTaken} / {testResult.timeAllowed || "No time limit"}
                      </span>
                    </div>
                    {/* Basic time visualization, can be enhanced */}
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
                      {/* Add logic for time taken percentage if needed */}
                    </div>
                  </>
                )}

                {testResult.sectionPerformance && testResult.sectionPerformance.length > 0 && (
                    <>
                      <h3 className="font-medium text-sm mb-4">Recommended Focus Areas</h3>
                      <div className="space-y-2">
                        {testResult.sectionPerformance
                          .sort((a, b) => a.score - b.score)
                          .slice(0, 2) // Show top 2 areas for improvement
                          .map((section, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <HelpCircle className="h-4 w-4 text-amber-500" />
                              <span className="text-sm">{section.name} ({section.score}%)</span>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
              </CardContent>
            </Card>
          </div>

          {testResult.sectionPerformance && testResult.sectionPerformance.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Section Performance</CardTitle>
                  <CardDescription>How you performed in each section of the theory test</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {testResult.sectionPerformance.map((section, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{section.name}</span>
                              {section.totalQuestions && <Badge variant="outline" className="text-xs">{section.totalQuestions} questions</Badge>}
                            </div>
                            <span className="text-sm font-medium">{section.score}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                section.score >= 90 ? "bg-green-500" :
                                section.score >= 75 ? "bg-blue-500" :
                                section.score >= 60 ? "bg-yellow-500" :
                                "bg-red-500"
                              }`}
                              style={{ width: `${section.score}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Performance Insights</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-green-700 flex items-center gap-2 mb-2">
                    <Check className="h-5 w-5" /> Strengths
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {testResult.strengths && testResult.strengths.length > 0 ? (
                      testResult.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>{strength}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No specific strengths identified. Keep practicing!</li>
                    )}
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-amber-700 flex items-center gap-2 mb-2">
                    <HelpCircle className="h-5 w-5" /> Areas for Improvement
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {testResult.improvements && testResult.improvements.length > 0 ? (
                      testResult.improvements.map((improvement, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <HelpCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                          <span>{improvement}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No specific areas for improvement highlighted. Great job!</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Question Analysis</CardTitle>
              <CardDescription>Review each question, your answer, and the model solution or feedback.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-3 text-sm font-medium text-gray-700">Q#</th>
                      {testResult.questions[0]?.section && <th className="p-3 text-sm font-medium text-gray-700">Section</th>}
                      <th className="p-3 text-sm font-medium text-gray-700">Status</th>
                      {testResult.questions[0]?.points !== undefined && <th className="p-3 text-sm font-medium text-gray-700">Points</th>}
                      <th className="p-3 text-sm font-medium text-gray-700">Your Answer (Summary)</th>
                      <th className="p-3 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {testResult.questions.map((question, index) => {
                      const { icon, color } = getStatusDisplay(question.status);
                      return (
                        <tr key={question.id || index} className="hover:bg-gray-50">
                          <td className="p-3 text-sm">{index + 1}</td>
                          {question.section && <td className="p-3 text-sm">{question.section}</td>}
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              {icon}
                              <span className={`text-sm ${color}`}>
                                {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
                              </span>
                            </div>
                          </td>
                          {question.points !== undefined && (
                            <td className="p-3 text-sm">
                                {question.score !== undefined ? `${question.score}/` : ''}{question.points}
                            </td>
                          )}
                          <td className="p-3 text-sm truncate max-w-xs">
                            {question.yourAnswer ? (question.yourAnswer.substring(0, 50) + (question.yourAnswer.length > 50 ? "..." : "")) : <span className="italic text-gray-500">No answer</span>}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                          <DialogTitle>Question {index + 1}</DialogTitle>
                                          {question.section && <DialogDescription>{question.section}</DialogDescription>}
                                        </DialogHeader>
                                        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                                          <div className="space-y-2">
                                            <h4 className="text-sm font-medium">Question:</h4>
                                            <p className="text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{question.question}</p>
                                          </div>

                                          <div className="space-y-2">
                                            <h4 className="text-sm font-medium">Your Answer:</h4>
                                            <div className={`text-sm p-3 rounded-lg whitespace-pre-wrap border ${getStatusDisplay(question.status).bgColor}`}>
                                              {question.yourAnswer || <span className="italic text-gray-500">No answer provided.</span>}
                                            </div>
                                          </div>

                                          {question.correctAnswer && (
                                            <div className="space-y-2">
                                              <h4 className="text-sm font-medium">Model Answer / Reference:</h4>
                                              <p className="text-sm bg-green-50 p-3 rounded-lg border border-green-100 whitespace-pre-wrap">{question.correctAnswer}</p>
                                            </div>
                                          )}
                                          
                                          {question.feedback && (
                                            <div className="space-y-2">
                                              <h4 className="text-sm font-medium">Feedback:</h4>
                                              <p className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-100 whitespace-pre-wrap">{question.feedback}</p>
                                            </div>
                                          )}

                                          {question.explanation && (
                                            <div className="space-y-2">
                                              <h4 className="text-sm font-medium">Explanation:</h4>
                                              <p className="text-sm bg-indigo-50 p-3 rounded-lg whitespace-pre-wrap">{question.explanation}</p>
                                            </div>
                                          )}
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </TooltipTrigger>
                                  <TooltipContent><p>View Details</p></TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              {/* Placeholder for AI help if needed */}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start justify-start border rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {
                // Potentially link to a review mode for theory questions
                // For now, goes back to question analysis tab
                setActiveTab("questions");
              }}
            >
              <h3 className="font-medium flex items-center gap-2 mb-2 w-full text-left">
                <FileText className="h-5 w-5 text-amber-500" /> Review Answers
              </h3>
              <p className="text-sm text-gray-600 text-left">Carefully review your answers against the model solutions or feedback provided.</p>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start justify-start border rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => router.push(`/ai-help?testId=${testId}&sessionId=${sessionId}&type=theory`)} // Add type=theory
            >
              <h3 className="font-medium flex items-center gap-2 mb-2 w-full text-left">
                <Lightbulb className="h-5 w-5 text-blue-500" /> AI-Powered Tutoring
              </h3>
              <p className="text-sm text-gray-600 text-left">Get personalized explanations and guidance on challenging theory concepts.</p>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start justify-start border rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => router.push("/dashboard/practice/theory")}
            >
              <h3 className="font-medium flex items-center gap-2 mb-2 w-full text-left">
                <Award className="h-5 w-5 text-green-500" /> Take Another Theory Test
              </h3>
              <p className="text-sm text-gray-600 text-left">Challenge yourself with another practice test to solidify your understanding.</p>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 