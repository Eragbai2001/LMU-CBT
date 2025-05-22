import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { testId, sessionId, answers, completedAt } = await request.json();
    
    if (!testId || !sessionId) {
      return NextResponse.json({ error: "Test ID and Session ID are required" }, { status: 400 });
    }
    
    // Fetch questions for this test
    const questions = await prisma.question.findMany({
      where: { testId },
      select: { id: true, theoryAnswer: true, points: true },
    });
    
    const totalQuestions = questions.length;
    let skippedQuestions = 0;
    let answeredQuestions = 0;
    
    // Count answered vs skipped questions
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      
      if (!userAnswer || userAnswer.trim() === "") {
        skippedQuestions++;
      } else {
        answeredQuestions++;
      }
    });
    
    // For theory tests, we calculate a completion score based on answered questions
    // The actual grading would be done manually or through AI evaluation
    const completionScore = Math.round((answeredQuestions / totalQuestions) * 100);
    
    // Create TestResult record for theory test
    const result = await prisma.testResult.create({
      data: {
        userId: "anonymous", // Default for now, could be improved with session management
        test: {
          connect: { id: testId }
        },
        sessionId: sessionId, // Use the provided session ID
        score: completionScore, // Completion score for now
        totalQuestions,
        correctAnswers: 0, // Will be updated after manual/AI grading
        incorrectAnswers: 0, // Will be updated after manual/AI grading
        skippedQuestions,
        timeTaken: "00:00", // You'd calculate this from start/end time if needed
        completedAt: new Date(completedAt),
        answersJson: JSON.stringify(answers),
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      sessionId: result.id, 
      message: "Theory test submitted successfully" 
    });
    
  } catch (error) {
    console.error("Error saving theory test results:", error);
    return NextResponse.json(
      { error: "Failed to save theory test results" }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 