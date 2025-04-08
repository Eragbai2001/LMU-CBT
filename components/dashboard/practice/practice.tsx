"use client";
import { useEffect, useState } from "react";
import { Clock, FileText, ArrowRight, ChevronRight } from "lucide-react";
import { Sigma, FlaskConical, BookOpen, Brain } from "lucide-react";

interface Test {
  id: string | number;
  icon: string;
  title: string;
  description: string;
  isPopular?: boolean;
  questionCount: number;
  duration: number;
}

// Map to convert icon string names to Lucide components
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

  useEffect(() => {
    fetch("/api/auth/practice-tests")
      .then((res) => res.json())
      .then((data) => {
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
        {displayedTests.map((test: Test) => (
          <div
            key={test.id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100  cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full">
                {iconMap[test.icon] || test.icon}
              </div>
              {test.isPopular && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs font-medium rounded-full">
                  Popular
                </span>
              )}
            </div>

            <h3 className="font-bold text-lg mb-2 text-gray-800">
              {test.title}
            </h3>
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
              <button className="w-full flex items-center justify-center py-2 px-4 bg-blue-50  text-blue-600 font-medium rounded-lg text-sm transition-colors hover:bg-blue-600 hover:text-white cursor-pointer">
                Start Practice
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {hasMoreTests && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center py-2 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm transition-colors shadow-sm"
          >
            {showAll ? "Show Less" : "Show More"}
            <ChevronRight
              size={16}
              className={`ml-2 transition-transform ${
                showAll ? "rotate-90" : ""
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
