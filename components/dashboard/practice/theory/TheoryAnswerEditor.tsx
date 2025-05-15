"use client";

import { useState } from 'react';
import { Sparkles, Save, Edit, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TheoryAnswerEditorProps {
  value: string;
  onChange: (value: string) => void;
  referenceAnswer?: string | null;
  solution?: string | null;
  onAIHelp: () => void;
}

export default function TheoryAnswerEditor({
  value,
  onChange,
  referenceAnswer,
  solution,
  onAIHelp
}: TheoryAnswerEditorProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const [showReferenceAnswer, setShowReferenceAnswer] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  
  const handleChange = (newValue: string) => {
    onChange(newValue);
    setAutoSaved(false);
    
    // Auto-save indicator after a delay
    setTimeout(() => {
      setAutoSaved(true);
    }, 1000);
  };
  
  const handleSave = () => {
    setConfirmSave(true);
    setTimeout(() => {
      setConfirmSave(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-gray-800">Your Answer</h3>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-1 text-sm py-1 px-3 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100"
          >
            {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
            {previewMode ? "Edit" : "Preview"}
          </button>
          
          <button
            onClick={onAIHelp}
            className="flex items-center gap-1 text-sm py-1 px-3 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            <Sparkles size={14} />
            AI Help
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {previewMode ? (
          <div className="min-h-[300px] prose prose-purple max-w-none p-3 bg-gray-50 rounded-lg">
            {value ? (
              <div dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br/>') }} />
            ) : (
              <p className="text-gray-400 italic">No answer yet</p>
            )}
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Type your answer here..."
            rows={10}
            className="w-full min-h-[300px] p-4 border rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none resize-y"
          />
        )}
        
        {confirmSave && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-700">
              <Save size={16} className="mr-2" />
              <p>Your answer has been saved successfully.</p>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex flex-wrap justify-between items-center">
          <div className="flex flex-wrap gap-4">
            {referenceAnswer && (
              <button
                onClick={() => {
                  setShowReferenceAnswer(!showReferenceAnswer);
                  setShowSolution(false);
                }}
                className="text-sm text-blue-600 hover:underline flex items-center"
              >
                <HelpCircle size={14} className="mr-1" />
                {showReferenceAnswer ? "Hide reference points" : "View reference points"}
              </button>
            )}
            
            {solution && (
              <button
                onClick={() => {
                  setShowSolution(!showSolution);
                  setShowReferenceAnswer(false);
                }}
                className="text-sm text-blue-600 hover:underline flex items-center"
              >
                <HelpCircle size={14} className="mr-1" />
                {showSolution ? "Hide solution" : "View solution"}
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {autoSaved && !confirmSave && (
              <span className="text-xs text-green-600 flex items-center">
                <Save size={12} className="mr-1" />
                Auto-saved
              </span>
            )}
            
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
            >
              <Save size={14} />
              Save
            </button>
          </div>
        </div>
        
        {showReferenceAnswer && referenceAnswer && (
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Reference Answer Points</h4>
            <div className="text-sm text-blue-700 whitespace-pre-line">
              {referenceAnswer}
            </div>
          </div>
        )}
        
        {showSolution && solution && (
          <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-800 mb-2">Solution</h4>
            <div className="text-sm text-green-700 whitespace-pre-line">
              {solution}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
