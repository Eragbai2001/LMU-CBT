import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { testId, answers, completedAt, userId } = await request.json();
    
    // Ensure userId is provided in the request
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    // Count correct, incorrect, and skipped answers
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let skippedQuestions = 0;
    
    // Fetch questions for this test to compare answers
    const questions = await prisma.question.findMany({
      where: { testId },
      select: { id: true, correctAnswer: true },
    });
    
    const totalQuestions = questions.length;
    
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      
      if (!userAnswer) {
        skippedQuestions++;
      } else if (question.correctAnswer === userAnswer) {
        correctAnswers++;
      } else {
        incorrectAnswers++;
      }
    });
    
    // Calculate score as percentage
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Create TestResult record
 const result = await prisma.testResult.create({
  data: {
    userId: userId,
    test: {
      connect: { id: testId }
    },
    sessionId: `session_${Date.now()}`, // Generate a unique session ID
    score,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    skippedQuestions,
    timeTaken: "00:00", // You'd calculate this from start/end time
    completedAt: new Date(completedAt),
    answersJson: JSON.stringify(answers),
  }
});
    
    return NextResponse.json({ 
      success: true, 
      sessionId: result.id, 
      message: "Test results saved successfully" 
    });
    
  } catch (error) {
    console.error("Error saving test results:", error);
    return NextResponse.json(
      { error: "Failed to save test results" }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}