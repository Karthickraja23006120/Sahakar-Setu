// lib/apiClient.js - browser-side fetch wrapper
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ss_token");
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("ss_user");
  return raw ? JSON.parse(raw) : null;
}

export function setSession(token, user) {
  localStorage.setItem("ss_token", token);
  localStorage.setItem("ss_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("ss_token");
  localStorage.removeItem("ss_user");
}

export async function apiFetch(url, options = {}) {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}
