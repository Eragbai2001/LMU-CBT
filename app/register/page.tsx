import { LoginImage } from "@/components/login/login-image";
import { RegisterForm } from "@/components/register/register-form";
import { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Toast notifications */}
      <Toaster position="top-center" />

      {/* Left side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <RegisterForm />
      </div>

      {/* Right side - Image */}
      <LoginImage title="Secure Computer-Based Testing" />
    </div>
  );
}
