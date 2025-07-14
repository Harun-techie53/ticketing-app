import { useAuth } from "@/contexts/authContext";
import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "@hrrtickets/common";
import { useToast } from "@/contexts/ToastContext";
import { ToastType } from "@/types";
import { showGlobalToast } from "@/helpers/utils/globals";

const AuthWrapper = () => {
  const { token, setIsAuthenticated, setCurrentUser, setToken } = useAuth();

  const decodeToken = async (token: string) => {
    try {
      const res = await fetch("/api/client-auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.valid) {
        throw new Error("Invalid or expired token");
      }

      const { user } = data;
      const { id, role, exp } = user;
      const now = Math.floor(Date.now() / 1000);

      if (now >= exp) {
        showGlobalToast("Login session expired", ToastType.Error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setCurrentUser(null);
        setToken("");
        return;
      }
    } catch (error) {
      console.log("❌ Error decoding token: ", error);
      showGlobalToast("Login session expired", ToastType.Error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setCurrentUser(null);
      setToken("");
    }
  };

  useEffect(() => {
    if (token) {
      decodeToken(token);
    }
  }, [token]);
  return <div></div>;
};

export default AuthWrapper;
