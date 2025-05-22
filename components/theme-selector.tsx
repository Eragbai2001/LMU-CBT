"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string>("system");
  const [mounted, setMounted] = useState(false);

  // Only run on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setSelectedTheme(theme || "system");
  }, [theme]);

  // Don't render anything until mounted on client
  if (!mounted) {
    return null;
  }

  const themes = [
    {
      name: "light",
      icon: Sun,
      label: "Light",
      colors: "bg-white border-gray-200",
      textColor: "text-gray-900",
    },
    {
      name: "dark",
      icon: Moon,
      label: "Dark",
      colors: "bg-gray-900 border-gray-700",
      textColor: "text-white",
    },
    {
      name: "system",
      icon: Monitor,
      label: "System",
      colors: "bg-gradient-to-br from-white to-gray-900 border-purple-300",
      textColor: "text-gray-900",
    },
  ];

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Choose Theme</h3>
        <p className="text-sm text-gray-500">
          Select a theme for your account settings only
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {themes.map((item) => (
          <motion.div
            key={item.name}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card
              className={`relative cursor-pointer p-4 border-2 ${
                selectedTheme === item.name
                  ? "border-purple-500"
                  : "border-gray-200"
              } ${item.colors} transition-all duration-200`}
              onClick={() => handleThemeChange(item.name)}
            >
              <div className="flex flex-col items-center justify-center h-24 gap-2">
                <item.icon
                  className={`h-8 w-8 ${
                    item.name === "system" ? "text-purple-500" : item.textColor
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    item.name === "system" ? "text-gray-900" : item.textColor
                  }`}
                >
                  {item.label}
                </span>
              </div>
              {selectedTheme === item.name && (
                <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
        <h4 className="text-sm font-medium text-purple-900 mb-2">
          Theme Preview (Account Settings Only)
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-md border border-gray-200">
            <div className="h-2 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-2 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white p-3 rounded-md border border-gray-200">
            <div className="h-2 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-2 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
