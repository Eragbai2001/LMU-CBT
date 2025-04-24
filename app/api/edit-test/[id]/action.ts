'use server';
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function getTestById(id: string) {
  try {
    const test = await prisma.practiceTest.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!test) return null;

    return {
      ...test,
      // Parse questions, etc. if needed
    };
  } catch (error) {
    console.error("Error loading test:", error);
    return null;
  }
}
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Delete the practice test
    await prisma.practiceTest.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: 'Test deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('Error deleting test:', err);
    return NextResponse.json({ error: 'Failed to delete test' }, { status: 500 });
  }
}
