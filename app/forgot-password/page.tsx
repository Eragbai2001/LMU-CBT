"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { LoginImage } from "@/components/login/login-image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setMessage(
        data.message ||
          "If an account with that email exists, we've sent a password reset link."
      );
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-1 text-nowrap">UniTest CBT</h1>
            <h2 className="text-2xl font-semibold mb-2">Forgot Password</h2>
            <p className="text-gray-500 text-center">
              Enter your email address and we will send you a link to reset your
              password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-12 bg-gray-50"
              required
            />

            <Button
              type="submit"
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            {message && (
              <div className="p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
                {message}
              </div>
            )}

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
        </div>
      </div>

      {/* Right side - Image */}
      <LoginImage title="Secure Computer-Based Testing" />
    </div>
  );
}
