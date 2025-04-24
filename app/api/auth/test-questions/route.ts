import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const testId = searchParams.get("testId");
  const durationId = searchParams.get("durationId");
  const yearId = searchParams.get("yearId");

  if (!testId) {
    return NextResponse.json({ error: "Test ID is required" }, { status: 400 });
  }

  try {
    // Fetch the test details
    const test = await prisma.practiceTest.findUnique({
      where: { id: testId },
      include: {
        questions: {
          select: {
            id: true,
            content: true,
            options: true,
            image: true,
            points: true, // <- Add this
          },
        },
      },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Fetch selected duration and year if provided
    let duration = null;
    let year = null;

    if (durationId) {
      duration = await prisma.duration.findUnique({
        where: { id: durationId },
      });
    }

    if (yearId) {
      year = await prisma.year.findUnique({
        where: { id: yearId },
      });
    }

    // Create a practice session if all parameters are provided
    let session = null;

    if (yearId && (durationId || durationId === "no-time")) {
      const sessionData: {
        userId: string;
        testId: string;
        yearId: string;
        durationId?: string;
      } = {
        userId: "anonymous",
        testId,
        yearId,
      };

      if (durationId !== "no-time") {
        sessionData.durationId = durationId;
      }

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
        question: test.questions,
        questionCount: test.questionCount,
        duration: duration ? duration.minutes : null,
        year: year ? year.value : null,
      },
      questions: test.questions.map((q) => ({
        id: q.id,
        content: q.content,
        options: q.options,
        image: q.image,
        points: q.points,
        // Do not include correct answer in the response to prevent cheating
      })),
      sessionId: session?.id,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching test questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch test questions" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
