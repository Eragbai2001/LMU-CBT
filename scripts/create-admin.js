import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error("Please provide an email and password");
    process.exit(1);
  }

  try {
    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        role: "ADMIN",
        password: hashedPassword,
      },
      create: {
        email,
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log(`Admin user created/updated: ${user.email}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
