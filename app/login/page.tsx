import { LoginForm } from "@/components/login/login-form"
import { LoginImage } from "@/components/login/login-image"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <LoginForm />
      </div>

      {/* Right side - Image */}
      <LoginImage
        title="Secure Computer-Based Testing"
        description="Our platform provides a secure, reliable environment for academic assessments, helping universities maintain integrity while delivering a seamless testing experience."
      />
    </div>
  )
}

