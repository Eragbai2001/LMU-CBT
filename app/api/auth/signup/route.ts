import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db"; // Use the singleton db client instead

// Define Zod schema for validation
const signupSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters long"),
  email: z
    .string()
    .email("Invalid email format")
    .refine(
      (email) => email.endsWith("@lmu.edu.ng") || email.endsWith("@gmail.com"),
      {
        message: "Only @lmu.edu.ng or @gmail.com emails are allowed",
      }
    ),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Check if email already exists
    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists. Please use a different email." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
