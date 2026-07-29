"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api, setAccessToken } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // On mount, perform a silent refresh to check if we have a valid session
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try refreshing the access token using HttpOnly cookie
        const res = await api.post("/auth/refresh");
        const { accessToken: newToken, user: userData } = res.data.data;
        
        setAccessToken(newToken);
        setUser(userData);
      } catch (err) {
        // No valid refresh token, user is unauthenticated
        setAccessToken(null);
        setUser(null);
        
        // Only redirect to login if we are trying to access a protected area (like /dashboard)
        if (!pathname.startsWith("/login") && !pathname.startsWith("/signup") && pathname !== "/") {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [pathname, router]);

  const login = async (email: string, pass: string) => {
    const res = await api.post("/auth/login", { email, password: pass });
    const { accessToken: newToken, user: userData } = res.data.data;

    setAccessToken(newToken);
    setUser(userData);
    router.push("/dashboard");
  };

  const signup = async (name: string, email: string, pass: string) => {
    const res = await api.post("/auth/signup", { name, email, password: pass });
    const { accessToken: newToken, user: userData } = res.data.data;

    setAccessToken(newToken);
    setUser(userData);
    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setAccessToken(null);
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

