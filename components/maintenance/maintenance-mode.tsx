"use client";

import Image from "next/image";
import { ShieldAlert, Construction } from "lucide-react";

interface MaintenanceModeProps {
  message?: string;
  isAdmin?: boolean;
  onOverride?: () => void;
}

export default function MaintenanceMode({
  message = "Our site is currently under maintenance. We'll be back soon!",
  isAdmin = false,
  onOverride,
}: MaintenanceModeProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center border border-blue-100">
        <div className="relative w-64 h-64 mx-auto mb-8">
          <Image
            src="/maintenance.png"
            fill
            alt="Under Maintenance"
            className="object-contain"
            priority
          />
        </div>

        <Construction className="h-12 w-12 mx-auto text-amber-500 mb-4" />

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Under Maintenance
        </h1>

        <p className="text-gray-600 mb-6">{message}</p>

        {isAdmin && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
              <div className="flex items-start">
                <ShieldAlert className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                <p className="text-sm text-amber-800">
                  Youre seeing this because you have admin privileges.
                </p>
              </div>
            </div>

            <button
              onClick={onOverride}
              className="bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Override & Access Site
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-sm text-gray-500">
        If you need immediate assistance, please contact support
      </p>
    </div>
  );
}
