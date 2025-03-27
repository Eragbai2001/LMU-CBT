import { GraduationCap } from "lucide-react";
// Import motion from framer-motion
import { useSidebar } from "./sidebar";

export const SidebarLogo = () => {
  const { open } = useSidebar();

  return (
    <div className="flex items-center space-x-3 mb-10">
      <div className="bg-primary/10 p-2 rounded-full">
        <GraduationCap className="h-6 w-6 text-primary" />
      </div>
      {open && <span className="font-bold text-lg">UniTest CBT</span>}
    </div>
  );
};
