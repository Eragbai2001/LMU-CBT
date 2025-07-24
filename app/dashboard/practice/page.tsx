"use client";

import PracticeTests from "@/components/dashboard/practice/practice";
import { Search } from "lucide-react";

const Page = () => {
  return (
    <div className="min-h-screen w-full ">
      <div className="w-full ">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 mt-10 px-10">
          <h1 className="text-2xl font-bold ">
            Available Practice Tests
          </h1>

      
        </div>

        <PracticeTests />
      </div>
    </div>
  );
};

export default Page;
