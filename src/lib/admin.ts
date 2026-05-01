const ids = (process.env.BUN_PUBLIC_ADMIN_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export const isAdminUserId = (userId?: string | null): boolean =>
    !!userId && ids.includes(userId);