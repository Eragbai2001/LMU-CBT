import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("Please provide an email");
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        role: "USER", // Change the role to USER
      },
    });

    console.log(`Admin role removed for user: ${user.email}`);
  } catch (error) {
    console.error("Error removing admin role:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();