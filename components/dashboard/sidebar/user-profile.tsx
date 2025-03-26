import { auth } from "@/auth";

 // Importing auth to fetch session

export default async function UserProfile() {
  const session = await auth(); // Fetch authenticated user session

  if (!session?.user) return null;

  return (
    <div className="flex items-center space-x-3">
      <div>
        <p className="font-semibold">{session.user.name}</p>
        <p className="text-sm text-gray-500">{session.user.email}</p>{" "}
        {/* Display user's email */}
      </div>
    </div>
  );
}
