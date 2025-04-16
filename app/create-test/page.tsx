"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import ProgressSteps from "@/components/admin/progress-steps";
import TestInformationForm from "@/components/admin/test-information-form";
import QuestionEditor from "@/components/admin/question-editor";
import QuestionList from "@/components/admin/question-list";
import TestReview from "@/components/admin/test-review";

// Define types
interface Option {
  id: string;
  text: string;
}

// Update the Question interface to include topic and solution
interface Question {
  id: number;
  text: string;
  points: number;
  options: Option[];
  correctAnswer: string;
  image?: string;
  topic?: string;
  solution?: string;
}

// Update the TestData interface to include year
export interface TestData {
  title: string;
  description: string;
  icon: string;
  totalQuestions: number;
  duration: number;
  year: number;
  questions: Question[];
  isPopular: boolean;
  questionCount: number;
}

// Available icons for tests
const availableIcons = [
  { id: "sigma", name: "Mathematics" },
  { id: "flask-conical", name: "Science" },
  { id: "book-open", name: "English" },
  { id: "brain", name: "General Knowledge" },
  { id: "code", name: "Computer Science" },
  { id: "landmark", name: "History" },
  { id: "globe", name: "Geography" },
  { id: "palette", name: "Art & Design" },
];

export default function CreateTestPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  // Update the initial state to include year
  const [testData, setTestData] = useState<TestData>({
    title: "",
    description: "",
    icon: "sigma",
    totalQuestions: 30,
    duration: 60,
    year: new Date().getFullYear(),
    questions: [],
    isPopular: false,
    questionCount: 0,
  });
  // Update the initial state for currentQuestion to include empty topic and solution
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: 1,
    text: "",
    points: 3,
    options: [
      { id: "A", text: "" },
      { id: "B", text: "" },
      { id: "C", text: "" },
      { id: "D", text: "" },
    ],
    correctAnswer: "A",
    topic: "",
    solution: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle basic test info changes
   const handleTestInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  
    setTestData({
      ...testData,
      [name]:
        name === "totalQuestions" ||
        name === "duration" ||
        name === "year" ||
        name === "questionCount"
          ? value === "" // Check if the input is empty
            ? "" // Set to an empty string if empty
            : Number(value) // Otherwise, convert to a number
          : value,
    });
  };

  // Toggle popular status
  const togglePopular = () => {
    setTestData({
      ...testData,
      isPopular: !testData.isPopular,
    });
  };

  // Handle question text change
  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentQuestion({
      ...currentQuestion,
      text: e.target.value,
    });
  };

  // Handle question points change
  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuestion({
      ...currentQuestion,
      points: Number.parseInt(e.target.value),
    });
  };

  // Handle option text change
  const handleOptionChange = (id: string, text: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.map((option) =>
        option.id === id ? { ...option, text } : option
      ),
    });
  };

  // Handle correct answer change
  const handleCorrectAnswerChange = (id: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      correctAnswer: id,
    });
  };

  // Handle image change
  const handleImageChange = (imageUrl?: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      image: imageUrl,
    });
  };

  // Add handlers for topic and solution changes
  // Handle topic change
  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuestion({
      ...currentQuestion,
      topic: e.target.value,
    });
  };

  // Handle solution change
  const handleSolutionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentQuestion({
      ...currentQuestion,
      solution: e.target.value,
    });
  };

  // Add current question to test data
  const addQuestion = () => {
    // Validate question
    const newErrors: Record<string, string> = {};

    if (!currentQuestion.text.trim()) {
      newErrors.questionText = "Question text is required";
    }

    let hasEmptyOption = false;
    currentQuestion.options.forEach((option) => {
      if (!option.text.trim()) {
        hasEmptyOption = true;
      }
    });

    if (hasEmptyOption) {
      newErrors.options = "All options must have text";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear any existing errors
    setErrors({});

    // Add question to test data
    const updatedQuestions = [...testData.questions, { ...currentQuestion }];
    setTestData({
      ...testData,
      questions: updatedQuestions,
      // Don't override totalQuestions here
    });

    // Update the reset current question to include empty topic and solution
    // Reset current question for next entry
    setCurrentQuestion({
      id: currentQuestion.id + 1,
      text: "",
      points: 3,
      options: [
        { id: "A", text: "" },
        { id: "B", text: "" },
        { id: "C", text: "" },
        { id: "D", text: "" },
      ],
      correctAnswer: "A",
      topic: "",
      solution: "",
    });
  };

  // Remove a question from test data
  const removeQuestion = (id: number) => {
    const updatedQuestions = testData.questions.filter((q) => q.id !== id);
    setTestData({
      ...testData,
      questions: updatedQuestions,
    });
  };

  // Save the test
  const saveTest = async () => {
    const errors: Record<string, string> = {};

    if (!testData.title.trim()) errors.title = "Test title is required";
    if (!testData.description.trim())
      errors.description = "Test description is required";
    if (testData.questions.length === 0)
      errors.questions = "At least one question is required";

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const res = await fetch("/api/auth/create-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to save test:", data.error);
        return;
      }

      console.log("✅ Test saved successfully:", data.test);
      router.push("/dashboard/practice");
    } catch (error) {
      console.error("Error saving test:", error);
    }
  };

  // Go back to previous page
  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/dashboard/practice-tests");
    }
  };

  // Go to next step
  const goToNextStep = () => {
    // Validate current step
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!testData.title.trim()) {
        newErrors.title = "Test title is required";
      }

      if (!testData.description.trim()) {
        newErrors.description = "Test description is required";
      }

      if (!testData.year || testData.year < 2000) {
        newErrors.year = "Valid year is required";
      }

      if (!testData.totalQuestions || testData.totalQuestions < 1) {
        newErrors.totalQuestions = "Number of questions is required";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep(currentStep + 1);
  };

  // Define steps for the progress indicator
  const steps = [
    {
      number: 1,
      title: "Test Information",
      description: "Basic details about the test",
    },
    { number: 2, title: "Questions", description: "Add test questions" },
    { number: 3, title: "Review", description: "Finalize and save" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={goBack}
            className="p-2 mr-4 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Create New Practice Test
          </h1>
        </div>

        {/* Progress Steps */}
        <ProgressSteps currentStep={currentStep} steps={steps} />

        {/* Step 1: Test Information */}
        {currentStep === 1 && (
          <TestInformationForm
            testData={testData}
            errors={errors}
            availableIcons={availableIcons}
            onChange={handleTestInfoChange}
            onTogglePopular={togglePopular}
            onNext={goToNextStep}
          />
        )}

        {/* Step 2: Questions */}
        {currentStep === 2 && (
          <div>
            {/* Question Editor */}
            <QuestionEditor
              question={currentQuestion}
              errors={errors}
              onQuestionChange={handleQuestionChange}
              onPointsChange={handlePointsChange}
              onOptionChange={handleOptionChange}
              onCorrectAnswerChange={handleCorrectAnswerChange}
              onImageChange={handleImageChange}
              onTopicChange={handleTopicChange}
              onSolutionChange={handleSolutionChange}
              onAddQuestion={addQuestion}
            />

            {/* Added Questions List */}
            <QuestionList
              questions={testData.questions}
              error={errors.questions}
              onRemoveQuestion={removeQuestion}
              onBack={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <TestReview
            testData={testData}
            onBack={() => setCurrentStep(2)}
            onSave={saveTest}
          />
        )}
      </div>
    </div>
  );
}
