export async function getUser(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/fetchData", {
      method: "GET",
      credentials: "include", // Ensures cookies are sent
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch user: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();

    // Store JWT if received
    if (data.jwt && typeof window !== "undefined") {
      localStorage.setItem("supabase_jwt", data.jwt);
    }

    return data.user || null;
  } catch (error) {
    console.error("Fetch user error:", error);
    return null;
  }
}

// Add this interface if it's not already defined
interface User {
  name?: string;
  email?: string;
  [key: string]: unknown;
  role?: string;
}
