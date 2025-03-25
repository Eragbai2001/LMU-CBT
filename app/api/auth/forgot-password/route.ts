import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import crypto from "crypto";

const prisma = new PrismaClient();

// Function to send email
async function sendResetEmail(email: string, resetToken: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"YourApp Support" <${process.env.EMAIL_USER}>`, // Use a real support email if possible
    to: email,
    subject: "Reset Your Account Password",
    text: `Hello,\n\nYou requested a password reset. Click the link below:\n${resetUrl}\n\nIf you didn't request this, please ignore this email.`,
    html: `
      <p>Hello,</p>
      <p>You requested a password reset. Click the link below:</p>
      <a href="${resetUrl}" style="color:blue;">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best Regards,<br>YourApp Support Team</p>
    `,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text(); // Read the raw request body
    if (!body) {
      return NextResponse.json(
        { message: "Request body is empty" },
        { status: 400 }
      );
    }

    const { email } = JSON.parse(body); // Parse the JSON manually

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: "This email does not exist" },
        { status: 404 }
      );
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1-hour expiry

    // Save token to the database
    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    // Send the reset email
    await sendResetEmail(email, resetToken);

    return NextResponse.json(
      { message: "An email has been sent to you" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request", error: (error as Error).message },
      { status: 400 }
    );
  }
}
