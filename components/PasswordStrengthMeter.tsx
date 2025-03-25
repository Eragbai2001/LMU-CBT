"use client";

const getPasswordStrength = (password: string) => {
  const strengthCriteria = [
    password.length >= 8, // Minimum length
    /[A-Z]/.test(password), // Uppercase letter
    /[a-z]/.test(password), // Lowercase letter
    /\d/.test(password), // Number
    /[\W_]/.test(password), // Special character
  ];

  const passedCriteria = strengthCriteria.filter(Boolean).length;

  if (passedCriteria === 0)
    return {
      level: "Very Weak",
      color: "bg-red-500",
      message: "Must be 8 or more chars",
    };
  if (passedCriteria === 1)
    return {
      level: "Weak",
      color: "bg-orange-500",
      message: "Add numbers & uppercase letters",
    };
  if (passedCriteria === 2)
    return {
      level: "Moderate",
      color: "bg-yellow-500",
      message: "Try adding special characters",
    };
  if (passedCriteria === 3)
    return {
      level: "Strong",
      color: "bg-green-500",
      message: "Almost there! Add one more special char",
    };
  return {
    level: "Very Strong",
    color: "bg-green-700",
    message: "Awesome, secure password!",
  };
};

export default function PasswordStrengthMeter({
  password,
}: {
  password: string;
}) {
  const { level, color, message } = getPasswordStrength(password);

  return (
    <div className={`w-full p-2 text-white text-center rounded-md ${color}`}>
      {level} ({message})
    </div>
  );
}
