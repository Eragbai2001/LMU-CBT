"use client";

export async function getUser() {
  try {
    // Use absolute URL with origin to avoid parsing issues
    const baseUrl = window.location.origin;
    const response = await fetch(`${baseUrl}/api/auth/fetchData`, {
      method: "GET",
      credentials: "include", // Ensures cookies are sent
      headers: {
        "Content-Type": "application/json",
      },
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
