// Calls to the admin API (/api/auth/*) with the logged-in admin's token.

const TOKEN_KEY = "pdc_admin_token";
const PROFILE_KEY = "pdc_admin_profile";

export const getAdminToken = () => sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);

// The profile ({ email, role, mustChangePassword, ... }) is kept for the tab's lifetime, so a reload
// shows the right screen at once; /api/auth/me refreshes it.
export const saveAdminSession = (token, admin) => {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  if (admin) sessionStorage.setItem(PROFILE_KEY, JSON.stringify(admin));
};

export const readAdminProfile = () => {
  try {
    return JSON.parse(sessionStorage.getItem(PROFILE_KEY) || "null");
  } catch {
    return null;
  }
};

export const clearAdminSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(PROFILE_KEY);
};

/**
 * @returns {Promise<{ ok: true, data: object } | { ok: false, status: number, code?: string, error: string }>}
 */
export const adminApi = async (path, { method = "GET", body } = {}) => {
  const token = getAdminToken();
  try {
    const res = await fetch(`/api${path}`, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      /* not JSON (e.g. a proxy error page) */
    }
    if (res.ok && data?.success) return { ok: true, data };
    return {
      ok: false,
      status: res.status,
      code: data?.code,
      error: data?.error || (res.status >= 500 ? "The server had a problem. Please try again." : "Something went wrong."),
    };
  } catch {
    return { ok: false, status: 0, error: "Cannot reach the server." };
  }
};
