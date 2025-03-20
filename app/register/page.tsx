import { RegisterForm } from "@/components/register/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <RegisterForm />
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KzRoxCvcrPumnEaSwx7YdfzrVkJp5y.png')",
            backgroundPosition: "right center",
          }}
        >
          <div className="absolute inset-0 flex items-end justify-center p-12 bg-gradient-to-t from-black/40 to-transparent">
            <p className="text-white text-center max-w-md text-sm md:text-base">
              Our platform provides a secure, reliable environment for academic assessments, helping universities
              maintain integrity while delivering a seamless testing experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

