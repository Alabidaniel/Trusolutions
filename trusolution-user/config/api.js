const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export const API_BASE_URL = (
  configuredBaseUrl || "http://localhost:4000/api/v1"
).replace(/\/+$/, "");
