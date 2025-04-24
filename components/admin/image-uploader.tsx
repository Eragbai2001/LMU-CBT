"use client";

import React, { useState, useRef } from "react";
import { Upload, X, ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploaderProps {
  image?: string;
  onImageChange: (imageUrl?: string) => void;
  error?: string;
}

export default function ImageUploader({
  image,
  onImageChange,
  error,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      onImageChange(undefined);
      alert(
        "Invalid file type. Please upload a JPEG, PNG, GIF, or WEBP image."
      );
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onImageChange(undefined);
      alert("File size exceeds 5MB. Please upload a smaller image.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/auth/uploadImage", {
        method: "POST",
        body: formData, // Send FormData directly
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      onImageChange(data.url); // Update the image URL with the uploaded image's URL
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(100); // Set progress to 100% after completion
    }
  };

  const removeImage = () => {
    onImageChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Question Image (Optional)
      </label>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Image preview or upload button */}
      {image ? (
        <div className="relative border border-gray-300 rounded-lg overflow-hidden">
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            {/* Image preview */}
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt="Question image preview"
                width={400}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
            isUploading
              ? "bg-blue-50 border-blue-300"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50",
            error ? "border-red-300 bg-red-50" : ""
          )}
        >
          {isUploading ? (
            <div className="w-full">
              <div className="flex items-center justify-center mb-2">
                <Upload className="h-5 w-5 text-blue-500 animate-pulse" />
              </div>
              <p className="text-sm text-center text-blue-600 mb-2">
                Uploading image...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 text-center">
                Click to upload an image
                <span className="block text-xs mt-1">
                  JPEG, PNG, GIF or WEBP (max. 5MB)
                </span>
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" /> {error}
        </p>
      )}
    </div>
  );
}
