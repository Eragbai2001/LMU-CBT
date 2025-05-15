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

    console.log("API Request params:", {
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

      console.log(
        `Year ID ${yearId} corresponds to year value: ${year?.value}`
      );
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

    // Build a more permissive where condition - now including year filtering
    const whereConditions: {
      testId: string;
      topic?: { in: string[] };
      yearValue?: number;
    } = {
      testId: testId,
    };

    // Only add topic filtering if topics are selected
    if (selectedTopics.length > 0) {
      whereConditions.topic = { in: selectedTopics };
    }

    // Add year filtering if year value is available
    if (year?.value) {
      whereConditions.yearValue = year.value;
      console.log(`Filtering questions with year value: ${year.value}`);
    } else {
      console.log(
        "Not filtering by year value - either year not found or yearValue field not used"
      );
    }

    console.log("Question where conditions:", whereConditions);

    // Separate query for questions with the updated filtering
    const questions = await prisma.question.findMany({
      where: whereConditions,
      select: {
        id: true,
        content: true,
        options: true,
        image: true,
        points: true,
        topic: true,
      },
    });

    console.log(`Found ${questions.length} questions for test: ${test.title}`);

    // If no questions found with current filtering, try without year filter
    if (questions.length === 0 && year?.value) {
      console.log(
        "No questions found with year filter - trying without year filter"
      );
      const questionsWithoutYearFilter = await prisma.question.findMany({
        where: {
          testId: testId,
          ...(selectedTopics.length > 0
            ? { topic: { in: selectedTopics } }
            : {}),
        },
        select: {
          id: true,
          content: true,
          options: true,
          image: true,
          points: true,
          topic: true,
        },
      });

      if (questionsWithoutYearFilter.length > 0) {
        console.log(
          `Found ${questionsWithoutYearFilter.length} questions without year filter`
        );
        // Return questions without year filter if that works
        const response = {
          test: {
            id: test.id,
            title: test.title,
            description: test.description,
            questionCount: questionsWithoutYearFilter.length,
            duration: 60,
            year: year ? year.value : new Date().getFullYear(),
            selectedTopics: selectedTopics.length > 0 ? selectedTopics : null,
          },
          questions: questionsWithoutYearFilter,
          sessionId: null as string | null, // Change type to allow string or null
        };

        if (yearId && (durationId || durationId === "no-time")) {
          try {
            const sessionData = {
              userId: "anonymous",
              testId: test.id,
              yearId,
              durationId: durationId !== "no-time" ? durationId : undefined,
              topics: selectedTopics.length > 0 ? selectedTopics : [],
            };

            const session = await prisma.practiceSession.create({
              data: sessionData,
            });

            response.sessionId = session.id; // Now this assignment is valid
            console.log(`Created session with ID: ${session.id}`);
          } catch (err) {
            console.error("Error creating practice session:", err);
          }
        }

        return NextResponse.json(response);
      }
    }

    // Get duration value synchronously
    let duration = null;
    if (durationId && durationId !== "no-time") {
      duration = await prisma.duration.findUnique({
        where: { id: durationId },
      });
      console.log(
        `Duration ID ${durationId} corresponds to ${
          duration?.minutes || "unknown"
        } minutes`
      );
    }

    // Format the response
    const response = {
      test: {
        id: test.id,
        title: test.title,
        description: test.description,
        questionCount: questions.length,
        duration: duration?.minutes || 60, // Use actual duration or default to 60
        year: year ? year.value : new Date().getFullYear(),
        selectedTopics: selectedTopics.length > 0 ? selectedTopics : null,
      },
      questions: questions,
      sessionId: null as string | null, // Change type to allow string or null
    };

    // Create a practice session if necessary
    if (yearId && (durationId || durationId === "no-time")) {
      try {
        const sessionData = {
          userId: "anonymous",
          testId: test.id,
          yearId,
          durationId: durationId !== "no-time" ? durationId : undefined,
          topics: selectedTopics.length > 0 ? selectedTopics : [],
        };

        const session = await prisma.practiceSession.create({
          data: sessionData,
        });

        response.sessionId = session.id; // Now this assignment is valid
        console.log(`Created session with ID: ${session.id}`);
      } catch (err) {
        console.error("Error creating practice session:", err);
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in test-questions API:", error);
    return NextResponse.json(
      { error: "Failed to fetch test questions: " + (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
