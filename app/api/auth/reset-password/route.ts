import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  // Find user by reset token
  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetTokenExpiry: { gte: new Date() } },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid or expired reset token." },
      { status: 400 }
    );
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update user's password and clear reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return NextResponse.json({ message: "Password reset successful." });
}
