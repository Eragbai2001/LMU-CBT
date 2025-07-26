import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Add departments
  await prisma.department.createMany({
    data: [
      { name: 'Computer Science', code: 'CSC' },
      { name: 'Electrical Engineering', code: 'EEE' },
      { name: 'Mechanical Engineering', code: 'MEE' },
      // Add more as needed
    ],
    skipDuplicates: true,
  });

  // Add levels
  await prisma.level.createMany({
    data: [
      { name: '100 Level', value: 100 },
      { name: '200 Level', value: 200 },
      { name: '300 Level', value: 300 },
      { name: '400 Level', value: 400 },
      // Add more as needed
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })