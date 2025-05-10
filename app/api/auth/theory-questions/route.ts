import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const testId = searchParams.get("testId");
  const durationId = searchParams.get("durationId");
  const yearId = searchParams.get("yearId");
  const selectedTopics = searchParams.getAll("topic");

  if (!testId) {
    return NextResponse.json({ error: "Test ID is required" }, { status: 400 });
  }

  try {
    // Base query for test details
    const test = await prisma.practiceTest.findUnique({
      where: { id: testId },
      select: {
        id: true,
        title: true,
        description: true,
        questionCount: true,
        testType: true, // Check test type
        durationOptions: {
          where:
            durationId && durationId !== "no-time"
              ? { id: durationId }
              : undefined,
          select: { minutes: true },
        },
        yearOptions: {
          where: yearId ? { id: yearId } : undefined,
          select: { value: true },
        },
      },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Verify this is a theory test
    if (test.testType !== "theory") {
      return NextResponse.json(
        { error: "This is not a theory test" },
        { status: 400 }
      );
    }

    // Get test questions
    const questions = await prisma.question.findMany({
      where: {
        testId: String(testId),
        ...(selectedTopics.length > 0 ? { topic: { in: selectedTopics } } : {}),
      },
      select: {
        id: true,
        content: true,
        image: true,
        points: true,
        topic: true,
        theoryAnswer: true,
      },
    });

    // Create a practice session if all parameters are provided
    let session = null;

    if (yearId && (durationId || durationId === "no-time")) {
      const sessionData = {
        userId: "anonymous", // We'll use a default user ID like in test-questions
        testId: String(testId),
        yearId,
        durationId: durationId !== "no-time" ? durationId : undefined,
        topics: selectedTopics.length > 0 ? selectedTopics : [],
      };

      session = await prisma.practiceSession.create({
        data: sessionData,
      });
    }

    // Format the response
    const response = {
      test: {
        id: test.id,
        title: test.title,
        description: test.description,
        questionCount: test.questionCount,
        duration: test.durationOptions[0]?.minutes || null,
        year: test.yearOptions[0]?.value || null,
        selectedTopics: selectedTopics.length > 0 ? selectedTopics : null,
      },
      questions: questions.map((q) => ({
        id: q.id,
        content: q.content,
        image: q.image,
        points: q.points,
        topic: q.topic,
        // Don't expose the reference answer to the frontend, we'll grade on the backend
      })),
      sessionId: session?.id,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[THEORY_QUESTIONS]", error);
    return NextResponse.json(
      { error: "Failed to load theory test" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
