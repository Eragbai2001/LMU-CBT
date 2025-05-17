import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get the query parameters
    const searchParams = request.nextUrl.searchParams;
    const testId = searchParams.get("testId");
    const sessionId = searchParams.get("sessionId");

    if (!testId || !sessionId) {
      return NextResponse.json(
        { error: "Test ID and Session ID are required" },
        { status: 400 }
      );
    }

    // Debug: Check what TestResults exist for this test
    const allTestResults = await prisma.testResult.findMany({
      where: { testId: testId },
      select: { id: true, sessionId: true },
    });

    console.log("Available TestResults for this test:", allTestResults);

    // Fetch the test result
    const testResult = await prisma.testResult.findUnique({
      where: { id: sessionId }, // Use the TestResult ID that's passed from the client
      include: {
        test: true,
      },
    });

    console.log("Found testResult:", testResult);

    if (!testResult) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    // Fetch questions and user answers
    const questions = await prisma.question.findMany({
      where: { testId: testId },
    });

    // Parse the stored answers
    const userAnswers = JSON.parse(testResult.answersJson || "{}");

    // Format questions for display
    const processedQuestions = questions.map((q) => {
      const userAnswer = userAnswers[q.id] || "";
      const status = !userAnswer
        ? "skipped"
        : q.correctAnswer === null || q.correctAnswer === undefined
        ? "answered" // For theory questions
        : q.correctAnswer === userAnswer
        ? "correct"
        : "incorrect";

      return {
        id: q.id,
        question: q.content,
        status,
        section: q.topic || "General",
        yourAnswer: userAnswer || "Not answered",
        correctAnswer: q.correctAnswer || "N/A",
        explanation: q.solution || "",
      };
    });

    interface TopicCount {
      correct: number;
      total: number;
    }

    // Calculate section performance
    const topicCounts: Record<string, TopicCount> = {};

    processedQuestions.forEach((q) => {
      if (!q.section) return;

      if (!topicCounts[q.section]) {
        topicCounts[q.section] = { correct: 0, total: 0 };
      }

      topicCounts[q.section].total += 1;
      if (q.status === "correct") {
        topicCounts[q.section].correct += 1;
      }
    });

    const sectionPerformance = Object.keys(topicCounts).map((topic) => ({
      name: topic,
      score: Math.round(
        (topicCounts[topic].correct / topicCounts[topic].total) * 100
      ),
      totalQuestions: topicCounts[topic].total,
    }));
    // Get performance rating
    let performanceRating = "Needs Improvement";
    if (testResult.score >= 90) performanceRating = "Excellent";
    else if (testResult.score >= 80) performanceRating = "Very Good";
    else if (testResult.score >= 70) performanceRating = "Good";
    else if (testResult.score >= 60) performanceRating = "Satisfactory";

    const result = {
      testName: testResult.test.title,
      studentName: "Student", // Default student name without session
      overallScore: testResult.score,
      totalQuestions: testResult.totalQuestions,
      correctAnswers: testResult.correctAnswers,
      incorrectAnswers: testResult.incorrectAnswers,
      skippedQuestions: testResult.skippedQuestions,
      timeTaken: testResult.timeTaken || "00:00",
      timeAllowed: testResult.test.duration
        ? `${testResult.test.duration}:00`
        : null,
      performanceRating,
      sectionPerformance,
      questions: processedQuestions,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error retrieving test results:", error);
    return NextResponse.json(
      { error: "Failed to retrieve test results" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
