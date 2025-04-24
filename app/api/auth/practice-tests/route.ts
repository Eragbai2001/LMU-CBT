// /api/auth/practice-tests/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tests = await prisma.practiceTest.findMany({
      include: {
        durationOptions: true,
        yearOptions: true,
        questions: {
          select: {
            topic: true,
            testId: true,
          },
        },
      },
    });

    const formattedTests = tests.map((test) => {
      const topicsByYear: Record<string, Set<string>> = {};

      test.yearOptions.forEach((year) => {
        const topics = test.questions
          .filter((q) => !!q.topic)
          .map((q) => q.topic as string);

        topicsByYear[year.id] = new Set(topics);
      });

      return {
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
        topicsByYear: Object.entries(topicsByYear).map(([yearId, topicSet]) => ({
          yearId,
          topics: Array.from(topicSet),
        })),
      };
    });

    return NextResponse.json(formattedTests);
  } catch (error) {
    console.error("Error fetching practice tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch practice tests" },
      { status: 500 }
    );
  }
}


