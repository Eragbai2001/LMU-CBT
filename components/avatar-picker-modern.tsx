"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, RefreshCw, Sparkles, Download } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

// Define the schema to match the parent form
const profileSchema = z.object({
  name: z.string(),
  email: z.string(),
  avatarStyle: z.string(),
  avatarSeed: z.string(),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  notifications: z.boolean().default(true),
  publicProfile: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const AVATAR_STYLES = [
  { value: "adventurer", label: "Adventurer", emoji: "🧗" },
  { value: "adventurer-neutral", label: "Adventurer Neutral", emoji: "🏕️" },
  { value: "avataaars", label: "Avataaars", emoji: "👤" },
  { value: "big-ears", label: "Big Ears", emoji: "👂" },
  { value: "big-smile", label: "Big Smile", emoji: "😁" },
  { value: "bottts", label: "Bottts", emoji: "🤖" },
  { value: "croodles", label: "Croodles", emoji: "🎨" },
  { value: "fun-emoji", label: "Fun Emoji", emoji: "😎" },
  { value: "pixel-art", label: "Pixel Art", emoji: "👾" },
];

export function AvatarPickerModern({
  form,
  defaultStyle = "adventurer",
  defaultSeed = "user",
}: {
  form: UseFormReturn<ProfileFormValues>;
  defaultStyle?: string;
  defaultSeed?: string;
}) {
  const [avatarStyle, setAvatarStyle] = useState(defaultStyle);
  const [avatarSeed, setAvatarSeed] = useState(defaultSeed);
  const [randomSeed, setRandomSeed] = useState("");
  const [zoom, setZoom] = useState(100);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    generateRandomSeed();
  }, []);

  const generateRandomSeed = () => {
    const seed = Math.random().toString(36).substring(2, 10);
    setRandomSeed(seed);
  };

  const getAvatarUrl = (style: string, seed: string) => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
  };

  const downloadAvatar = () => {
    const url = getAvatarUrl(avatarStyle, avatarSeed);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${avatarStyle}-${avatarSeed}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Avatar preview with animations */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div
            className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-purple-200 dark:border-purple-900 shadow-lg"
            style={{ transform: `scale(${zoom / 100})` }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <img
              src={getAvatarUrl(avatarStyle, avatarSeed) || "/placeholder.svg"}
              alt="Avatar preview"
              className="h-full w-full object-cover"
            />

            {isHovering && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/30 flex items-center justify-center"
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="gap-1"
                  onClick={downloadAvatar}
                >
                  <Download className="h-3 w-3" />
                  Save
                </Button>
              </motion.div>
            )}
          </div>

          <motion.div
            className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-1 rounded-full"
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5 }}
          >
            <Sparkles className="h-4 w-4" />
          </motion.div>
        </motion.div>

        <div className="space-y-4 flex-1">
          <div>
            <h3 className="text-lg font-medium mb-2">Customize Your Avatar</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Make it uniquely yours! Choose a style and personalize it.
            </p>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="avatarSeed"
              render={({ field }) => (
                <FormItem>
                  <Label>Avatar Seed</Label>
                  <FormControl>
                    <div className="flex w-full items-center space-x-2">
                      <Input
                        placeholder="Enter seed"
                        value={avatarSeed}
                        onChange={(e) => {
                          setAvatarSeed(e.target.value);
                          field.onChange(e.target.value);
                        }}
                        className="bg-white dark:bg-gray-950"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          generateRandomSeed();
                          setAvatarSeed(randomSeed);
                          field.onChange(randomSeed);
                        }}
                        className="bg-white dark:bg-gray-950"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Avatar Size</Label>
              <Slider
                defaultValue={[100]}
                max={150}
                min={50}
                step={1}
                onValueChange={(value) => setZoom(value[0])}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-lg font-medium mb-4 block">Avatar Style</Label>
        <FormField
          control={form.control}
          name="avatarStyle"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                  value={avatarStyle}
                  onValueChange={(value) => {
                    setAvatarStyle(value);
                    field.onChange(value);
                  }}
                >
                  {AVATAR_STYLES.map((style) => (
                    <motion.div
                      key={style.value}
                      className="relative"
                      whileHover={{ y: -5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <RadioGroupItem
                        value={style.value}
                        id={style.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={style.value}
                        className="flex cursor-pointer flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 dark:peer-data-[state=checked]:border-purple-400 [&:has([data-state=checked])]:border-purple-500 dark:[&:has([data-state=checked])]:border-purple-400 transition-all duration-200"
                      >
                        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-muted bg-background">
                          <img
                            src={
                              getAvatarUrl(style.value, avatarSeed) ||
                              "/placeholder.svg"
                            }
                            alt={style.label}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="mt-3 text-center">
                          <div className="text-sm font-medium">
                            {style.emoji} {style.label}
                          </div>
                        </div>
                        <Check className="absolute right-2 top-2 h-4 w-4 text-purple-500 opacity-0 [&:has([data-state=checked])]:opacity-100 peer-data-[state=checked]:opacity-100" />
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
