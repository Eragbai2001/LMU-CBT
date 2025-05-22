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
    
    // Fetch questions for this test with all relevant fields
    const questions = await prisma.question.findMany({
      where: { testId },
      select: { 
        id: true, 
        correctAnswer: true,
        content: true,  // Get question content
        options: true,  // Get all options
        solution: true  // Get explanation if available
      },
    });
    
    console.log(`Found ${questions.length} questions for test: ${testId}`);
    
    const totalQuestions = questions.length;
    
    // Define interface for question data
    interface QuestionData {
      content: string;
      correctAnswer: string | null;
      options: any[];
      explanation: string;
    }
    
    // Create a map to store the full question data for reference
    const questionData: Record<string, QuestionData> = {};
    
      questions.forEach(question => {
      const userAnswer = answers[question.id];
      
      // Store question data for reference in results
      questionData[question.id] = {
        content: question.content,
        correctAnswer: question.correctAnswer,
        options: question.options,
        explanation: question.solution || ""
      };
      
      if (!userAnswer) {
        skippedQuestions++;
      } else {
        // Map between different answer formats
        let isCorrect = false;
        
        // Case 1: If correctAnswer is a letter (A, B, C, D) and userAnswer is a value
        if (question.correctAnswer && question.correctAnswer.match(/^[A-D]$/i)) {
          // Convert A->0, B->1, C->2, D->3
          const correctIndex = question.correctAnswer.toUpperCase().charCodeAt(0) - 65;
          // Check if the user's answer matches the option at that index
          if (question.options && question.options[correctIndex] === userAnswer) {
            isCorrect = true;
          }
        }
        // Case 2: If correctAnswer is a direct value
        else if (question.correctAnswer === userAnswer) {
          isCorrect = true;
        }
        
        // Update counters
        if (isCorrect) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      }
    });
    
    // Calculate score as percentage
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Create TestResult record with enhanced data
    const result = await prisma.testResult.create({
      data: {
        userId: userId,
        test: {
          connect: { id: testId }
        },
        sessionId: `session_${Date.now()}`,
        score,
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        skippedQuestions,
        timeTaken: "00:00",
        completedAt: new Date(completedAt),
        answersJson: JSON.stringify(answers),
        questionDataJson: JSON.stringify(questionData) // Store additional question data
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