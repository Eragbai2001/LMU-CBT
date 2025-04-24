import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      icon,
      isPopular,
      questionCount,
      duration,
      year,
      questions,
    } = body;

    const testId = uuidv4();

    const test = await prisma.practiceTest.create({
      data: {
        id: testId,
        title,
        description,
        icon,
        isPopular,
        questionCount,
        durationOptions: {
          connectOrCreate: {
            where: {
              id: String(duration),
            },
            create: {
              id: String(duration),
              minutes: duration,
            },
          },
        },
        yearOptions: {
          connectOrCreate: {
            where: {
              id: String(year),
            },
            create: {
              id: String(year),
              value: year,
            },
          },
        },
      },
    });

    // Create questions
    type Question = {
      text: string;
      options: { text: string }[];
      correctAnswer: string;
      solution?: string;
      topic?: string;
      image?: string;

      points?: number;
    };

    const questionPayload = questions.map((q: Question) => ({
      id: uuidv4(),
      content: q.text,
      options: q.options.map((o: { text: string }) => o.text),
      correctAnswer: q.correctAnswer,
      solution: q.solution || "No solution yet",
      topic: q.topic || "General",
      image: q.image || null,
      points: q.points || 0,
      testId: test.id,
    }));

    await prisma.question.createMany({
      data: questionPayload,
    });

    return NextResponse.json({ message: "Test created", test });
  } catch (error) {
    console.error("[CREATE_TEST]", error);
    return NextResponse.json(
      { error: "Failed to create test" },
      { status: 500 }
    );
  }
}
