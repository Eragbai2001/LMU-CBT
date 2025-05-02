import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("Please provide an email");
    process.exit(1);
  }

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        role: "ADMIN", // Update the role to ADMIN if the user exists
      },
      create: {
        email,
        name: "Admin User", // Default name for new admin users
        role: "ADMIN", // Assign ADMIN role to new users
      },
    });

    console.log(`Admin user created/updated: ${user.email}`);
  } catch (error) {
    console.error("Error creating/updating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();