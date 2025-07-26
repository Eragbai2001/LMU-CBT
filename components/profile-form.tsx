"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Save, RefreshCw, Dice5 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/lib/route";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AcademicSelect } from "./academic-select";

// Step 1: Define the schema with explicit types for all fields
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  avatarSeed: z.string(),
  departmentId: z.string().optional(), // Add these fields
  levelId: z.string().optional(),
  // Make these fields explicitly required with default values
  notifications: z.boolean(),
  publicProfile: z.boolean(),
});

// Step 2: Create the type from the schema
type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Step 3: Define the props with a specific type
interface ProfileFormProps {
  user: {
    name?: string;
    email?: string;
    avatarSeed?: string;
    departmentId?: string;
    levelId?: string;
    department?: {
      id: string;
      name: string;
      code?: string;
    } | null;
    level?: {
      id: string;
      name: string;
      value: number;
    } | null;
  };
}

interface Department {
  id: string;
  name: string;
  code?: string;
}

interface Level {
  id: string;
  name: string;
  value: number;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentAvatarSeed, setCurrentAvatarSeed] = useState(
    user?.avatarSeed || user?.name?.toLowerCase().replace(/\\s+/g, "") || "user"
  );
  const [departments, setDepartments] = useState<Department[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoadingAcademicData, setIsLoadingAcademicData] = useState(true);

  // Initialize currentAvatarSeed
  useEffect(() => {
    setCurrentAvatarSeed(
      user?.avatarSeed ||
        user?.name?.toLowerCase().replace(/\\s+/g, "") ||
        "user"
    );
  }, [user?.avatarSeed, user?.name]);

  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        const response = await fetch("/api/academic-data");
        const data = await response.json();

        if (data.departments && data.levels) {
          setDepartments(data.departments);
          setLevels(data.levels);
        }
      } catch (error) {
        console.error("Failed to fetch academic data:", error);
      }
    };

    fetchAcademicData();
  }, []);

  // Step 4: Define default values with the correct types
  const defaultValues: ProfileFormValues = {
    name: user?.name || "",
    email: user?.email || "",
    avatarSeed: currentAvatarSeed,
    notifications: true, // Provide default values for all fields
    publicProfile: false,
    departmentId: user?.departmentId || "_none_", // Include these fields
    levelId: user?.levelId || "_none_",
  };

  // Step 5: Initialize the form with the correct types
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    values: {
      // ensure form is updated when currentAvatarSeed changes
      name: user?.name || "",
      email: user?.email || "",
      avatarSeed: currentAvatarSeed,
      notifications: defaultValues.notifications,
      publicProfile: defaultValues.publicProfile,
    },
  });

  // Update form when currentAvatarSeed changes
  useEffect(() => {
    form.setValue("avatarSeed", currentAvatarSeed);
  }, [currentAvatarSeed, form]);

  // Step 6: Create a properly typed submit handler
  // In your profile-form.tsx

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    setIsLoading(true);

    try {
      // Handle placeholder values
      const departmentId =
        data.departmentId === "_none_" ? null : data.departmentId;
      const levelId = data.levelId === "_none_" ? null : data.levelId;

      const result = await updateProfile({
        name: data.name,
        email: data.email,
        avatarSeed: data.avatarSeed,
        departmentId, // Now properly typed
        levelId, // Now properly typed
      });

      // Rest of your existing code
      if (result.success) {
        toast.success("Profile updated successfully");
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomizeAvatar = () => {
    const newSeed = Math.random().toString(36).substring(2, 10);
    setCurrentAvatarSeed(newSeed);
    form.setValue("avatarSeed", newSeed); // Ensure form value is updated
  };

  const getAvatarUrl = (seed: string) => {
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
  };

  // Achievement badges
  const achievements = [
    { name: "Early Adopter", icon: "🚀", color: "bg-blue-500" },
    { name: "Quiz Master", icon: "🧠", color: "bg-purple-500" },
    { name: "First Assignment", icon: "📝", color: "bg-green-500" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}>
              <Card className="p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-lg">
                <div className="space-y-4">
                  <div className="flex flex-col items-center space-y-2">
                    <img
                      src={getAvatarUrl(currentAvatarSeed)}
                      alt="Avatar preview"
                      className="h-32 w-32 rounded-full object-cover border-4 border-purple-200 dark:border-purple-900 shadow-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRandomizeAvatar}
                      className="gap-2">
                      <Dice5 className="h-4 w-4" />
                      Randomize
                    </Button>
                    <div className="mt-2 text-center">
                      <h3 className="font-medium text-lg text-gray-800 dark:text-gray-100">
                        {user?.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>

                      {/* Display department and level info */}
                      <div className="mt-2 flex flex-col gap-1">
                        {user?.department && (
                          <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                            {user.department.name}
                          </span>
                        )}
                        {user?.level && (
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                            {user.level.name}
                          </span>
                        )}
                        {!user?.department && !user?.level && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                            No department or level selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      Your Achievements
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {achievements.map((badge) => (
                        <Badge
                          key={badge.name}
                          className={`${badge.color} text-white`}>
                          {badge.icon} {badge.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}>
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-lg p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Account Settings
                    </h2>
                    <Badge
                      variant="outline"
                      className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-0">
                      Personal info
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="avatarSeed"
                      render={({ field }) => (
                        <FormItem className="sr-only">
                          {" "}
                          {/* Hidden from view but present in form */}
                          <FormLabel>Avatar Seed</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white dark:bg-gray-950">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive notifications about new assignments and
                              messages.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="publicProfile"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white dark:bg-gray-950">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Public Profile
                            </FormLabel>
                            <FormDescription>
                              Allow other students to see your profile and
                              achievements.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <AcademicSelect
                      name="departmentId"
                      control={form.control}
                      label="Department"
                      placeholder="Select your department"
                      items={departments}
                      description="Select your academic department to see relevant practice tests."
                    />

                    <AcademicSelect
                      name="levelId"
                      control={form.control}
                      label="Level"
                      placeholder="Select your level"
                      items={levels}
                      description="Your academic level helps customize practice content."
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset(defaultValues);
              // Reset avatarSeed to its initial value from user prop or default
              setCurrentAvatarSeed(
                user?.avatarSeed ||
                  user?.name?.toLowerCase().replace(/\\s+/g, "") ||
                  "user"
              );
            }}
            disabled={isLoading}
            className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>

          <AnimatePresence>
            {saved ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-4 py-2 rounded-md flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Saved successfully!
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save changes
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </Form>
  );
}
