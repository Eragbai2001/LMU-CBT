import { FlipWords } from "@/app/Flip-word/ui/flip-words";

export default function FlipWordsDemo() {
  const words = [
    "developers",
    "data scientists",
    "software engineers",
    "UI/UX designers",
  ];

  return (
    <div className=" flex justify-center items-center px-4">
      <div className="text-4xl mx-auto font-normal text-white dark:text-neutral-400">
        Meet the team <br />a group of <FlipWords words={words} />
      </div>
    </div>
  );
}
