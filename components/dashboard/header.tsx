"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/getUser";

// Define user type
interface User {
  name?: string;
  email?: string;
  [key: string]: unknown; // Allow other properties
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, []);

  // Display Welcome even during loading
  return (
    <div>
      <h1>Welcome{user ? `, ${user.name || user.email || ''}` : ''}!</h1>
      {loading && <p>Loading user details...</p>}
    </div>
  );
}