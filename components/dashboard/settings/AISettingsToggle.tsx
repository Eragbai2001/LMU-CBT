"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function AISettingsToggle() {
  const [enabled, setEnabled] = useState(false);

  // Load initial setting from localStorage
  useEffect(() => {
    const storedValue = localStorage.getItem('enableAiAssistant');
    setEnabled(storedValue === 'true');
  }, []);

  // Update localStorage when setting changes
  const toggleAI = (checked: boolean) => {
    setEnabled(checked);
    localStorage.setItem('enableAiAssistant', checked.toString());
  };

  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white dark:bg-gray-950">
      <div className="space-y-0.5">
        <div className="text-base font-medium flex items-center gap-2">
          <Sparkles size={16} className="text-blue-500" />
          AI Assistant
        </div>
        <div className="text-sm text-gray-500">
          Enable AI Assistant for additional help with questions. 
          The assistant can provide hints and explanations.
        </div>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={toggleAI}
      />
    </div>
  );
} 