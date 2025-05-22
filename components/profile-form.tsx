"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, Save, RefreshCw } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateProfile } from "@/lib/actions";
import { AvatarPicker } from "./avatar-picker";
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
  avatarStyle: z.string(),
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
    avatarStyle?: string;
    avatarSeed?: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("avatar");
  const [saved, setSaved] = useState(false);

  // Step 4: Define default values with the correct types
  const defaultValues: ProfileFormValues = {
    name: user?.name || "",
    email: user?.email || "",
    avatarStyle: user?.avatarStyle || "adventurer",
    avatarSeed:
      user?.avatarSeed ||
      user?.name?.toLowerCase().replace(/\s+/g, "") ||
      "user",
    notifications: true, // Provide default values for all fields
    publicProfile: false,
  };

  // Step 5: Initialize the form with the correct types
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  // Step 6: Create a properly typed submit handler
  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    setIsLoading(true);

    try {
      // Only send the fields that the server action expects
      const result = await updateProfile({
        name: data.name,
        email: data.email,
        avatarStyle: data.avatarStyle,
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
                  <Tabs defaultValue="avatar" className="w-full">
                    <TabsList className="grid grid-cols-1 h-auto gap-2">
                      <TabsTrigger
                        value="avatar"
                        onClick={() => setActiveTab("avatar")}
                        className={`flex items-center justify-start gap-2 py-3 ${
                          activeTab === "avatar"
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                            : ""
                        }`}
                      >
                        <User className="h-4 w-4" />
                        <span>Avatar</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="account"
                        onClick={() => setActiveTab("account")}
                        className={`flex items-center justify-start gap-2 py-3 ${
                          activeTab === "account"
                            ? "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300"
                            : ""
                        }`}
                      >
                        <User className="h-4 w-4" />
                        <span>Account</span>
                      </TabsTrigger>
                    </TabsList>

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
                  </Tabs>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            <Tabs
              value={activeTab}
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsContent value="avatar" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-lg p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Your Avatar
                        </h2>
                        <Badge
                          variant="outline"
                          className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-0"
                        >
                          Express yourself
                        </Badge>
                      </div>
                      <AvatarPicker
                        form={form}
                        defaultStyle={form.getValues("avatarStyle")}
                        defaultSeed={form.getValues("avatarSeed")}
                      />
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="account" className="mt-0">
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
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset(defaultValues)}
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
