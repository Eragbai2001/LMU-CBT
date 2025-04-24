"use server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // Check if the practice test exists
    const existingTest = await prisma.practiceTest.findUnique({
      where: { id },
    });

    if (!existingTest) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Delete related records
    await prisma.practiceSession.deleteMany({
      where: { testId: id },
    });
    await prisma.question.deleteMany({
      where: { testId: id },
    });
    await prisma.duration.deleteMany({
      where: { tests: { some: { id } } },
    });
    await prisma.year.deleteMany({
      where: { tests: { some: { id } } },
    });

    // Delete the practice test
    await prisma.practiceTest.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Test deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting test:", err);
    return NextResponse.json(
      { error: "Failed to delete test" },
      { status: 500 }
    );
  }
}
