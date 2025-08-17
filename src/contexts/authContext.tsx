"use client";

import { AuthContextType, DecodedUser, JwtPayload } from "@/types/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Spin } from "antd";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = Cookies.get("auth_token");

    if (savedToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(savedToken);

        if (decoded.exp * 1000 > Date.now()) {
          setToken(savedToken);
          setUser({
            userId: decoded.userId,
            email: decoded.email,
          });
        } else {
          Cookies.remove("auth_token");
        }
      } catch {
        Cookies.remove("auth_token");
      }
    }

    setLoading(false);
  }, []);

  const login = (token: string) => {
    const decoded = jwtDecode<JwtPayload>(token);
    setUser({
      userId: decoded.userId,
      email: decoded.email,
    });
    setToken(token);
    Cookies.set("auth_token", token, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("auth_token");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
