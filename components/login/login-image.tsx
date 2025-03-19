import Image from "next/image";

interface LoginImageProps {
  imageUrl?: string;
  title?: string;
  description?: string;
}

export function LoginImage({
  imageUrl = "/myst.webp",
  title = "Secure Computer-Based Testing",
  description = "Our platform provides a secure, reliable environment for academic assessments, helping universities maintain integrity while delivering a seamless testing experience.",
}: LoginImageProps) {
  return (
    <div className="hidden lg:block lg:w-1/2 relative">
      {/* Image container takes up full space */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt="Students taking online exams"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Overlay content */}
      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-end p-8">
        <div className="max-w-md text-center text-white mb-8">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
