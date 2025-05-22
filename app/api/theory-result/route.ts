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

    // Fetch the test result
    const testResult = await prisma.testResult.findUnique({
      where: { id: sessionId }, // Use the TestResult ID that's passed from the client
      include: {
        test: true,
      },
    });

    if (!testResult) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    // Fetch questions and user answers
    const questions = await prisma.question.findMany({
      where: { testId: testId },
    });

    // Parse the stored answers
    const userAnswers = JSON.parse(testResult.answersJson || "{}");

    // Format questions for display - theory-specific processing
    const processedQuestions = questions.map((q) => {
      const userAnswer = userAnswers[q.id] || "";
      
      // For theory questions, we determine status differently
      let status: "skipped" | "answered" = !userAnswer || userAnswer.trim() === "" ? "skipped" : "answered";

      return {
        id: q.id,
        question: q.content,
        status,
        section: q.topic || "General",
        yourAnswer: userAnswer || "",
        correctAnswer: q.theoryAnswer || "", // Reference answer for theory questions
        explanation: q.solution || "",
        points: q.points || 0,
      };
    });

    // Calculate section performance for theory tests
    interface TopicCount {
      answered: number;
      total: number;
    }

    const topicCounts: Record<string, TopicCount> = {};

    processedQuestions.forEach((q) => {
      if (!q.section) return;

      if (!topicCounts[q.section]) {
        topicCounts[q.section] = { answered: 0, total: 0 };
      }

      topicCounts[q.section].total += 1;
      if (q.status === "answered") {
        topicCounts[q.section].answered += 1;
      }
    });

    const sectionPerformance = Object.keys(topicCounts).map((topic) => ({
      name: topic,
      score: Math.round(
        (topicCounts[topic].answered / topicCounts[topic].total) * 100
      ),
      totalQuestions: topicCounts[topic].total,
      correctQuestions: topicCounts[topic].answered, // For theory, this represents answered questions
    }));

    // Get performance rating based on completion rate
    let performanceRating = "Needs Improvement";
    if (testResult.score >= 90) performanceRating = "Excellent Completion";
    else if (testResult.score >= 80) performanceRating = "Very Good Completion";
    else if (testResult.score >= 70) performanceRating = "Good Completion";
    else if (testResult.score >= 60) performanceRating = "Satisfactory Completion";

    // Count answered vs skipped for theory tests
    const answeredQuestions = processedQuestions.filter(q => q.status === "answered").length;
    const skippedQuestions = processedQuestions.filter(q => q.status === "skipped").length;

    const result = {
      testName: testResult.test.title,
      studentName: "Student", // Default student name
      overallScore: testResult.score, // This is completion score for theory tests
      totalPossiblePoints: questions.reduce((sum, q) => sum + (q.points || 0), 0),
      achievedPoints: 0, // Would be calculated after grading
      performanceRating,
      timeTaken: testResult.timeTaken || "00:00",
      timeAllowed: testResult.test.duration ? `${testResult.test.duration}:00` : null,
      questions: processedQuestions,
      strengths: [
        `Completed ${answeredQuestions} out of ${testResult.totalQuestions} questions`,
        "Demonstrated engagement with the material"
      ],
      improvements: skippedQuestions > 0 ? [
        `Complete the ${skippedQuestions} skipped questions`,
        "Provide more detailed explanations where possible"
      ] : [
        "Consider providing more detailed explanations",
        "Review and expand on key concepts"
      ],
      sectionPerformance,
      // Theory specific fields
      testType: "Theory" as const,
      totalQuestions: testResult.totalQuestions,
      correctAnswers: 0, // Will be updated after grading
      partiallyCorrectAnswers: 0, // Could be used for partial credit
      incorrectAnswers: 0, // Will be updated after grading
      skippedQuestions: skippedQuestions,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error retrieving theory test results:", error);
    return NextResponse.json(
      { error: "Failed to retrieve theory test results" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 