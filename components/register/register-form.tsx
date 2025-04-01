"use client";

import { useState } from "react";

import Link from "next/link";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap } from "lucide-react";
import Oauth from "@/components/login/oauth";
import { signupSchema } from "@/lib/zod";
import PasswordStrengthMeter from "../PasswordStrengthMeter";

export function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate input before sending request
    const validation = signupSchema.safeParse({ username, email, password });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, email, password }),
      });

      if (res.ok) {
        toast.success("Signup successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/login"; // ✅ Full reload
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Signup failed. Try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-1">UniTest CBT</h1>
        <h2 className="text-2xl font-semibold mb-2">Create an account</h2>
        <p className="text-gray-500 text-center">
          Sign up to start your assessment journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Oauth />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        <Input
          id="username"
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="h-12 bg-gray-50"
          required
        />

        <Input
          id="email"
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 bg-gray-50"
          required
        />

        <Input
          id="password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 bg-gray-50"
          required
        />
        {password && <PasswordStrengthMeter password={password} />}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="  font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
