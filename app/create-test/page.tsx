"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import ProgressSteps from "@/components/admin/progress-steps";
import TestInformationForm from "@/components/admin/test-information-form";
import QuestionEditor from "@/components/admin/question-editor";
import QuestionList from "@/components/admin/question-list";
import TestReview from "@/components/admin/test-review";
import { getUser } from "@/lib/getUser";
import FullPageLoader from "@/components/Loader/full-page-loader";

// Define types
interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  points: number;
  options: Option[];
  correctAnswer: string;
  image?: string;
  topic?: string;
  solution?: string;
}

export interface TestData {
  id?: string;
  title: string;
  description: string;
  icon: string;
  totalQuestions: number;
  duration: number;
  year: number;
  questions: Question[];
  isPopular: boolean;
  questionCount: number;
  points: number;
}

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

export default function CreateTestPage({
  initialData,
}: {
  initialData?: TestData;
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false); // Track authorization status

  const [testData, setTestData] = useState<TestData>(
    initialData || {
      title: "",
      description: "",
      icon: "sigma",
      totalQuestions: 30,
      duration: 60,
      year: new Date().getFullYear(),
      questions: [],
      isPopular: false,
      questionCount: 0,
      points: 0,
    }
  );

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: 1,
    text: "",
    points: 3,
    image: "",
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

  useEffect(() => {
    async function checkAuthorization() {
      const user = await getUser();

      if (!user || user.role !== "ADMIN") {
        // Redirect unauthorized users
        router.push("/unauthorized");
        return;
      }

      setIsAuthorized(true); // User is authorized
    }

    checkAuthorization();

    if (initialData) {
      setTestData(initialData);
      setLoading(false);
    } else if (editId) {
      const key = `edit-test-${editId}`;
      const savedData = localStorage.getItem(key);

      if (savedData) {
        try {
          const data = JSON.parse(savedData);

          if (data && typeof data === "object") {
            setTestData({
              title: data.title ?? "",
              description: data.description ?? "",
              icon: data.icon ?? "sigma",
              totalQuestions: Number(data.totalQuestions) || 0,
              duration: Number(data.duration) || 0,
              year: Number(data.year) || new Date().getFullYear(),
              isPopular: data.isPopular ?? false,
              questionCount: Number(data.questionCount) || 0,
              questions: Array.isArray(data.questions) ? data.questions : [],
              points: Number(data.points) || 0,
            });
          } else {
            console.error("Invalid data structure in localStorage");
          }
        } catch (error) {
          console.error("Failed to parse saved test:", error);
        }
      }
    } else {
      setLoading(false);
    }
  }, [router, initialData, editId]);

  if (loading) {
    return (
      <div>
        <FullPageLoader message="Loading loading test creator" />
      </div>
    );
  }

  const handleTestInfoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setTestData({
      ...testData,
      [name]:
        name === "totalQuestions" ||
        name === "duration" ||
        name === "year" ||
        name === "questionCount"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    });
  };

  const togglePopular = () => {
    setTestData({
      ...testData,
      isPopular: !testData.isPopular,
    });
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentQuestion({
      ...currentQuestion,
      text: e.target.value,
    });
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setCurrentQuestion({
      ...currentQuestion,
      points: value === "" ? 0 : Number(value),
    });
  };

  const handleOptionChange = (id: string, text: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.map((option) =>
        option.id === id ? { ...option, text } : option
      ),
    });
  };

  const handleCorrectAnswerChange = (id: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      correctAnswer: id,
    });
  };

  const handleImageChange = (imageUrl?: string) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      image: imageUrl,
    }));
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuestion({
      ...currentQuestion,
      topic: e.target.value,
    });
  };

  const handleSolutionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentQuestion({
      ...currentQuestion,
      solution: e.target.value,
    });
  };

  const addQuestion = () => {
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

    setErrors({});

    const newId = testData.questions.length
      ? Math.max(...testData.questions.map((q) => q.id)) + 1
      : 1;

    const updatedQuestions = [
      ...testData.questions,
      { ...currentQuestion, id: newId },
    ];
    const totalPoints = updatedQuestions.reduce((sum, q) => sum + q.points, 0);

    setTestData({
      ...testData,
      questions: updatedQuestions,
      points: totalPoints,
    });

    setCurrentQuestion({
      id: newId + 1,
      text: "",
      points: 3,
      image: "",
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

  const removeQuestion = (id: number) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      const updatedQuestions = testData.questions.filter((q) => q.id !== id);
      setTestData({
        ...testData,
        questions: updatedQuestions,
      });
    }
  };

  const saveTest = async () => {
    const errors: Record<string, string> = {};

    // Validate test data
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
      const endpoint = testData.id
        ? `/api/edit-test/${testData.id}` // Use the ID for updates
        : "/api/auth/create-test"; // Create a new test if no ID exists

      const method = testData.id ? "PUT" : "POST";
      console.log(testData.id);

      // Log the request payload
      const payload = {
        ...testData,
        questions: testData.questions,
      };
      console.log("Request payload:", payload);

      // Check if the payload serializes correctly
      const jsonBody = JSON.stringify(payload);
      console.log("JSON body length:", jsonBody.length);

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to save test:", data.error);
        setGlobalError(data.error || "Failed to save test");
        return;
      }

      console.log("Test ID type:", typeof testData.id);
      router.push("/dashboard/practice");
    } catch (error) {
      console.error("Error saving test:", error);
      setGlobalError("An unexpected error occurred. Please try again.");
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/dashboard/practice");
    }
  };

  const goToNextStep = () => {
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
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep(currentStep + 1);
  };

  const steps = [
    {
      number: 1,
      title: "Test Information",
      description: "Basic details about the test",
    },
    { number: 2, title: "Questions", description: "Add test questions" },
    { number: 3, title: "Review", description: "Finalize and save" },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {globalError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {globalError}
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={goBack}
            className="p-2 mr-4 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {editId ? "Edit Practice Test" : "Create New Practice Test"}
          </h1>
        </div>

        <ProgressSteps currentStep={currentStep} steps={steps} />

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

        {currentStep === 2 && (
          <div>
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

            <QuestionList
              questions={testData.questions}
              error={errors.questions}
              onRemoveQuestion={removeQuestion}
              onBack={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          </div>
        )}

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
