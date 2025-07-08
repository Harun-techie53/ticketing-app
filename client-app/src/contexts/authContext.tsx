"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "@/types";
import AuthWrapper from "@/components/wrappers/authWrapper";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  token: string;
  setToken: (token: string) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const localAuthToken =
    (typeof window !== "undefined" && localStorage?.getItem("token")) || "";
  const localCurrentUser =
    (typeof window !== "undefined" && localStorage?.getItem("user")) || "";

  useEffect(() => {
    if (localAuthToken !== "" && localCurrentUser !== "") {
      setIsAuthenticated(true);
      setToken(localAuthToken);
      setCurrentUser(JSON.parse(localCurrentUser));
    }
  }, [localAuthToken, localCurrentUser]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        token,
        setToken,
        currentUser,
        setCurrentUser,
      }}
    >
      <AuthWrapper />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
