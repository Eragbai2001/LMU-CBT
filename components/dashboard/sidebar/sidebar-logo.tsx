import { GraduationCap, Pin, PinOff } from "lucide-react";
// Import motion from framer-motion
import { useSidebar } from "./sidebar";
import { motion } from "framer-motion";

export const SidebarLogo = () => {
  const { open, pinned, setPinned } = useSidebar();

  return (
    <div className="flex items-center space-x-3 mb-10">
      <div className="bg-primary/10 p-2 rounded-full">
        <GraduationCap className="h-6 w-6 text-primary" />
      </div>

      {open && (
        <span className="font-bold text-lg  text-nowrap">UniTest CBT</span>
      )}
      {/* Pin button with ml-auto to push it to the right */}
      {open && (
        <button
          onClick={() => setPinned(!pinned)}
          className="ml-3 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
          title={pinned ? "Unpin sidebar" : "Pin sidebar"}>
          {pinned ? (
            <Pin size={16} className="rotate-45" />
          ) : (
            <PinOff size={16} className="rotate-45" />
          )}
        </button>
      )}
    </div>
  );
};
