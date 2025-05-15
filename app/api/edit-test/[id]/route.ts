"use server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
// Import authOptions from your auth.ts file

const prisma = new PrismaClient();

export async function getTestById(id: string) {
  try {
    const test = await prisma.practiceTest.findUnique({
      where: { id },
      include: {
        questions: true,
        durationOptions: true,
        yearOptions: true,
      },
    });

    return test;
  } catch (error) {
    console.error("❌ Error fetching test by ID:", error);
    return null;
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id;
    console.log("Received testId:", testId);

    let body;
    try {
      body = await req.json();
      console.log("Received body:", body);
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const {
      title,
      description,
      icon,
      isPopular,
      questionCount,
      duration,
      year,
      questions,
      testType
    } = body;

    // Update test + replace questions
    const updated = await prisma.practiceTest.update({
      where: { id: testId },
      data: {
        title,
        description,
        icon,
        isPopular,
        questionCount,
        testType, // Add test type field
        durationOptions: {
          connectOrCreate: {
            where: { id: String(duration) },
            create: { id: String(duration), minutes: duration },
          },
        },
        yearOptions: {
          connectOrCreate: {
            where: { id: String(year) },
            create: { id: String(year), value: year },
          },
        },

        // Delete existing questions
        questions: {
          deleteMany: {},
        },
      },
    });

    // Create new questions (if any)
    if (questions && Array.isArray(questions)) {
      await prisma.question.createMany({
        data: questions.map(
          (q: {
            text: string;
            options?: { text: string; id: string }[];
            correctAnswer?: string;
            solution?: string;
            topic?: string;
            image?: string;
            points?: number;
            theoryAnswer?: string;
            yearValue?: number;
          }) => ({
            content: q.text,
            // Only map options if they exist
            options: q.options ? q.options.map(opt => opt.text) : [],
            correctAnswer: q.correctAnswer || null,
            solution: q.solution || "",
            topic: q.topic || "",
            image: q.image || "",
            points: q.points || 1,
            testId: testId,
            theoryAnswer: q.theoryAnswer || null,
            yearValue: q.yearValue || year, // Use the question's yearValue or default to test year
          })
        ),
      });
    }

    return NextResponse.json({ test: updated });
  } catch (error) {
    console.error("❌ Failed to update test:", error);
    return NextResponse.json(
      { error: "Failed to update test: " + (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}