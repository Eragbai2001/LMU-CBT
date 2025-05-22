"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SimplifiedThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Choose Theme</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select a theme for your profile and dashboard
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={theme === "light" ? "default" : "outline"}
          size="sm"
          onClick={() => setTheme("light")}
          className="gap-2"
        >
          <Sun className="h-4 w-4" />
          Light
        </Button>
      </div>
    </div>
  );
}
