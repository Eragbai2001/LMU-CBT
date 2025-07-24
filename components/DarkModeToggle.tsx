"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function DarkModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center justify-between py-2 rounded-lg border p-4 dark:bg-gray-950">
      <div className="space-y-1">
        <Label className="text-dark-text-primary font-medium flex items-center gap-2">
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
          {isDark ? "Light Mode" : "Dark Mode"}
        </Label>
        <p className="text-dark-text-muted text-sm text-gray-500">
          Switch between light and dark appearance.
        </p>
      </div>
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
       
      />
    </div>
  );
}
