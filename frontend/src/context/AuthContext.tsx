import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProfile, login, logout, register, updateProfile } from "@/api/auth";
import { tokenStorage } from "@/lib/storage";
import type { User } from "@/types";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (payload: {
    name: string;
    email: string;
    password: string;
    phone_number: string;
  }) => Promise<void>;
  logoutUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
  saveProfile: (payload: { name: string; phone_number: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch {
      tokenStorage.clear();
      setUser(null);
    }
  };

  useEffect(() => {
    const run = async () => {
      if (!tokenStorage.getAccess()) {
        setLoading(false);
        return;
      }
      await refreshUser();
      setLoading(false);
    };
    void run();
  }, []);

  const loginUser = async (email: string, password: string) => {
    const tokens = await login({ email, password });
    tokenStorage.setTokens(tokens.access, tokens.refresh);
    await refreshUser();
  };

  const registerUser = async (payload: {
    name: string;
    email: string;
    password: string;
    phone_number: string;
  }) => {
    await register(payload);
    await loginUser(payload.email, payload.password);
  };

  const logoutUser = async () => {
    const refresh = tokenStorage.getRefresh();
    if (refresh) {
      try {
        await logout(refresh);
      } catch {
        // Best effort logout.
      }
    }
    tokenStorage.clear();
    setUser(null);
  };

  const saveProfile = async (payload: { name: string; phone_number: string }) => {
    const updated = await updateProfile(payload);
    setUser(updated);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      loginUser,
      registerUser,
      logoutUser,
      refreshUser,
      saveProfile,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}