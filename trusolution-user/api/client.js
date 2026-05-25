import { API_BASE_URL } from "../config/api";
import { auth } from "../config/firebase";

export class ApiError extends Error {
  constructor(message, statusCode, payload) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.payload = payload;
  }
}

async function getFirebaseIdToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    query,
    authRequired = true,
    headers: extraHeaders,
  } = options;

  const url = new URL(`${API_BASE_URL}${path}`);
  if (query && typeof query === "object") {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }

  const headers = {
    Accept: "application/json",
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(extraHeaders || {}),
  };

  if (authRequired) {
    const token = await getFirebaseIdToken();
    if (!token) {
      throw new ApiError("Not authenticated", 401, null);
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch (_) {
    payload = null;
  }

  if (!res.ok) {
    throw new ApiError(
      payload?.message || `Request failed (${res.status})`,
      res.status,
      payload,
    );
  }

  // Backend response format: { success, message, data }.
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }

  return payload;
}

