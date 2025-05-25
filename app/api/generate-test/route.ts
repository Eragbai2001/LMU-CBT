import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import OpenAI from "openai";


import mammoth from 'mammoth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
     console.log('Extracted text length:', text.length);
    console.log('First 200 characters:', text.substring(0, 200));

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
        // Add these relationships
        durationOptions: {
          connectOrCreate: {
            where: {
              id: String(duration),
            },
            create: {
              id: String(duration),
              minutes: duration,
            },
          },
        },
        yearOptions: {
          connectOrCreate: {
            where: {
              id: String(new Date().getFullYear()),
            },
            create: {
              id: String(new Date().getFullYear()),
              value: new Date().getFullYear(),
            },
          },
        },
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
          topic: "General", // Default or derive if possible
          image: null, // Default
          points: 0, // Default
          yearValue: new Date().getFullYear(), // Default or from test settings
        };

        if (testType === "objective") {
          return {
            ...baseQuestionData,
            options: q.options, // q.options is already string[] from AI
            correctAnswer: q.options[q.correctAnswer], // Convert index to option text
            theoryAnswer: null,
          };
        } else {
          // theory
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
      durationOptions: await db.duration.findMany({
        where: { tests: { some: { id: createdPracticeTest.id } } },
        select: { id: true, minutes: true },
      }),
      yearOptions: await db.year.findMany({
        where: { tests: { some: { id: createdPracticeTest.id } } },
        select: { id: true, value: true },
      }),
     
      questions, // The original AI-generated questions array for the response
      userId: session.user.id,
      createdAt: createdPracticeTest.createdAt, // Assuming createdAt is part of the model
    };

    return NextResponse.json(newTestResponse, { status: 201 });
  } catch (error: unknown) {
    console.error("Detailed error generating test:", error);
    
    if (error instanceof Error && (error.message.includes('DOMMatrix') || error.message.includes('pdfjs'))) {
      return NextResponse.json(
        { message: "Failed to parse PDF file. Please try a different file or format." },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('pdf-parse')) {
      return NextResponse.json(
        { message: "Failed to parse PDF file. Please try a different file format." },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes('OpenAI')) {
      return NextResponse.json(
        { message: "Failed to generate questions. Please try again." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: "Failed to generate test", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function extractTextFromFile(
  fileName: string,
  buffer: Buffer
): Promise<string> {
  try {
    console.log(`Extracting text from file: ${fileName}, size: ${buffer.length} bytes`);
    const fileExtension = fileName.toLowerCase().split('.').pop();
    
    switch (fileExtension) {
      case 'pdf':
        try {
          // Use dynamic import with better error handling
          const pdfParse = await import('pdf-parse');
          const pdf = pdfParse.default || pdfParse;
          
          const pdfData = await pdf(buffer, {
            // Add options to handle problematic PDFs
            max: 0, // Parse all pages
            version: 'v1.10.100' // Use legacy version
          });
          
          console.log(`PDF text extracted, length: ${pdfData.text.length}`);
          
          // Clean up the extracted text
          const cleanText = pdfData.text
            .replace(/\s+/g, ' ') // Normalize whitespace
            .replace(/[^\w\s.,!?;:()\-'"]/g, '') // Remove special characters
            .trim();
            
          return cleanText;
        } catch (pdfError) {
          console.error('PDF parsing error:', pdfError);
          throw new Error('Failed to parse PDF content. The file may be corrupted or password-protected.');
        }
        
      case 'doc':
      case 'docx':
        const docResult = await mammoth.extractRawText({ buffer });
        console.log(`Word document text extracted, length: ${docResult.value.length}`);
        return docResult.value.trim();
        
      case 'txt':
        const txtContent = buffer.toString('utf-8').trim();
        console.log(`Text file content extracted, length: ${txtContent.length}`);
        return txtContent;
        
      case 'ppt':
      case 'pptx':
        try {
          // Better PowerPoint extraction
          const pptText = buffer.toString('utf-8');
          
          // Extract text between common PowerPoint XML tags
          const textMatches = pptText.match(/<a:t[^>]*>([^<]+)<\/a:t>/g);
          let extractedText = '';
          
          if (textMatches) {
            extractedText = textMatches
              .map(match => match.replace(/<[^>]*>/g, ''))
              .join(' ');
          }
          
          // Fallback: general cleaning if no specific matches found
          if (!extractedText || extractedText.length < 50) {
            extractedText = pptText
              .replace(/<[^>]*>/g, ' ') // Remove XML tags
              .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // Remove non-printable characters
              .replace(/\s+/g, ' ') // Normalize whitespace
              .replace(/\b\w{1,2}\b/g, '') // Remove very short words (likely artifacts)
              .trim();
          }
          
          console.log(`PowerPoint text extracted, length: ${extractedText.length}`);
          console.log(`First 300 chars: ${extractedText.substring(0, 300)}`);
          
          return extractedText;
        } catch (pptError) {
          console.error('PowerPoint parsing error:', pptError);
          throw new Error('Failed to extract text from PowerPoint file.');
        }
        
      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }
    
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error(`Failed to extract text from ${fileName}. Please ensure the file is not corrupted.`);
  }
}

async function generateQuestions(
  text: string,
  testType: "objective" | "theory",
  count: number
) {
  // Trim text if it's too long for the OpenAI API
  const trimmedText = text.substring(0, 15000); // Limit to prevent token overflow

  let prompt;
  if (testType === "objective") {
    prompt = `You are an expert educator. Based on the educational content below, create ${count} high-quality multiple-choice questions that test understanding of the key concepts and information.
  
  CRITICAL INSTRUCTIONS:
  - Focus ONLY on the educational subject matter and concepts found in the content
  - DO NOT create generic questions about presentations, documents, or file formats
  - Questions must be based on SPECIFIC information, facts, concepts, or topics mentioned in the provided content
  - If the content is about a specific subject (like biology, history, etc.), create questions about that subject
  - All options should be plausible but only one clearly correct
  - Ensure questions test comprehension and application of the actual material provided
  
  CONTENT VALIDATION:
  - Read through the entire content carefully
  - Identify the main topics, concepts, and key information
  - Create questions that directly relate to these identified elements
  
  Format as JSON:
  {
    "questions": [
      {
        "question": "Based on the content provided, [your specific question here]?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0
      }
    ]
  }
  
  Educational Content:
  ${trimmedText}
  
  Remember: Questions must be directly derived from the content above. Do not create generic or theoretical questions.`;
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
          {
            role: "system",
            content:
              "You are an educational content creator specializing in creating high-quality test questions.",
          },
          { role: "user", content: prompt },
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
      if (
        !parsedResponse.questions ||
        !Array.isArray(parsedResponse.questions)
      ) {
        throw new Error(
          "Invalid response format: 'questions' array is missing"
        );
      }

      // Validate question format based on test type
      if (testType === "objective") {
        const isValid = parsedResponse.questions.every(
          (q: any) =>
            q.question &&
            Array.isArray(q.options) &&
            q.options.length === 4 &&
            typeof q.correctAnswer === "number" &&
            q.correctAnswer >= 0 &&
            q.correctAnswer < 4
        );

        if (!isValid) {
          throw new Error(
            "Invalid question format in response for objective test"
          );
        }
      } else {
        const isValid = parsedResponse.questions.every(
          (q: any) => q.question && typeof q.sampleAnswer === "string"
        );

        if (!isValid) {
          throw new Error(
            "Invalid question format in response for theory test"
          );
        }
      }

      // All validation passed
      return parsedResponse.questions;
    } catch (error) {
      lastError = error;
      console.error(
        `Error generating questions (attempt ${retries + 1}/${MAX_RETRIES}):`,
        error
      );
      retries++;

      // Add a small delay before retrying
      if (retries < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
      }
    }
  }

  console.error(
    `Failed to generate questions after ${MAX_RETRIES} attempts. Last error:`,
    lastError
  );
  // Return mock questions as fallback
  return generateMockQuestions(testType, count);
}

function generateMockQuestions(
  testType: "objective" | "theory",
  count: number
) {
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
        correctAnswer: Math.floor(Math.random() * 4),
      });
    }
  } else {
    for (let i = 0; i < count; i++) {
      questions.push({
        question: `Sample theory question ${i + 1}?`,
        sampleAnswer: `This is a sample answer for theory question ${i + 1}.`,
      });
    }
  }

  return questions;
}

function getRandomIcon() {
  const icons = ["sigma", "flask-conical", "book-open", "brain"];
  return icons[Math.floor(Math.random() * icons.length)];
}
