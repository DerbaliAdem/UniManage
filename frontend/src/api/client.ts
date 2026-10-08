import axios, { AxiosError } from "axios";

import type { ApiError } from "../types/api";

export const STORAGE_TOKEN_KEY = "unimanage-token";
export const STORAGE_USER_KEY = "unimanage-user";

export const getStoredToken = () => window.localStorage.getItem(STORAGE_TOKEN_KEY);
export const setStoredToken = (token: string) => window.localStorage.setItem(STORAGE_TOKEN_KEY, token);
export const getStoredUser = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_USER_KEY);
    return stored ? (JSON.parse(stored) as { id: string; email: string; fullName: string; role: string }) : null;
  } catch {
    return null;
  }
};
export const setStoredUser = (user: { id: string; email: string; fullName: string; role: string } | null) => {
  if (!user) {
    window.localStorage.removeItem(STORAGE_USER_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
};
export const clearStoredAuth = () => {
  window.localStorage.removeItem(STORAGE_TOKEN_KEY);
  window.localStorage.removeItem(STORAGE_USER_KEY);
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiError>(error)) {
    const detail = error.response?.data?.detail ?? error.response?.data?.message;
    if (detail) return detail;

    switch (error.response?.status) {
      case 400:
      case 422:
        return "Some of the submitted information is invalid. Please review it and try again.";
      case 401:
        return "Your session has expired. Please sign in again.";
      case 403:
        return "You are not authorized to access this class.";
      case 404:
        return "The requested information could not be found.";
      case 409:
        return "This change conflicts with existing data.";
      default:
        return error.response ? fallback : "Unable to connect to the server. Check your connection and try again.";
    }
  }

  return error instanceof Error && error.message ? error.message : fallback;
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearStoredAuth();
      if (!window.location.pathname.endsWith("/login")) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
