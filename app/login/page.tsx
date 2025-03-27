import { LoginForm } from "@/components/login/login-form";
import { LoginImage } from "@/components/login/login-image";
import { Toaster } from "react-hot-toast";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Toast notifications */}
      <Toaster position="top-center" />
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <LoginForm />
      </div>

      {/* Right side - Image */}
      <LoginImage title="Secure Computer-Based Testing" />
    </div>
  );
}
