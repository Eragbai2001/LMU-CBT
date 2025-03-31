"use client";
import { TextGenerateEffect } from "@/app/review-text/ui/text-generate-effect";

const words = `Loved by students like you`;

export default function TextGenerateEffectDemo() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <TextGenerateEffect
        words={words}
        className="text-center text-4xl text-black font-['Barlow_Semi_Condensed']"
      />
    </div>
  );
}
