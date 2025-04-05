"use client";
import { TextGenerateEffect } from "@/app/review-text/ui/text-generate-effect";

const words = `Loved by students like you`;

export default function TextGenerateEffectDemo() {
  return (
    <div className="flex justify-center items-center min-h-[100px] xl:mt-[14%] ">
      <TextGenerateEffect
        words={words}
        className="text-center text-4xl md:text-6xl lg:text-8xl  font-['Barlow_Semi_Condensed'] tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-pink-600 to-orange-600 border-b-2 border-black pb-2"
      />
    </div>
  );
}
