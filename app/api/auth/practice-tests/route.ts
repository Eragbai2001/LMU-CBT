import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tests = await prisma.practiceTest.findMany({
      include: {
        durationOptions: true,
        yearOptions: true,
      },
    });

    console.log("Fetched Tests with Relationships:", JSON.stringify(tests, null, 2));

    const formattedTests = tests.map((test) => ({
      id: test.id,
      title: test.title,
      description: test.description,
      icon: test.icon,
      questionCount: test.questionCount,
      isPopular: test.isPopular || false,
      duration:
        test.durationOptions.length > 0
          ? Math.round(
              test.durationOptions.reduce((sum, d) => sum + d.minutes, 0) /
                test.durationOptions.length
            )
          : 0,
      durationOptions: test.durationOptions.map((d) => ({
        id: d.id,
        minutes: d.minutes,
      })),
      yearOptions: test.yearOptions.map((y) => ({
        id: y.id,
        value: y.value,
      })),
    }));

    return NextResponse.json(formattedTests);
  } catch (error) {
    console.error("Error fetching practice tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch practice tests" },
      { status: 500 }
    );
  }
}
