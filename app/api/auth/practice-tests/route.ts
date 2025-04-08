import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET() {
  const tests = await prisma.practiceTest.findMany();
  return NextResponse.json(tests);
}
