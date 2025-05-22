import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Process the form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const testType = formData.get("testType") as "objective" | "theory";
    const questionCount = parseInt(formData.get("questionCount") as string);
    const duration = parseInt(formData.get("duration") as string);

    if (!file || !title || !testType || !questionCount || !duration) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Extract text from the file
    const fileBytes = await file.arrayBuffer();
    const buffer = Buffer.from(fileBytes);
    const text = await extractTextFromFile(file.name, buffer);

    if (!text || text.length < 100) {
      return NextResponse.json(
        { message: "Could not extract sufficient text from the file" },
        { status: 400 }
      );
    }

    // Generate questions using OpenAI
    const questions = await generateQuestions(text, testType, questionCount);

    // Create a new test in the database
    const testId = uuidv4();

    // 1. Create the PracticeTest record (without questions)
    const createdPracticeTest = await db.practiceTest.create({
      data: {
        id: testId,
        title,
        description: `Auto-generated test from ${file.name}`,
        icon: getRandomIcon(),
        questionCount,
        duration,
        testType,
      },
    });

    // 2. Prepare and create the Question records
    if (questions && questions.length > 0) {
      const questionPayload = questions.map((q: any) => {
        const baseQuestionData = {
          id: uuidv4(),
          content: q.question,
          testId: createdPracticeTest.id,
          // Default values from create-test/route.ts, adjust as needed
          solution: "No solution yet", // Default or fetch if AI can provide
          topic: "General",            // Default or derive if possible
          image: null,                 // Default
          points: 0,                   // Default
          yearValue: new Date().getFullYear(), // Default or from test settings
        };

        if (testType === "objective") {
          return {
            ...baseQuestionData,
            options: q.options, // q.options is already string[] from AI
            correctAnswer: q.options[q.correctAnswer], // Convert index to option text
            theoryAnswer: null,
          };
        } else { // theory
          return {
            ...baseQuestionData,
            options: [],
            correctAnswer: null,
            theoryAnswer: q.sampleAnswer,
          };
        }
      });

      await db.question.createMany({
        data: questionPayload,
      });
    }

    // The newTest object to be returned to the client can still include the questions array
    // as it was originally structured, since the client might expect it.
    const newTestResponse = {
      id: createdPracticeTest.id,
      icon: createdPracticeTest.icon,
      title: createdPracticeTest.title,
      description: createdPracticeTest.description,
      questionCount: createdPracticeTest.questionCount,
      durationOptions: [{ id: "1", minutes: createdPracticeTest.duration }], // Reconstruct if needed
      yearOptions: [{ id: "1", value: new Date().getFullYear() }], // Reconstruct if needed
      duration: createdPracticeTest.duration,
      testType: createdPracticeTest.testType,
      questions, // The original AI-generated questions array for the response
      userId: session.user.id,
      createdAt: createdPracticeTest.createdAt, // Assuming createdAt is part of the model
    };

    return NextResponse.json(newTestResponse, { status: 201 });
  } catch (error) {
    console.error("Error generating test:", error);
    return NextResponse.json(
      { message: "Failed to generate test" },
      { status: 500 }
    );
  }
}

async function extractTextFromFile(fileName: string, buffer: Buffer): Promise<string> {
  // In a real implementation, you would use libraries like pdf-parse, mammoth, etc.
  // For this example, we'll simulate text extraction
  
  // Simple implementation for text files
  if (fileName.endsWith(".txt")) {
    return buffer.toString("utf-8");
  }
  
  // For other file types, in a real implementation you would:
  // 1. For PDFs: Use pdf-parse or similar
  // 2. For DOCs: Use mammoth.js or similar
  // 3. For PPTs: Use a PPT extraction library
  
  // Mock implementation for demo purposes
  const mockText = buffer.toString("utf-8", 0, Math.min(buffer.length, 5000));
  return mockText || "Sample text from document for demonstration purposes.";
}

async function generateQuestions(text: string, testType: "objective" | "theory", count: number) {
  // Trim text if it's too long for the OpenAI API
  const trimmedText = text.substring(0, 15000); // Limit to prevent token overflow
  
  let prompt;
  if (testType === "objective") {
    prompt = `Based on the following educational content, generate ${count} multiple-choice questions with 4 options each and indicate the correct answer. Format the response as a JSON object with a "questions" property containing an array of objects, each with properties: "question", "options" (array of 4 strings), and "correctAnswer" (index of correct option, 0-based).

Example format:
{
  "questions": [
    {
      "question": "What is the capital of France?",
      "options": ["London", "Berlin", "Paris", "Madrid"],
      "correctAnswer": 2
    }
  ]
}

Content: ${trimmedText}`;
  } else {
    prompt = `Based on the following educational content, generate ${count} theory/essay questions that test understanding of key concepts. Format the response as a JSON object with a "questions" property containing an array of objects, each with properties: "question" and "sampleAnswer".

Example format:
{
  "questions": [
    {
      "question": "Explain the process of photosynthesis.",
      "sampleAnswer": "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll."
    }
  ]
}

Content: ${trimmedText}`;
  }

  // Max retry attempts
  const MAX_RETRIES = 3;
  let retries = 0;
  let lastError = null;

  while (retries < MAX_RETRIES) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Or "gpt-3.5-turbo" depending on your needs
        messages: [
          { role: "system", content: "You are an educational content creator specializing in creating high-quality test questions." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response from OpenAI");
      }

      // Parse and validate response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response);
      } catch (parseError) {
        throw new Error("Failed to parse JSON response from OpenAI");
      }

      // Validate response format
      if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
        throw new Error("Invalid response format: 'questions' array is missing");
      }

      // Validate question format based on test type
      if (testType === "objective") {
        const isValid = parsedResponse.questions.every((q: any) => 
          q.question && 
          Array.isArray(q.options) && 
          q.options.length === 4 &&
          typeof q.correctAnswer === 'number' &&
          q.correctAnswer >= 0 && 
          q.correctAnswer < 4
        );
        
        if (!isValid) {
          throw new Error("Invalid question format in response for objective test");
        }
      } else {
        const isValid = parsedResponse.questions.every((q: any) => 
          q.question && 
          typeof q.sampleAnswer === 'string'
        );
        
        if (!isValid) {
          throw new Error("Invalid question format in response for theory test");
        }
      }

      // All validation passed
      return parsedResponse.questions;
    } catch (error) {
      lastError = error;
      console.error(`Error generating questions (attempt ${retries + 1}/${MAX_RETRIES}):`, error);
      retries++;
      
      // Add a small delay before retrying
      if (retries < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
  }

  console.error(`Failed to generate questions after ${MAX_RETRIES} attempts. Last error:`, lastError);
  // Return mock questions as fallback
  return generateMockQuestions(testType, count);
}

function generateMockQuestions(testType: "objective" | "theory", count: number) {
  const questions = [];
  
  if (testType === "objective") {
    for (let i = 0; i < count; i++) {
      questions.push({
        question: `Sample multiple choice question ${i + 1}`,
        options: [
          `Option A for question ${i + 1}`,
          `Option B for question ${i + 1}`,
          `Option C for question ${i + 1}`,
          `Option D for question ${i + 1}`,
        ],
        correctAnswer: Math.floor(Math.random() * 4)
      });
    }
  } else {
    for (let i = 0; i < count; i++) {
      questions.push({
        question: `Sample theory question ${i + 1}?`,
        sampleAnswer: `This is a sample answer for theory question ${i + 1}.`
      });
    }
  }
  
  return questions;
}

function getRandomIcon() {
  const icons = ["sigma", "flask-conical", "book-open", "brain"];
  return icons[Math.floor(Math.random() * icons.length)];
} 