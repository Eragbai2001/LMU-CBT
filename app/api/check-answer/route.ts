import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {  userAnswer, referenceAnswer, questionContent } = body;

    if (!questionContent || !userAnswer) {
      return NextResponse.json(
        { error: "Missing question content or user answer" },
        { status: 400 }
      );
    }

    // Format system message
    const systemContent = `You are an expert educational assessor evaluating student answers to theory questions. 
Provide a fair and detailed assessment based on accuracy, understanding of concepts, and clarity.
Your assessment must be in JSON format as specified in the user prompt.`;

    // Format user message with the question details and evaluation requirements
    const userMessage = `
Evaluate this student's answer to the following theory question:

QUESTION: ${questionContent}

STUDENT ANSWER: ${userAnswer}

${referenceAnswer ? `REFERENCE SOLUTION: ${referenceAnswer}` : ""}

Provide your evaluation in the following JSON format exactly (no markdown, no text before or after):
{
  "score": (number between 1-10),
  "feedback": "brief overall assessment of the answer",
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["specific improvement area 1", "specific improvement area 2"]
}
`;

    try {
      // Create response using the API format from your existing implementation
      const response = await openai.responses.create({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: systemContent,
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: userMessage,
              },
            ],
          },
        ],
        text: {
          format: {
            type: "text",
          },
        },
        reasoning: {},
        tools: [],
        temperature: 0.7,
        max_output_tokens: 800,
        top_p: 1,
        store: true,
      });

      // Debug the full response structure
      console.log("Check answer response:", JSON.stringify(response, null, 2));

      // Extract text using the correct field path
      let responseText = "";

      // PRIMARY METHOD: Use output_text
      if (response.output_text) {
        responseText = response.output_text;
        console.log("Using output_text field:", responseText);
      }
    // FALLBACK 1: Try the output array path
    else if (
      response.output &&
      Array.isArray(response.output) &&
      response.output[0]
    ) {
      // Define the expected structure type
      interface OutputContent {
        content?: Array<{text?: string}>;
      }
      
      const outputContent = response.output[0] as OutputContent;
      if (outputContent.content && outputContent.content[0] && outputContent.content[0].text) {
        responseText = outputContent.content[0].text;
        console.log("Using output array content:", responseText);
      }
    }
    // FALLBACK 2: Try the text object if it exists
    else if (response.text) {
      if (typeof response.text === "string") {
        responseText = response.text;
      } else if (
        typeof response.text === "object" && 
        response.text !== null
      ) {
        interface TextObject {
          value?: string;
        }
        const textObj = response.text as TextObject;
        if (textObj.value !== undefined) {
          responseText = textObj.value;
        }
      }
      console.log("Using text field:", responseText);
    }
      // FALLBACK 3: Last resort - stringify the response
      else {
        responseText = JSON.stringify({
          score: 5,
          feedback: "Couldn't properly analyze this answer. Please try again.",
          strengths: ["Unable to determine"],
          improvements: ["Unable to determine"],
        });
        console.error("Unable to extract text from response:", response);
      }

      // Parse the response text as JSON
      try {
        const evaluation = JSON.parse(responseText);
        return NextResponse.json(evaluation);
      } catch (jsonError) {
        console.error("Failed to parse response JSON:", jsonError);
        return NextResponse.json({
          score: 5,
          feedback:
            "Error processing your answer evaluation. Please try again.",
          strengths: ["Error in processing"],
          improvements: ["Error in processing"],
        });
      }
    } catch (apiError) {
      console.error("OpenAI API error:", apiError);
      return NextResponse.json(
        { error: "AI service error. Please try again later." },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Answer evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate answer" },
      { status: 500 }
    );
  }
}
