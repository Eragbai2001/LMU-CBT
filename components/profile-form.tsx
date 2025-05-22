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
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// Step 1: Define the schema with explicit types for all fields
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  avatarSeed: z.string(),
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
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentAvatarSeed, setCurrentAvatarSeed] = useState(user?.avatarSeed || user?.name?.toLowerCase().replace(/\\s+/g, "") || "user");

  // Initialize currentAvatarSeed
  useEffect(() => {
    setCurrentAvatarSeed(user?.avatarSeed || user?.name?.toLowerCase().replace(/\\s+/g, "") || "user");
  }, [user?.avatarSeed, user?.name]);

  // Step 4: Define default values with the correct types
  const defaultValues: ProfileFormValues = {
    name: user?.name || "",
    email: user?.email || "",
    avatarSeed: currentAvatarSeed,
    notifications: true, // Provide default values for all fields
    publicProfile: false,
  };

  // Step 5: Initialize the form with the correct types
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    values: { // ensure form is updated when currentAvatarSeed changes
        name: user?.name || "",
        email: user?.email || "",
        avatarSeed: currentAvatarSeed,
        notifications: defaultValues.notifications, 
        publicProfile: defaultValues.publicProfile,
    }
  });
  
  // Update form when currentAvatarSeed changes
  useEffect(() => {
    form.setValue("avatarSeed", currentAvatarSeed);
  }, [currentAvatarSeed, form]);

  // Step 6: Create a properly typed submit handler
  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    setIsLoading(true);

    try {
      // Only send the fields that the server action expects
      const result = await updateProfile({
        name: data.name,
        email: data.email,
        avatarSeed: data.avatarSeed,
      });

      if (result.success) {
        toast.success("Profile updated successfully", {
          description: "Your changes have been saved",
          icon: "🎉",
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating your profile");
      console.error(error);
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
              transition={{ duration: 0.5 }}
            >
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
                      className="gap-2"
                    >
                      <Dice5 className="h-4 w-4" />
                      Randomize
                    </Button>
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
                          className={`${badge.color} text-white`}
                        >
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
              transition={{ duration: 0.5 }}
            >
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-lg p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Account Settings
                    </h2>
                    <Badge
                      variant="outline"
                      className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-0"
                    >
                      Personal info
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              {...field}
                              className="bg-white dark:bg-gray-950"
                            />
                          </FormControl>
                          <FormDescription>
                            This is how others will see you in the platform.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your.email@example.com"
                              {...field}
                              readOnly
                              className="bg-white dark:bg-gray-950"
                            />
                          </FormControl>
                          <FormDescription>
                            Your email address is used for notifications and
                            login.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="avatarSeed"
                      render={({ field }) => (
                        <FormItem className="sr-only"> {/* Hidden from view but present in form */}
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
                              Receive notifications about new assignments
                              and messages.
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
              setCurrentAvatarSeed(user?.avatarSeed || user?.name?.toLowerCase().replace(/\\s+/g, "") || "user");
            }}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>

          <AnimatePresence>
            {saved ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Saved successfully!
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
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
