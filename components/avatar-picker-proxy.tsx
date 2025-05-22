"use client";

import { useState, useEffect } from "react";
import { Check, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AVATAR_STYLES = [
  { value: "adventurer", label: "Adventurer" },
  { value: "adventurer-neutral", label: "Adventurer Neutral" },
  { value: "avataaars", label: "Avataaars" },
  { value: "big-ears", label: "Big Ears" },
  { value: "big-smile", label: "Big Smile" },
  { value: "bottts", label: "Bottts" },
  { value: "croodles", label: "Croodles" },
  { value: "fun-emoji", label: "Fun Emoji" },
  { value: "pixel-art", label: "Pixel Art" },
];

export function AvatarPickerProxy({
  form,
  defaultStyle = "adventurer",
  defaultSeed = "user",
}: {
  form: any;
  defaultStyle?: string;
  defaultSeed?: string;
}) {
  const [avatarStyle, setAvatarStyle] = useState(defaultStyle);
  const [avatarSeed, setAvatarSeed] = useState(defaultSeed);
  const [randomSeed, setRandomSeed] = useState("");

  useEffect(() => {
    generateRandomSeed();
  }, []);

  const generateRandomSeed = () => {
    const seed = Math.random().toString(36).substring(2, 10);
    setRandomSeed(seed);
  };

  // Use our proxy API route instead of direct DiceBear URL
  const getAvatarUrl = (style: string, seed: string) => {
    return `/api/avatar/${style}/${seed}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-muted bg-muted">
          <img
            src={getAvatarUrl(avatarStyle, avatarSeed) || "/placeholder.svg"}
            alt="Avatar preview"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Your Avatar</h3>
          <p className="text-sm text-muted-foreground">
            Choose an avatar style and customize it with a unique seed.
          </p>
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="avatarSeed"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="flex w-full items-center space-x-2">
                      <Input
                        placeholder="Enter seed"
                        value={avatarSeed}
                        onChange={(e) => {
                          setAvatarSeed(e.target.value);
                          field.onChange(e.target.value);
                        }}
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
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base">Avatar Style</Label>
        <FormField
          control={form.control}
          name="avatarStyle"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3"
                  value={avatarStyle}
                  onValueChange={(value) => {
                    setAvatarStyle(value);
                    field.onChange(value);
                  }}
                >
                  {AVATAR_STYLES.map((style) => (
                    <div key={style.value} className="relative">
                      <RadioGroupItem
                        value={style.value}
                        id={style.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={style.value}
                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-muted">
                          <img
                            src={
                              getAvatarUrl(style.value, avatarSeed) ||
                              "/placeholder.svg"
                            }
                            alt={style.label}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="mt-2 text-center text-sm font-medium">
                          {style.label}
                        </div>
                        <Check className="absolute right-2 top-2 h-4 w-4 text-primary opacity-0 [&:has([data-state=checked])]:opacity-100 peer-data-[state=checked]:opacity-100" />
                      </Label>
                    </div>
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
