import Image from "next/image";
import { Book } from "lucide-react";

interface TheoryQuestionProps {
  question?: {
    id?: string;
    content?: string;
    image?: string | null;
    points?: number;
    topic?: string;
  };
}

export default function TheoryQuestion({ question }: TheoryQuestionProps) {
  // Add safe checks for when question might be undefined
  if (!question) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500">Question not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-0">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <Book size={20} className="text-blue-700" />
          </div>
          <h2 className="text-lg font-medium text-gray-800">Question</h2>
        </div>

        <div className="flex items-center">
          <span className="text-sm mr-2 text-gray-500">
            Points:{" "}
            <span className="font-medium text-gray-700">
              {question?.points || 0}
            </span>
          </span>

          {question?.topic && (
            <span className="text-xs bg-blue-50 px-2 py-1 rounded-full text-blue-700">
              {question.topic}
            </span>
          )}
        </div>
      </div>

      <div
        className="prose prose-blue max-w-none"
        dangerouslySetInnerHTML={{
          __html: question?.content || "No content available",
        }}
      />

      {question?.image && (
        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
          <Image
            src={question.image}
            alt="Question image"
            width={800}
            height={400}
            className="w-full h-auto object-contain"
          />
        </div>
      )}
    </div>
  );
}
