import { createContext, useContext, useState, type ReactNode } from "react";
import { api } from "@/lib/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  mood: string;
  moodChangedAt: string[];
  preferredEmailTime: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
  updateMood: (mood: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("auth_user");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    return { ...parsed, moodChangedAt: parsed.moodChangedAt ?? [] } as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser);

  const login = (u: AuthUser) => {
    const normalized: AuthUser = { ...u, moodChangedAt: u.moodChangedAt ?? [] };
    localStorage.setItem("auth_user", JSON.stringify(normalized));
    setUser(normalized);
  };

  const logout = async () => {
    await api.post("/api/v1/auth/logout", {}).catch(() => {});
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  const updateMood = async (mood: string): Promise<void> => {
    const result = await api.patch<{ user: AuthUser; changesRemainingToday: number }>(
      "/api/v1/users/me/mood",
      { mood },
    );
    if (!result.ok) throw new Error(result.message);
    const updated: AuthUser = {
      ...user!,
      mood: result.data.user.mood,
      moodChangedAt: result.data.user.moodChangedAt ?? [],
    };
    localStorage.setItem("auth_user", JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: user !== null, user, login, logout, updateMood }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
