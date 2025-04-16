import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  try {
    // Clean up existing records - use correct order to avoid foreign key constraints
    await prisma.practiceSession.deleteMany();
    await prisma.question.deleteMany(); // Ensure questions are deleted first
    await prisma.practiceTest.deleteMany();
    await prisma.duration.deleteMany();
    await prisma.year.deleteMany();

    console.log("Deleted existing records");

    // Create durations
    await prisma.duration.createMany({
      data: [15, 30, 45, 60].map((mins) => ({ minutes: mins })),
    });

    console.log("Created durations");

    // Create years
    await prisma.year.createMany({
      data: [2019, 2020, 2021, 2022, 2023].map((value) => ({ value })),
    });

    console.log("Created years");

    // Fetch durations and years for linking
    const allDurations = await prisma.duration.findMany();
    const allYears = await prisma.year.findMany();

    // Helper functions to get specific durations/years
    const getDurations = (mins: number[]) =>
      allDurations.filter((d) => mins.includes(d.minutes));
    const getYears = (vals: number[]) =>
      allYears.filter((y) => vals.includes(y.value));

    // Create a helper function to generate questions
    const createFakeQuestions = async (testId: string, count: number) => {
      const questions = Array.from({ length: count }).map((_, i) => ({
        content: `Question ${i + 1} content for test ${testId}`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        testId,
      }));
      await prisma.question.createMany({ data: questions });
    };

    // Create practice tests with linked durations, years, and questions
    const mathTest = await prisma.practiceTest.create({
      data: {
        title: "Mathematics",
        description: "Test your knowledge on algebra, calculus, and geometry",
        icon: "sigma",
        isPopular: true,
        questionCount: 30,
        durationOptions: {
          connect: getDurations([15, 30, 45]).map((d) => ({ id: d.id })),
        },
        yearOptions: {
          connect: getYears([2021, 2022, 2023]).map((y) => ({ id: y.id })),
        },
      },
    });
    await createFakeQuestions(mathTest.id, 30);

    const scienceTest = await prisma.practiceTest.create({
      data: {
        title: "Science",
        description: "Practice physics, chemistry, and biology questions",
        icon: "flask-conical",
        questionCount: 25,
        durationOptions: {
          connect: getDurations([30, 60]).map((d) => ({ id: d.id })),
        },
        yearOptions: {
          connect: getYears([2019, 2020, 2023]).map((y) => ({ id: y.id })),
        },
      },
    });
    await createFakeQuestions(scienceTest.id, 25);

    const englishTest = await prisma.practiceTest.create({
      data: {
        title: "English",
        description: "Strengthen your grammar, vocabulary, and comprehension",
        icon: "book-open",
        questionCount: 40,
        durationOptions: {
          connect: getDurations([15, 60]).map((d) => ({ id: d.id })),
        },
        yearOptions: {
          connect: getYears([2020, 2021, 2023]).map((y) => ({ id: y.id })),
        },
      },
    });
    await createFakeQuestions(englishTest.id, 40);

    const generalKnowledgeTest = await prisma.practiceTest.create({
      data: {
        title: "General Knowledge",
        description: "Test your knowledge on a variety of topics",
        icon: "brain",
        questionCount: 50,
        durationOptions: {
          connect: getDurations([30, 45, 60]).map((d) => ({ id: d.id })),
        },
        yearOptions: {
          connect: getYears([2019, 2022, 2023]).map((y) => ({ id: y.id })),
        },
      },
    });
    await createFakeQuestions(generalKnowledgeTest.id, 50);

    console.log("Created practice tests with their relations and questions");
  } catch (error) {
    console.error("Error in seed script:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});