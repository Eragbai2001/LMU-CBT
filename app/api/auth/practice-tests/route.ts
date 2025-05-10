// /api/auth/practice-tests/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tests = await prisma.practiceTest.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        icon: true,
        isPopular: true,
        questionCount: true,
        testType: true, // Make sure this field is included
        durationOptions: {
          select: {
            id: true,
            minutes: true,
          },
        },
        yearOptions: {
          select: {
            id: true,
            value: true,
          },
        },
      },
    });

    // Map the results to include duration
    const testsWithDuration = tests.map((test) => ({
      ...test,
      duration: test.durationOptions[0]?.minutes || 0,
    }));

    console.log(
      "Sending tests with types:",
      testsWithDuration.map((t) => ({
        id: t.id,
        title: t.title,
        testType: t.testType,
      }))
    );

    return NextResponse.json(testsWithDuration);
  } catch (error) {
    console.error("Error fetching practice tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch practice tests" },
      { status: 500 }
    );
  }
}
