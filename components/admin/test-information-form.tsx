"use client";

import type React from "react";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestInformationFormProps {
  testData: {
    title: string;
    description: string;
    icon: string;
    totalQuestions: number;
    duration: number;
    year: number;
    isPopular: boolean;
    questionCount: number;
  };
  errors: Record<string, string>;
  availableIcons: { id: string; name: string }[];
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onTogglePopular: () => void;
  onNext: () => void;
}

export default function TestInformationForm({
  testData,
  errors,
  availableIcons,
  onChange,
  onTogglePopular,
  onNext,
}: TestInformationFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Test Information</h2>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Test Title*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={testData.title}
            onChange={onChange}
            placeholder="e.g., Mathematics Practice Test"
            className={cn(
              "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors",
              errors.title ? "border-red-500" : "border-gray-300"
            )}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" /> {errors.title}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            value={testData.description}
            onChange={onChange}
            placeholder="Describe what this test covers"
            rows={3}
            className={cn(
              "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors",
              errors.description ? "border-red-500" : "border-gray-300"
            )}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" /> {errors.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="icon"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject Icon
            </label>
            <select
              id="icon"
              name="icon"
              value={testData.icon}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {availableIcons.map((icon) => (
                <option key={icon.id} value={icon.id}>
                  {icon.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Year
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={testData.year}
              onChange={onChange}
              min={2000}
              max={2100}
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors",
                errors.year ? "border-red-500" : "border-gray-300"
              )}
            />

            {errors.year && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> {errors.year}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={testData.duration}
              onChange={onChange}
              min={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="totalQuestions"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Number of Questions
            </label>
            <input
              type="number"
              id="questionCount"
              name="questionCount"
              value={testData.questionCount || ""} // Allow empty string as a fallback
              onChange={onChange}
              min={1}
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors",
                errors.totalQuestions ? "border-red-500" : "border-gray-300"
              )}
            />
            {errors.totalQuestions && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> {errors.totalQuestions}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={onTogglePopular}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                testData.isPopular ? "bg-blue-600" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  testData.isPopular ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span className="ml-3 text-sm font-medium text-gray-700">
              Mark as Popular
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue to Questions
        </button>
      </div>
    </div>
  );
}
