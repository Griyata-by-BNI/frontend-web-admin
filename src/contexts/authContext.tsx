"use client";

import { UserLogin } from "@/types/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type AuthContextType = {
  user: UserLogin | null;
  token: string | null;
  login: (token: string, user: UserLogin, remember?: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserLogin | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("auth");

    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.expiry && parsed.expiry > Date.now()) {
        setUser(parsed.user);
        setToken(parsed.token);
      } else {
        localStorage.removeItem("auth");
      }
    }
  }, []);

  const login = (token: string, user: UserLogin) => {
    setUser(user);
    setToken(token);

    const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem("auth", JSON.stringify({ token, user, expiry }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
