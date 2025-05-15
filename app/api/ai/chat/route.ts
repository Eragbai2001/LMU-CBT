import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required and must be an array" },
        { status: 400 }
      );
    }

    // Format system message and user messages
    const systemContent =
      "You are an AI learning assistant helping students with their theory test answers. Provide concise, helpful responses that improve understanding. Focus on academic concepts and avoid doing the work for them. Your answers should be well-structured, factual, and educational.";

    // Get the last user message
    const lastUserMessage =
      messages.filter((msg) => msg.role === "user").pop()?.content || "";

    try {
      // Create response using the new API format
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
                text: lastUserMessage,
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
      console.log(
        "Full response structure:",
        JSON.stringify(response, null, 2)
      );

      // Extract text using the correct field path
      let responseText = "";

      // PRIMARY METHOD: Use output_text - this is the most direct way
      if (response.output_text) {
        responseText = response.output_text;
        console.log("Using output_text field:", responseText);
      }
      // FALLBACK 1: Try the output array path
      else if (
        response.output &&
        Array.isArray(response.output) &&
        response.output[0]?.content?.[0]?.text
      ) {
        responseText = response.output[0].content[0].text;
        console.log("Using output[0].content[0].text field:", responseText);
      }
      // FALLBACK 2: Try the text object if it exists
      else if (response.text) {
        if (typeof response.text === "string") {
          responseText = response.text;
        } else if (typeof response.text.value === "string") {
          responseText = response.text.value;
        }
        console.log("Using text field:", responseText);
      }
      // FALLBACK 3: Last resort - stringify the response
      else {
        responseText =
          "Couldn't extract text from the AI response. Please try again.";
        console.error("Unable to extract text from response:", response);
      }

      return NextResponse.json({ message: responseText });
    } catch (apiError) {
      console.error("OpenAI API error:", apiError);
      return NextResponse.json(
        { error: "AI service error. Please try again later." },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("AI chat error:", error);

    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}
