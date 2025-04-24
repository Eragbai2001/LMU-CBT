"use client";

import PracticeTests from "@/components/dashboard/practice/practice";
import { Search } from "lucide-react";

const Page = () => {
  return (
    <div className="min-h-screen w-full ">
      <div className="w-full ">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Available Practice Tests
          </h1>

          <div className="mt-4 md:mt-0 relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 bg-white rounded-md text-sm focus:outline-none border border-gray-200"
            />
          </div>
        </div>

        <PracticeTests />
      </div>
    </div>
  );
};

export default Page;
