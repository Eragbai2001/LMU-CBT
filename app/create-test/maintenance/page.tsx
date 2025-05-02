"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, ShieldAlert, Construction, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";

export default function MaintenanceControlPage() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    async function loadMaintenanceStatus() {
      try {
        // Check session loading
        if (status === "loading") return;
        
        // Redirect non-admin users
        if (status === "unauthenticated" || !isAdmin) {
          router.push("/login");
          return;
        }

        // Fetch maintenance status from API
        const response = await fetch("/api/maintenance", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load maintenance status");
        }

        const data = await response.json();
        setIsMaintenanceMode(data.isMaintenanceMode);
        setMessage(data.message);
        setError("");
      } catch (err) {
        console.error("Error loading maintenance status:", err);
        setError("Failed to load maintenance settings");
      } finally {
        setLoading(false);
      }
    }

    loadMaintenanceStatus();
  }, [status, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setSaveSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isMaintenanceMode,
          message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update maintenance settings");
      }

      setSaveSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error updating maintenance mode:", err);
      setError(err.message || "Failed to update maintenance settings");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || !isAdmin) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="flex items-center mb-6">
        <Shield className="h-6 w-6 text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold">Maintenance Mode Control</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start mb-6">
          <ShieldAlert className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
          <div className="text-sm text-gray-700">
            <p className="font-medium">Admin Controls</p>
            <p>
              Enabling maintenance mode will prevent regular users from accessing the application. Only administrators
              will be able to access the site.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isMaintenanceMode}
                  onChange={() => setIsMaintenanceMode(!isMaintenanceMode)}
                />
                <div
                  className={`block w-14 h-8 rounded-full transition-colors ${
                    isMaintenanceMode ? "bg-blue-600" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                    isMaintenanceMode ? "transform translate-x-6" : ""
                  }`}
                ></div>
              </div>
              <span className="ml-3 font-medium">
                {isMaintenanceMode ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled"}
              </span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Message</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter the message to show to users during maintenance"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={updating}
              className={`px-4 py-2 rounded-md font-medium text-white flex items-center ${
                updating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Construction className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>

            {saveSuccess && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Settings saved!</span>
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h2 className="text-md font-semibold text-blue-800 mb-2">Preview</h2>
        <div className="border border-gray-200 rounded-md bg-white p-4">
          <div className="flex items-center mb-2">
            <Construction className="h-5 w-5 text-amber-500 mr-2" />
            <h3 className="font-medium">Under Maintenance</h3>
          </div>
          <p className="text-sm text-gray-600">
            {message || "Our site is currently under maintenance. We'll be back soon!"}
          </p>
        </div>
      </div>
    </div>
  );
}