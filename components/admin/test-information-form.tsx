"use client";

import type React from "react";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AcademicSelect } from "../academic-select";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Form } from "../ui/form";

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
    testType: "objective" | "theory";
    departmentId?: string; // Add these fields
    levelId?: string; // Add these fields
  };
  errors: Record<string, string>;
  availableIcons: { id: string; name: string }[];
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onTestTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onTogglePopular: () => void;
  onNext: () => void;
  departments: { id: string; name: string; code?: string }[]; // Add these props
  levels: { id: string; name: string; value: number }[]; // Add these props
}

export default function TestInformationForm({
  testData,
  errors,
  availableIcons,
  onChange,
  onTestTypeChange,
  onTogglePopular,
  onNext,
  departments, // Add these props
  levels,
}: TestInformationFormProps) {
  const form = useForm({
    defaultValues: {
      departmentId: testData.departmentId || "_none_",
      levelId: testData.levelId || "_none_",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === "departmentId" || name === "levelId") {
        const syntheticEvent = {
          target: { name, value: value[name as keyof typeof value] },
        } as React.ChangeEvent<HTMLSelectElement>;

        onChange(syntheticEvent);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, onChange]);
  return (
    <Form z {...form}>
      <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800/80 dark:border-[#333333]">
        <h2 className="text-xl font-semibold mb-6">Test Information</h2>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
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
                "w-full px-4 py-2 border  rounded-lg focus:ring-2   outline-none transition-colors dark:bg-gray-950 dark:text-gray-200  ",
                errors.title
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-700"
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
              className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
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
                "w-full px-4 py-2 border rounded-lg focus:ring-2  outline-none transition-colors dark:bg-gray-950 dark:text-gray-200",
                errors.title
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              )}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> {errors.description}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="testType"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Test Type*
            </label>
            <Select
              defaultValue={testData.testType}
              onValueChange={(value) => {
                // Create a synthetic event object to work with your existing handler
                const syntheticEvent = {
                  target: { name: "testType", value },
                } as React.ChangeEvent<HTMLSelectElement>;

                onTestTypeChange(syntheticEvent);
              }}>
              <SelectTrigger className="w-full bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700">
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="objective">
                  Objective (Multiple Choice)
                </SelectItem>
                <SelectItem value="theory">Theory Questions</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {testData.testType === "objective"
                ? "Objective tests have multiple-choice questions with specific correct answers."
                : "Theory tests have open-ended questions that require written responses."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="icon"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Subject Icon
              </label>
              <Select
                defaultValue={testData.icon}
                onValueChange={(value) => {
                  const syntheticEvent = {
                    target: { name: "icon", value },
                  } as React.ChangeEvent<HTMLSelectElement>;

                  onChange(syntheticEvent);
                }}>
                <SelectTrigger className="w-full bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {availableIcons.map((icon) => (
                    <SelectItem key={icon.id} value={icon.id}>
                      {icon.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
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
                  "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors dark:bg-gray-950 dark:text-gray-200",
                  errors.year
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                )}
              />
              {errors.year && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> {errors.year}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={testData.duration}
                onChange={onChange}
                min={1}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-950 dark:text-gray-200"
              />
            </div>

            <div>
              <label
                htmlFor="questionCount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
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
                  "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors dark:bg-gray-950 dark:text-gray-200",
                  errors.questionCount
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                )}
              />
              {errors.questionCount && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />{" "}
                  {errors.totalQuestions}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AcademicSelect
              name="departmentId"
              control={form.control}
              label="Department"
              placeholder="Select department for this test"
              items={departments}
              description="Which department is this test for?"
            />

            <AcademicSelect
              name="levelId"
              control={form.control}
              label="Level"
              placeholder="Select level for this test"
              items={levels}
              description="Which level is this test intended for?"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            Continue to Questions
          </button>
        </div>
      </div>
    </Form>
  );
}
