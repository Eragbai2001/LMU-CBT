import { getTestById } from "@/app/api/edit-test/[id]/route";
import CreateTestPage, { TestData, Question } from "@/app/create-test/page";

export default async function EditTestPage({
  params,
}: {
  params: { id: string };
}) {
  const test = await getTestById(params.id);

  if (!test) return <div>Test not found</div>;

  // Transform the questions array to match the Question interface
  const transformedQuestions: Question[] = test.questions.map(
    (q: any, index: number) => {
      // Use the original ID if it's a string, or generate a unique ID
      const uniqueId = q.id || `question-${index}-${Date.now()}`;

      // Convert the string array options to objects with id and text
      const letterIds = ["A", "B", "C", "D"];
      const optionObjects = (q.options || []).map(
        (optionText: string, optIndex: number) => ({
          id: letterIds[optIndex],
          text: optionText || "",
        })
      );

      // Ensure we have exactly 4 options
      while (optionObjects.length < 4) {
        optionObjects.push({
          id: letterIds[optionObjects.length],
          text: "",
        });
      }

      return {
        id: uniqueId, // Keep the original ID or generate a unique one
        text: q.content || "",
        options: optionObjects.slice(0, 4),
        correctAnswer: q.correctAnswer || "A",
        image: q.image || "",
        points: q.points || 3,
        topic: q.topic || "General",
        solution: q.solution || "No solution yet",
      };
    }
  );
  // Transform the test object to match the TestData type
  const transformedTest: TestData = {
    id: params.id,
    title: test.title || "",
    description: test.description || "",
    icon: test.icon || "sigma",
    totalQuestions: transformedQuestions.length, // Calculate total questions
    duration: test.duration || 60, // Default to 60 minutes if missing
    year: new Date().getFullYear(), // Default to the current year
    questions: transformedQuestions, // Use the transformed questions array
    isPopular: test.isPopular || false,
    questionCount: transformedQuestions.length, // Same as totalQuestions
    points: transformedQuestions.reduce((sum, q) => sum + (q.points || 0), 0), // Calculate total points
    testType: (test.testType === "objective" || test.testType === "theory") ? test.testType : "objective", // Ensure testType is valid
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Test</h1>
      <CreateTestPage initialData={transformedTest} />
    </div>
  );
}
