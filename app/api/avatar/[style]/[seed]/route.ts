import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { style: string; seed: string } }
) {
  const { style, seed } = params;

  try {
    // Validate style to prevent injection
    const validStyles = [
      "adventurer",
      "adventurer-neutral",
      "avataaars",
      "big-ears",
      "big-smile",
      "bottts",
      "croodles",
      "fun-emoji",
      "pixel-art",
    ];

    if (!validStyles.includes(style)) {
      return NextResponse.json({ error: "Invalid style" }, { status: 400 });
    }

    // Fetch the avatar from DiceBear
    const response = await fetch(
      `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch avatar" },
        { status: 500 }
      );
    }

    // Get the SVG content
    const svgContent = await response.text();

    // Return the SVG with proper content type
    return new NextResponse(svgContent, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error("Avatar proxy error:", error);
    return NextResponse.json(
      { error: "Failed to generate avatar" },
      { status: 500 }
    );
  }
}
