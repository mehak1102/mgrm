export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email) {
  return getAdminEmails().includes(String(email || "").trim().toLowerCase());
}

export function roleForEmail(email) {
  return isAdminEmail(email) ? "admin" : "user";
}

export async function syncUserRole(user) {
  if (!user) return user;

  const nextRole = roleForEmail(user.email);
  if (user.role !== nextRole) {
    user.role = nextRole;
    await user.save();
  }

  return user;
}
