"use client";
import { useState, useRef, ChangeEvent } from "react";
import { X, FileUp, Loader2, Check, AlertCircle } from "lucide-react";

interface UploadNotesModalProps {
  onClose: () => void;
  onTestCreated: (test: any) => void;
}

export default function UploadNotesModal({ onClose, onTestCreated }: UploadNotesModalProps) {
  // Form state
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [testType, setTestType] = useState<"objective" | "theory">("objective");
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [duration, setDuration] = useState(30); // Default duration in minutes

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setFileName(droppedFile.name);
      setError("");
    }
  };

  const validateStep1 = () => {
    if (!file) {
      setError("Please upload a file");
      return false;
    }
    if (!title.trim()) {
      setError("Please enter a title");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      setError("");
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
    setError("");
  };

  const handleGenerateTest = async () => {
    if (!file || !title.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("testType", testType);
      formData.append("questionCount", questionCount.toString());
      formData.append("duration", duration.toString());

      const response = await fetch("/api/generate-test", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate test");
      }

      const newTest = await response.json();
      setSuccess(true);
      
      // Notify parent component about the new test
      setTimeout(() => {
        onTestCreated(newTest);
      }, 2000);
    } catch (err) {
      console.error("Error generating test:", err);
      setError(err instanceof Error ? err.message : "Failed to generate test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {currentStep === 1 ? "Upload Your Notes" : "Generate Test"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-6">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                2
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Test Generated Successfully!</h3>
              <p className="text-gray-600 mb-6">Your new test has been created and is ready to use.</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Go to Tests
              </button>
            </div>
          ) : (
            <>
              {currentStep === 1 && (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                      Test Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter a title for your test"
                    />
                  </div>

                  <div className="mb-4">
                    <p className="block text-sm font-medium text-gray-700 mb-1">Upload Document *</p>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                        onChange={handleFileChange}
                      />
                      <FileUp size={36} className="text-gray-400 mb-2" />
                      {fileName ? (
                        <div>
                          <p className="text-sm font-medium text-gray-700">{fileName}</p>
                          <p className="text-xs text-gray-500">Click or drag to replace</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, PPT, PPTX, TXT (max 10MB)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          testType === "objective"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setTestType("objective")}
                      >
                        <h3 className="font-medium text-gray-800 mb-1">Multiple Choice</h3>
                        <p className="text-sm text-gray-600">Questions with options</p>
                      </div>
                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          testType === "theory"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setTestType("theory")}
                      >
                        <h3 className="font-medium text-gray-800 mb-1">Theory</h3>
                        <p className="text-sm text-gray-600">Open-ended questions</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="questionCount">
                      Number of Questions
                    </label>
                    <div className="flex items-center">
                      <input
                        id="questionCount"
                        type="range"
                        min="5"
                        max="30"
                        step="5"
                        value={questionCount}
                        onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="ml-2 text-gray-700 font-medium w-8">{questionCount}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="duration">
                      Test Duration (minutes)
                    </label>
                    <select
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                {currentStep === 1 ? (
                  <>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={prevStep}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleGenerateTest}
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        "Generate Test"
                      )}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 