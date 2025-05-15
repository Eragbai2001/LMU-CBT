import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const testId = searchParams.get("testId");
    const durationId = searchParams.get("durationId");
    const yearId = searchParams.get("yearId");
    const selectedTopics = searchParams.getAll("topic");

    console.log("Theory API Request params:", {
      testId,
      durationId,
      yearId,
      selectedTopics,
    });

    if (!testId) {
      return NextResponse.json(
        { error: "Test ID is required" },
        { status: 400 }
      );
    }

    // Get year value from yearId
    let year = null;
    if (yearId) {
      year = await prisma.year.findUnique({
        where: { id: yearId },
        select: { value: true },
      });

      if (!year) {
        console.log(`Year with ID ${yearId} not found`);
      } else {
        console.log(`Year ID ${yearId} corresponds to year ${year.value}`);
      }
    }

    // Base query for test details
    const test = await prisma.practiceTest.findUnique({
      where: { id: testId },
      select: {
        id: true,
        title: true,
        description: true,
        questionCount: true,
        icon: true,
        isPopular: true,
        testType: true,
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

    // Fetch selected duration if provided
    let duration = null;
    if (durationId && durationId !== "no-time") {
      duration = await prisma.duration.findUnique({
        where: { id: durationId },
      });

      if (duration) {
        console.log(`Duration: ${duration.minutes} minutes`);
      }
    }

    // Create a practice session if all parameters are provided
    let session = null;
    if (yearId && (durationId || durationId === "no-time")) {
      try {
        const sessionData = {
          userId: "anonymous",
          testId: String(testId),
          yearId,
          durationId: durationId !== "no-time" ? durationId : undefined,
          topics: selectedTopics.length > 0 ? selectedTopics : [],
        };

        session = await prisma.practiceSession.create({
          data: sessionData,
        });
        console.log(`Created theory session with ID: ${session.id}`);
      } catch (error) {
        console.error("Error creating theory session:", error);
      }
    }

    // Build where conditions for questions based on topics and year
    const whereConditions: {
      testId: string;
      topic?: { in: string[] };
      yearValue?: number;
    } = {
      testId: testId,
    };

    // Add topic filtering
    if (selectedTopics.length > 0) {
      whereConditions.topic = { in: selectedTopics };
    }

    // Add year filtering if year value is available
    if (year?.value) {
      whereConditions.yearValue = year.value;
      console.log(`Filtering theory questions with year value: ${year.value}`);
    }

    console.log("Theory question where conditions:", whereConditions);

    // Query for questions with both topic and year filtering
    const questions = await prisma.question.findMany({
      where: whereConditions,
      select: {
        id: true,
        content: true,
        image: true,
        points: true,
        topic: true,
        theoryAnswer: true,
        solution: true, // Also select the solution field
      },
    });

    // Format the response
    const response = {
      test: {
        id: test.id,
        title: test.title,
        description: test.description,
        questionCount: questions.length,
        duration: duration ? duration.minutes : null,
        year: year ? year.value : null,
        selectedTopics: selectedTopics.length > 0 ? selectedTopics : null,
      },
      questions: questions.map((q) => ({
        id: q.id,
        content: q.content,
        image: q.image,
        points: q.points,
        topic: q.topic,
        theoryAnswer: q.theoryAnswer, // Include the reference answer in response
        solution: q.solution, // Include the solution in response
      })),
      sessionId: session?.id,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[THEORY_QUESTIONS] API error:", error);
    return NextResponse.json(
      { error: "Failed to load theory test: " + (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
