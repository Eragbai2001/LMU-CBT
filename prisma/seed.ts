import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.practiceTest.createMany({
    data: [
      {
        title: "Mathematics",
        description: "Test your knowledge on algebra, calculus, and geometry",
        icon: "sigma", // or use an emoji/icon name if you're mapping it in frontend
        questionCount: 30,
        duration: 60,
        isPopular: true,
      },
      {
        title: "Science",
        description: "Practice physics, chemistry, and biology questions",
        icon: "flask-conical",
        questionCount: 25,
        duration: 45,
      },
      {
        title: "English",
        description: "Strengthen your grammar, vocabulary, and comprehension",
        icon: "book-open",
        questionCount: 40,
        duration: 60,
      },
      {
        title: "General Knowledge",
        description: "Test your knowledge on a variety of topics",
        icon: "brain",
        questionCount: 50,
        duration: 45,
      },
    ],
  });
}

main().catch(console.error);
