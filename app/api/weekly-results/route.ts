// Replace entire file: app/api/weekly-results/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Just get all test results from last 30 days (to ensure we have data)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const testResults = await prisma.testResult.findMany({
      where: {
        completedAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        score: true,
        timeTaken: true,
        completedAt: true,
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    console.log("Found test results:", testResults.length);

    // Initialize days
    const weekData = [
      { day: "Sun", score: 0, time_spent: 0, testCount: 0 },
      { day: "Mon", score: 0, time_spent: 0, testCount: 0 },
      { day: "Tue", score: 0, time_spent: 0, testCount: 0 },
      { day: "Wed", score: 0, time_spent: 0, testCount: 0 },
      { day: "Thu", score: 0, time_spent: 0, testCount: 0 },
      { day: "Fri", score: 0, time_spent: 0, testCount: 0 },
      { day: "Sat", score: 0, time_spent: 0, testCount: 0 },
    ];

    // Process each test result
    // In your weekly-results/route.ts, add this logging:
    testResults.forEach((result) => {
      console.log("Processing result:", {
        score: result.score,
        timeTaken: result.timeTaken,
        completedAt: result.completedAt,
      });

      const date = new Date(result.completedAt);
      const dayIndex = date.getDay();

      console.log(
        "Day index:",
        dayIndex,
        "Day name:",
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex]
      );

      // Convert timeTaken from "MM:SS" to minutes
      let timeInMinutes = 0;
      if (result.timeTaken) {
        console.log(
          "TimeTaken value:",
          result.timeTaken,
          "Type:",
          typeof result.timeTaken
        );
        const [minutes, seconds] = result.timeTaken.split(":").map(Number);
        timeInMinutes = minutes + seconds / 60;
        console.log("Converted to minutes:", timeInMinutes);
      } else {
        console.log("No timeTaken value found");
      }

      console.log(
        "Adding to day:",
        dayIndex,
        "Score:",
        result.score,
        "Time:",
        timeInMinutes
      );

      // Add to the correct day
      weekData[dayIndex].score += result.score;
      weekData[dayIndex].time_spent += timeInMinutes;
      weekData[dayIndex].testCount += 1;

      console.log("Day data after adding:", weekData[dayIndex]);
    });

    return NextResponse.json(weekData);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
