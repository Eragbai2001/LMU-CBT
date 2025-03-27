"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import Oauth from "@/components/login/oauth";
import { handleLogin } from "@/app/api/auth/login/LoginHandler";


export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await handleLogin(new FormData(e.currentTarget));

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Login successful! Redirecting...");
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="font-bold text-lg">UniTest CBT</span>
            {/* Rest of your sidebar content */}
          </div>
        </div>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Oauth />
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            id="email"
            name="email"
            placeholder="Email or Student ID"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            name="password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            className="w-full cursor-pointer"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
