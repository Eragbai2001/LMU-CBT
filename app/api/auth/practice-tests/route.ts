// /api/auth/practice-tests/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch practice tests with their related data
    const tests = await prisma.practiceTest.findMany({
      include: {
        durationOptions: true,
        yearOptions: true,
        questions: {
          select: {
            topic: true,
            yearValue: true,
          },
        },
      },
    });

    // Transform the data for the frontend
    const formattedTests = tests.map((test) => {
      // Group questions by year and extract topics
      const topicsByYear: { yearId: string; topics: string[] }[] = [];

      // Process all questions to extract topics by year
      test.questions.forEach((question) => {
        if (!question.topic) return;

        const yearOption = test.yearOptions.find(
          (y) => y.value === question.yearValue
        );
        if (!yearOption) return;

        let yearGroup = topicsByYear.find((y) => y.yearId === yearOption.id);
        if (!yearGroup) {
          yearGroup = {
            yearId: yearOption.id,
            topics: [],
          };
          topicsByYear.push(yearGroup);
        }

        if (!yearGroup.topics.includes(question.topic)) {
          yearGroup.topics.push(question.topic);
        }
      });

      return {
        id: test.id,
        title: test.title,
        description: test.description,
        icon: test.icon,
        isPopular: test.isPopular,
        questionCount: test.questions.length,
        durationOptions: test.durationOptions,
        yearOptions: test.yearOptions,
        duration: 60, // Default duration
        testType: test.testType || "objective", // Default to objective
        topicsByYear: topicsByYear,
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
