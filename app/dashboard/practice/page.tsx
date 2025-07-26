"use client";

import PracticeTests from "@/components/dashboard/practice/practice";
import { Search } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [checkingUserProfile, setCheckingUserProfile] = useState(true);
  const [needsProfileUpdate, setNeedsProfileUpdate] = useState(false);
  useEffect(() => {
    const checkUserAcademicInfo = async () => {
      try {
        const res = await fetch("/api/user");
        const user = await res.json();

        // Check if department and level are set
        if (!user.departmentId || !user.levelId) {
          setNeedsProfileUpdate(true);
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      } finally {
        setCheckingUserProfile(false);
      }
    };

    checkUserAcademicInfo();
  }, []);

  return (
    <div className="min-h-screen w-full ">
      <div className="w-full ">
        {needsProfileUpdate && (
          <div className="mx-6 md:mx-10 mt-4 mb-6 p-4 dark:bg-gray-800/50 border border-gray-700 rounded-lg shadow-sm bg-gray-800/50 ">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-amber-400 h-6 w-6 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-gray-100 font-semibold text-lg">
                  Department and Level Not Set
                </h3>
                <p className="text-gray-200 mt-1">
                  You're currently seeing general practice tests. To access
                  content specific to your academic program:
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => router.push("/dashboard/profile")}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                    Update Your Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 mt-6 px-10">
          <h1 className="text-2xl font-bold ">Available Practice Tests</h1>
        </div>

        <PracticeTests />
      </div>
    </div>
  );
};

export default Page;
