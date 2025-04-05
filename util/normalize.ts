interface User {
  given_name?: string;
  family_name?: string;
  name?: string;
  email?: string;
  id?: string;
  user_metadata?: {
    username?: string;
  };
  displayName?: string;
  userData?: User | User;
}

export function normalizeUserData(user: User) {

     // Ensure user.name is treated as a string or undefined
  const userName = user.name ?? undefined;
  // For OAuth users - use their first name or combine first+last if needed
  if (user.given_name || user.family_name) {
    user.displayName = user.given_name || user.name?.split(" ")[0] || "";
  }
  // For email/password users - use the username they provided
  else if (user.user_metadata?.username) {
    user.displayName = user.user_metadata.username;
  }
  // Fallback to email or id
  else {
    user.displayName =
      user.email?.split("@")[0] || user.id?.substring(0, 8) || "User";
  }

  return user;
}
