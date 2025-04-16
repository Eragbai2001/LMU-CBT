"use client";

import { supabase } from "@/lib/supabaseClient"; // Supabase instance
import { v4 as uuidv4 } from "uuid"; // UUID generator
import { useRouter } from "next/navigation";

interface Option {
  text: string;
}

interface Question {
  id: string;
  text: string;
  points: number;
  options: Option[];
  correctAnswer: string;
  solution: string; // ✅ New field
  topic: string;    // ✅ New field
  image?: string;
}

interface TestData {
  title: string;
  description: string;
  icon: string;
  isPopular: boolean;
  totalQuestions: number;
  duration: number;
  year: number;
  questions: Question[];
}

interface SaveTestProps {
  testData: TestData;
  setErrors: (errors: Record<string, string>) => void;
}

export default function SaveTest({ testData, setErrors }: SaveTestProps) {
  const router = useRouter();

  const saveTest = async () => {
    const newErrors: Record<string, string> = {};

    // Validate test data
    if (!testData.title.trim()) newErrors.title = "Test title is required";
    if (!testData.description.trim()) newErrors.description = "Test description is required";
    if (testData.questions.length === 0) newErrors.questions = "At least one question is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // 1. Insert practice test
      const { data: test, error: testError } = await supabase
        .from("practiceTest")
        .insert({
          id: uuidv4(),
          title: testData.title,
          description: testData.description,
          icon: testData.icon,
          isPopular: testData.isPopular,
          questionCount: testData.totalQuestions,
          duration: testData.duration,
          year: testData.year,
        })
        .select()
        .single();

      if (testError || !test) {
        console.error("Failed to create test:", testError);
        return;
      }

      // 2. Insert questions
      const questionPayload = testData.questions.map((q) => ({
        id: uuidv4(),
        text: q.text,
        points: q.points,
        options: q.options.map((o) => o.text),
        correctAnswer: q.correctAnswer,
        solution: q.solution, // ✅ Include solution
        topic: q.topic,       // ✅ Include topic
        image: q.image || null,
        testId: test.id,
      }));

      const { error: questionError } = await supabase.from("question").insert(questionPayload);

      if (questionError) {
        console.error("Failed to insert questions:", questionError);
        return;
      }

      console.log("Test and questions saved successfully.");
      router.push("/practice-tests");
    } catch (error) {
      console.error("Unexpected error saving test:", error);
    }
  };

  return (
    <button
      onClick={saveTest}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Save Test
    </button>
  );
}