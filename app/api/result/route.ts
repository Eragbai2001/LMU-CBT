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
    const storedQuestionData = JSON.parse(testResult.questionDataJson || "{}");

    // Format questions for display
        // In your app/api/result/route.ts file
    const processedQuestions = questions.map((q) => {
      const userAnswer = userAnswers[q.id] || "";
      const storedQuestion = storedQuestionData[q.id] || {};
      const correctAnswer = storedQuestion?.correctAnswer || q.correctAnswer || "N/A";
      
      // Determine if the answer is correct with format handling
      let isCorrect = false;
      
      if (!userAnswer) {
        // Skip comparison for unanswered questions
      } else if (correctAnswer === userAnswer) {
        // Direct match - user selected "A" and correct answer is "A"
        isCorrect = true;
      } else if (correctAnswer.match(/^[A-D]$/i) && storedQuestion.options) {
        // Letter format - convert "A" to index and check option value
        const correctIndex = correctAnswer.toUpperCase().charCodeAt(0) - 65; // A->0, B->1, etc.
        if (storedQuestion.options[correctIndex] === userAnswer) {
          isCorrect = true;
        }
      }
      
      const status = !userAnswer 
        ? "skipped" 
        : isCorrect ? "correct" : "incorrect";
    
      return {
        id: q.id,
        question: q.content,
        status, // Now uses the proper comparison
        section: q.topic || "General",
        yourAnswer: userAnswer || "Not answered",
        correctAnswer: storedQuestion.options && correctAnswer.match(/^[A-D]$/i)
          ? `${correctAnswer} (${storedQuestion.options[correctAnswer.charCodeAt(0) - 65]})`
          : correctAnswer,
        explanation: storedQuestion?.explanation || q.solution || "",
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
