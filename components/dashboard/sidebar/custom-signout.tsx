'use client';

import { LogOut } from 'lucide-react';
import { handleSignOut } from '@/app/api/auth/[...nextauth]/route';
import { SidebarLink } from './sidebar';
import { useRouter } from 'nextjs-toploader/app';  // ← important fix
import { useState } from 'react';

export default function CustomSignOut() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const result = await handleSignOut();
      if (result?.success) {
        router.push("/login");
      } else {
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
      router.push("/login");
    }
  };

  return (
    <SidebarLink
      link={{
        label: isLoggingOut ? "Logging out..." : "LOG OUT",
        href: "",
        icon: (
          <LogOut size={20} className={`text-[#3949AB] `} />
        ),
      }}
      onClick={handleLogout}
    />
  );
}
