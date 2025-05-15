import { ChevronLeft } from "lucide-react";

interface TheoryHeaderProps {
  title: string;
  year: number;
  topics: string[] | null;
  onReturnHome: () => void;
}

export default function TheoryHeader({ title, year, topics, onReturnHome }: TheoryHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onReturnHome}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            
            <div>
              <h1 className="text-xl font-bold text-gray-800">{title}</h1>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-600 mr-4">Year: {year}</span>
                
                {topics && topics.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Topics:</span>
                    {topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
              Theory Test
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
