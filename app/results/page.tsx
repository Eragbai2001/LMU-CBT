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

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get("testId");
  const sessionId = searchParams.get("sessionId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch results data
  useEffect(() => {
    if (!testId || !sessionId) {
      setError("Missing required parameters");
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(
          `/api/result?testId=${testId}&sessionId=${sessionId}`
        );

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();
        setTestResult(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching results:", error);
        setError("Failed to load test results. Please try again.");
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
        <p className="mt-4 text-gray-600">Loading your test results...</p>
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
          {error || "Failed to load test results"}
        </p>
        <Button onClick={() => router.push("/dashboard/practice")}>
          Return to Practice
        </Button>
      </div>
    );
  }

  // Calculate percentages for the charts
  const correctPercentage =
    (testResult.correctAnswers / testResult.totalQuestions) * 100;
  const incorrectPercentage =
    (testResult.incorrectAnswers / testResult.totalQuestions) * 100;
  const skippedPercentage =
    (testResult.skippedQuestions / testResult.totalQuestions) * 100;

  // Get performance badge color
  const getBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 75) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  // Get status icon and color
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "correct":
        return {
          icon: <Check className="h-5 w-5 text-green-500" />,
          color: "text-green-500",
        };
      case "incorrect":
        return {
          icon: <X className="h-5 w-5 text-red-500" />,
          color: "text-red-500",
        };
      case "skipped":
        return {
          icon: <Clock className="h-5 w-5 text-gray-400" />,
          color: "text-gray-400",
        };
      default:
        return {
          icon: <Info className="h-5 w-5 text-gray-500" />,
          color: "text-gray-500",
        };
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">{testResult.testName}</h1>
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
          <Button size="sm">Share Results</Button>
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
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={
                          testResult.overallScore >= 80
                            ? "#4ade80"
                            : testResult.overallScore >= 60
                            ? "#facc15"
                            : "#f87171"
                        }
                        strokeWidth="10"
                        strokeDasharray={`${testResult.overallScore * 2.83} ${
                          283 - testResult.overallScore * 2.83
                        }`}
                        strokeDashoffset="70.75"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-5xl font-bold">
                        {testResult.overallScore}%
                      </span>
                      <span className="text-sm text-gray-500 mt-1">
                        {testResult.correctAnswers} of{" "}
                        {testResult.totalQuestions} correct
                      </span>
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
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                    <span className="text-2xl font-bold text-green-600">
                      {testResult.correctAnswers}
                    </span>
                    <span className="text-sm text-green-700">Correct</span>
                    <span className="text-xs text-green-600 mt-1">
                      {correctPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
                    <span className="text-2xl font-bold text-red-600">
                      {testResult.incorrectAnswers}
                    </span>
                    <span className="text-sm text-red-700">Incorrect</span>
                    <span className="text-xs text-red-600 mt-1">
                      {incorrectPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-2xl font-bold text-gray-600">
                      {testResult.skippedQuestions}
                    </span>
                    <span className="text-sm text-gray-700">Skipped</span>
                    <span className="text-xs text-gray-600 mt-1">
                      {skippedPercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {testResult.timeTaken && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Time Taken</span>
                      <span className="text-sm text-gray-500">
                        {testResult.timeTaken} /{" "}
                        {testResult.timeAllowed || "No time limit"}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${
                            ((Number.parseInt(
                              testResult.timeTaken.split(":")[0]
                            ) *
                              60 +
                              Number.parseInt(
                                testResult.timeTaken.split(":")[1]
                              )) /
                              (Number.parseInt(
                                testResult.timeAllowed?.split(":")[0] || "0"
                              ) *
                                60 +
                                Number.parseInt(
                                  testResult.timeAllowed?.split(":")[1] || "0"
                                ) || 1)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </>
                )}

                {testResult.sectionPerformance &&
                  testResult.sectionPerformance.length > 0 && (
                    <>
                      <h3 className="font-medium text-sm mb-4">
                        Recommended Focus Areas
                      </h3>
                      <div className="space-y-2">
                        {testResult.sectionPerformance
                          .sort((a: any, b: any) => a.score - b.score)
                          .slice(0, 2)
                          .map((section: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <HelpCircle className="h-4 w-4 text-amber-500" />
                              <span className="text-sm">
                                {section.name} ({section.score}%)
                              </span>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
              </CardContent>
            </Card>
          </div>

          {/* Section Performance - only if sections data is available */}
          {testResult.sectionPerformance &&
            testResult.sectionPerformance.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Section Performance</CardTitle>
                  <CardDescription>
                    How you performed in each section of the test
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {testResult.sectionPerformance.map(
                      (section: any, index: number) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {section.name}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {section.totalQuestions} questions
                              </Badge>
                            </div>
                            <span className="text-sm font-medium">
                              {section.score}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                section.score >= 90
                                  ? "bg-green-500"
                                  : section.score >= 75
                                  ? "bg-blue-500"
                                  : section.score >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
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

          {/* Performance Insights */}
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
                    {testResult.strengths ? (
                      testResult.strengths.map(
                        (strength: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        )
                      )
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>
                            Completed {testResult.correctAnswers} questions
                            correctly
                          </span>
                        </li>
                        {testResult.sectionPerformance &&
                          testResult.sectionPerformance
                            .sort((a: any, b: any) => b.score - a.score)
                            .slice(0, 2)
                            .map((section: any, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>
                                  Strong performance in {section.name} (
                                  {section.score}%)
                                </span>
                              </li>
                            ))}
                      </>
                    )}
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-amber-700 flex items-center gap-2 mb-2">
                    <HelpCircle className="h-5 w-5" /> Areas for Improvement
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {testResult.improvements ? (
                      testResult.improvements.map(
                        (improvement: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <HelpCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                            <span>{improvement}</span>
                          </li>
                        )
                      )
                    ) : (
                      <>
                        {testResult.incorrectAnswers > 0 && (
                          <li className="flex items-start gap-2">
                            <HelpCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                            <span>
                              Review the {testResult.incorrectAnswers} questions
                              you answered incorrectly
                            </span>
                          </li>
                        )}
                        {testResult.sectionPerformance &&
                          testResult.sectionPerformance
                            .sort((a: any, b: any) => a.score - b.score)
                            .slice(0, 2)
                            .map((section: any, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <HelpCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                                <span>
                                  Focus on improving {section.name} (
                                  {section.score}%)
                                </span>
                              </li>
                            ))}
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          {/* Question Analysis */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Question Analysis</CardTitle>
              <CardDescription>
                Review all questions and see where you went wrong
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-3 text-sm font-medium text-gray-700">
                        Q#
                      </th>
                      {testResult.questions[0]?.section && (
                        <th className="p-3 text-sm font-medium text-gray-700">
                          Section
                        </th>
                      )}
                      <th className="p-3 text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="p-3 text-sm font-medium text-gray-700">
                        Your Answer
                      </th>
                      <th className="p-3 text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {testResult.questions.map((question: any) => {
                      const { icon, color } = getStatusDisplay(question.status);
                      return (
                        <tr key={question.id} className="hover:bg-gray-50">
                          <td className="p-3 text-sm">{question.id}</td>
                          {question.section && (
                            <td className="p-3 text-sm">{question.section}</td>
                          )}
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              {icon}
                              <span className={`text-sm ${color}`}>
                                {question.status.charAt(0).toUpperCase() +
                                  question.status.slice(1)}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-sm">{question.yourAnswer}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Question {question.id}
                                          </DialogTitle>
                                          {question.section && (
                                            <DialogDescription>
                                              {question.section}
                                            </DialogDescription>
                                          )}
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                          <div className="space-y-2">
                                            <h4 className="text-sm font-medium">
                                              Question:
                                            </h4>
                                            <p className="text-sm bg-gray-50 p-3 rounded-lg">
                                              {question.question}
                                            </p>
                                          </div>

                                          <div className="space-y-2">
                                            <h4 className="text-sm font-medium">
                                              Your Answer:
                                            </h4>
                                            <div
                                              className={`text-sm p-3 rounded-lg ${
                                                question.status === "correct"
                                                  ? "bg-green-50 border border-green-100"
                                                  : question.status ===
                                                    "incorrect"
                                                  ? "bg-red-50 border border-red-100"
                                                  : "bg-gray-50 border border-gray-200"
                                              }`}
                                            >
                                              <p>{question.yourAnswer}</p>
                                            </div>
                                          </div>

                                          <div className="space-y-2">
                                            <h4 className="text-sm font-medium">
                                              Correct Answer:
                                            </h4>
                                            <p className="text-sm bg-green-50 p-3 rounded-lg border border-green-100">
                                              {question.correctAnswer}
                                            </p>
                                          </div>

                                          {question.explanation && (
                                            <div className="space-y-2">
                                              <h4 className="text-sm font-medium">
                                                Explanation:
                                              </h4>
                                              <p className="text-sm bg-blue-50 p-3 rounded-lg">
                                                {question.explanation}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View Question</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              {question.status === "incorrect" && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                      >
                                        <Lightbulb className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Ask AI for Help</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
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

          {/* Question Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" /> Correct Answers
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {testResult.questions
                    .filter((q: any) => q.status === "correct")
                    .map((question: any) => (
                      <Badge
                        key={question.id}
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Q{question.id}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" /> Incorrect Answers
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {testResult.questions
                    .filter((q: any) => q.status === "incorrect")
                    .map((question: any) => (
                      <Badge
                        key={question.id}
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200"
                      >
                        Q{question.id}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" /> Skipped Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {testResult.questions
                    .filter((q: any) => q.status === "skipped")
                    .map((question: any) => (
                      <Badge
                        key={question.id}
                        variant="outline"
                        className="bg-gray-100 text-gray-700 border-gray-200"
                      >
                        Q{question.id}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Next Steps */}
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start justify-start border rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() =>
                testResult.incorrectAnswers > 0 &&
                router.push(`/review?testId=${testId}&sessionId=${sessionId}`)
              }
            >
              <h3 className="font-medium flex items-center gap-2 mb-2 w-full text-left">
                <HelpCircle className="h-5 w-5 text-amber-500" /> Review Weak
                Areas
              </h3>
              <p className="text-sm text-gray-600 text-left">
                Focus on the questions you got wrong with targeted practice.
              </p>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start justify-start border rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() =>
                router.push(`/ai-help?testId=${testId}&sessionId=${sessionId}`)
              }
            >
              <h3 className="font-medium flex items-center gap-2 mb-2 w-full text-left">
                <Lightbulb className="h-5 w-5 text-blue-500" /> AI-Powered
                Tutoring
              </h3>
              <p className="text-sm text-gray-600 text-left">
                Get personalized explanations for questions you answered
                incorrectly.
              </p>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start justify-start border rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => router.push("/dashboard/practice")}
            >
              <h3 className="font-medium flex items-center gap-2 mb-2 w-full text-left">
                <Award className="h-5 w-5 text-green-500" /> Take Another Test
              </h3>
              <p className="text-sm text-gray-600 text-left">
                Challenge yourself with another practice test to improve your
                knowledge.
              </p>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
