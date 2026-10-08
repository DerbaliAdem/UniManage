import apiClient, { clearStoredAuth, getStoredUser, setStoredToken, setStoredUser } from "./client";

import type { AuthUser, LoginResponse } from "../types/api";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", { email, password });
  setStoredToken(data.accessToken);
  setStoredUser(data.user);
  return data;
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data } = await apiClient.get<{ id: string; email: string; role: string; fullName?: string }>("/auth/me");
    const normalized: AuthUser = {
      id: data.id,
      email: data.email,
      fullName: data.fullName ?? data.email,
      role: data.role as AuthUser["role"],
    };
    setStoredUser(normalized);
    return normalized;
  } catch {
    return getStoredUser() as AuthUser | null;
  }
};

export const logout = () => {
  clearStoredAuth();
};
