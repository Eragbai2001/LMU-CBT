"use client";

import { cn } from "@/lib/utils";

interface OptionInputProps {
  id: string;
  text: string;
  isCorrect: boolean;
  onTextChange: (id: string, text: string) => void;
  onCorrectChange: (id: string) => void;
}

export default function OptionInput({
  id,
  text,
  isCorrect,
  onTextChange,
  onCorrectChange,
}: OptionInputProps) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => onCorrectChange(id)}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0",
          isCorrect
            ? "bg-green-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        {id}
      </button>
      <input
        type="text"
        value={text}
        onChange={(e) => onTextChange(id, e.target.value)}
        placeholder={`Option ${id}`}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
    </div>
  );
}
