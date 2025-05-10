"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Clock,
  FileText,
  ArrowRight,
  ChevronRight,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { Sigma, FlaskConical, BookOpen, Brain } from "lucide-react";
import TestPopupModal from "./TestPopupModal";
import ConfirmationModal from "./ConfirmationModal";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Import useSession for role check

interface Test {
  id: string | number;
  icon: string;
  title: string;
  description: string;
  isPopular?: boolean;
  questionCount: number;
  durationOptions: { id: string; minutes: number }[];
  yearOptions: { id: string; value: number }[];
  duration: number;
  testType?: "objective" | "theory"; // Add test type field
}

const iconMap: Record<string, React.ReactNode> = {
  sigma: <Sigma className="w-6 h-6" />,
  "flask-conical": <FlaskConical className="w-6 h-6" />,
  "book-open": <BookOpen className="w-6 h-6" />,
  brain: <Brain className="w-6 h-6 text-pink-600" />,
};

export default function PracticeTests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<Test | null>(null);
  const router = useRouter();
  const { data: session } = useSession(); // Get session data
  const isAdmin = session?.user?.role === "ADMIN"; // Check if the user is an admin

  const handleEdit = useCallback(
    (testId: string | number) => {
      const testToEdit = tests.find((t) => t.id === testId);
      if (!testToEdit) return;

      router.push(`/edit-test/${testId}`);
    },
    [tests, router]
  );

  const handleDeleteClick = (testId: string | number) => {
    const testToDelete = tests.find((t) => t.id === testId) || null;
    setTestToDelete(testToDelete);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!testToDelete) return;

    try {
      const res = await fetch(`/api/delete/${testToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTests((prev) => prev.filter((t) => t.id !== testToDelete.id));
        setIsDeleteModalOpen(false);
        setTestToDelete(null);
      } else {
        console.error("Failed to delete test");
      }
    } catch (err) {
      console.error("Error deleting test:", err);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTestToDelete(null);
  };

  useEffect(() => {
    fetch("/api/auth/practice-tests")
      .then((res) => res.json())
      .then((data) => {
        console.log("Tests from API:", data); // Enhanced logging to check testType values
        setTests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching practice tests:", err);
        setLoading(false);
      });
  }, []);

  const displayedTests = showAll ? tests : tests.slice(0, 4);
  const hasMoreTests = tests.length > 4;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-md animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-200 w-3/4 mb-3 rounded"></div>
            <div className="h-4 bg-gray-200 w-full mb-2 rounded"></div>
            <div className="h-4 bg-gray-200 w-5/6 mb-4 rounded"></div>
            <div className="h-3 bg-gray-200 w-1/2 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedTests.map((test) => (
          <div
            key={test.id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full">
                {iconMap[test.icon] || test.icon}
              </div>
              {isAdmin && (
                <div className="relative">
                  <div
                    className={`absolute top-2 right-2 flex space-x-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100`}
                  >
                    <button
                      onClick={() => handleEdit(test.id)}
                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer"
                      aria-label="Edit test"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(test.id)}
                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                      aria-label="Delete test"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                {test.title}
              </h3>

              {/* Fixed test type badge logic */}
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  test.testType && test.testType === "theory"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {/* Removed console.log to fix the error */}
                {test.testType === "theory" ? "Theory" : "Objective"}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {test.description}
            </p>

            <div className="flex items-center text-gray-500 text-sm mb-4">
              <FileText size={16} className="mr-1" />
              <span className="mr-4">{test.questionCount} Questions</span>
              <Clock size={16} className="mr-1" />
              <span>{test.duration} mins</span>
            </div>

            <div className="mt-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedTest(test)}
                className="w-full flex items-center justify-center py-2 px-4 bg-blue-50 text-blue-600 font-medium rounded-lg text-sm transition-colors hover:bg-blue-600 hover:text-white cursor-pointer"
              >
                Start Practice
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 space-x-3">
        {hasMoreTests && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center justify-center py-2.5 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm transition-all shadow-sm hover:shadow cursor-pointer group"
          >
            <span>{showAll ? "Show Less" : "Show More"}</span>
            <ChevronRight
              size={16}
              className={`ml-2 transition-transform duration-300 ${
                showAll ? "rotate-90" : "group-hover:translate-x-0.5"
              }`}
            />
          </button>
        )}
        {isAdmin && (
          <button
            onClick={() => router.push("/create-test")}
            className="flex items-center justify-center py-2.5 px-6 bg-blue-600 text-white font-medium rounded-lg text-sm shadow-sm hover:bg-blue-700 transition-all hover:shadow cursor-pointer group"
          >
            <span>Create Test</span>
            <Plus
              size={16}
              className="ml-2 transition-transform group-hover:scale-110 duration-300"
            />
          </button>
        )}
      </div>

      {selectedTest && (
        <TestPopupModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Test"
        message={
          testToDelete
            ? `Are you sure you want to delete "${testToDelete.title}"? This action cannot be undone.`
            : ""
        }
        confirmText={loading ? "Deleting..." : "Delete"} // Show loader text
        cancelText="Cancel"
        onConfirm={async () => {
          if (testToDelete) {
            setLoading(true); // Set loading state to true
            await confirmDelete(); // Perform delete operation
            setLoading(false); // Reset loading state
          }
        }}
        onCancel={cancelDelete}
        confirmDisabled={loading} // Disable confirm button while loading
      />
    </div>
  );
}
