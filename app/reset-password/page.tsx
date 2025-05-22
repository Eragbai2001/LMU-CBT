"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { LoginImage } from "@/components/login/login-image";
import { resetPasswordSchema } from "@/lib/zod";
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or expired reset link.");
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validation = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!validation.success) {
      setMessage(validation.error.errors[0]?.message || "Invalid input");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setIsSuccess(true);
        // Delay for user to read the success message
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Reset Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-1 text-nowrap">UniTest CBT</h1>
            <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
            <p className="text-gray-500 text-center">
              {!token
                ? "This reset link is invalid or has expired."
                : "Create a new password for your account"}
            </p>
          </div>

          {!token ? (
            <div className="space-y-4">
              <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm">
                Invalid or expired reset link.
              </div>
              <div className="flex justify-center">
                <Link
                  href="/forgot-password"
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Request a new reset link
                </Link>
              </div>
            </div>
          ) : isSuccess ? (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 text-green-800 rounded-md text-sm">
                {message || "Your password has been reset successfully."}
              </div>
              <div className="flex justify-center">
                <a
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default link behavior
                    window.location.href = "/login"; // Trigger full page reload
                  }}
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="h-12 bg-gray-50"
                  required
                  minLength={8}
                />

                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="h-12 bg-gray-50"
                  required
                />
              </div>

              {password && <PasswordStrengthMeter password={password} />}

              {message && !isSuccess && (
                <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm">
                  {message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>

              <div className="flex justify-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right side - Image */}
      <LoginImage title="Secure Computer-Based Testing" />
    </div>
  );
}
