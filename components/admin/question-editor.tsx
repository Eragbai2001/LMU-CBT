"use client";

import type React from "react";

import { AlertCircle, HelpCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import OptionInput from "./option-input";
import ImageUploader from "./image-uploader";

// Update the Question interface to include topic and solution
interface Question {
  id: number;
  text: string;
  points: number;
  options: { id: string; text: string }[];
  correctAnswer: string;
  image?: string;
  topic?: string;
  solution?: string;
}

// Add handlers for topic and solution changes to the props
interface QuestionEditorProps {
  question: Question;
  errors: Record<string, string>;
  onQuestionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPointsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOptionChange: (id: string, text: string) => void;
  onCorrectAnswerChange: (id: string) => void;
  onImageChange: (imageUrl?: string) => void;
  onTopicChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSolutionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAddQuestion: () => void;
}

// Update the component to include the new fields
export default function QuestionEditor({
  question,
  errors,
  onQuestionChange,
  onPointsChange,
  onOptionChange,
  onCorrectAnswerChange,
  onImageChange,
  onTopicChange,
  onSolutionChange,
  onAddQuestion,
}: QuestionEditorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">
        Add Question #{question.id}
      </h2>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="questionText"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Question Text*
          </label>
          <textarea
            id="questionText"
            value={question.text}
            onChange={onQuestionChange}
            placeholder="Enter your question here"
            rows={3}
            className={cn(
              "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors",
              errors.questionText ? "border-red-500" : "border-gray-300"
            )}
          />
          {errors.questionText && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" /> {errors.questionText}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="points"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Points
            </label>
            <input
              type="number"
              id="points"
              value={question.points || ""} // Allow empty string as a fallback
              onChange={onPointsChange}
              min={1}
              max={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Topic (Optional)
            </label>
            <input
              type="text"
              id="topic"
              value={question.topic || ""}
              onChange={onTopicChange}
              placeholder="e.g., Algebra, Grammar, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Image Upload Section - Fixed props */}
          <div className="md:col-span-2">
            <ImageUploader
              image={question.image}
              onImageChange={onImageChange}
              error={errors.image}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Answer Options*
            </label>
            <div className="flex items-center text-sm text-gray-500">
              <HelpCircle className="h-3 w-3 mr-1" />
              <span>Click on the circle to set the correct answer</span>
            </div>
          </div>

          {errors.options && (
            <p className="mb-2 text-sm text-red-500 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" /> {errors.options}
            </p>
          )}

          <div className="space-y-3">
            {question.options.map((option) => (
              <OptionInput
                key={option.id}
                id={option.id}
                text={option.text}
                isCorrect={question.correctAnswer === option.id}
                onTextChange={onOptionChange}
                onCorrectChange={onCorrectAnswerChange}
              />
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="solution"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Solution / Explanation (Optional)
          </label>
          <textarea
            id="solution"
            value={question.solution || ""}
            onChange={onSolutionChange}
            placeholder="Explain why the correct answer is right (will be shown after the test)"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onAddQuestion}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Question
        </button>
      </div>
    </div>
  );
}
