import { useAuth } from "@/contexts/authContext";
import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "@hrrtickets/common";
import { useToast } from "@/contexts/ToastContext";
import { ToastType } from "@/types";

const AuthWrapper = () => {
  const { token, setIsAuthenticated, setCurrentUser, setToken } = useAuth();
  const { setShowToast, setToastMessage, setToastType } = useToast();

  const decodeToken = async (token: string) => {
    try {
      const decoded = jwt.verify(
        token,
        process.env.NEXT_PUBLIC_JWT_KEY!
      ) as CustomJwtPayload;

      const { id, role, exp: issuedAt } = decoded;
      const exp = (issuedAt + 3600) * 1000;

      const now = Date.now();

      if (now >= exp) {
        setShowToast(true);
        setToastMessage("Login session expired");
        setToastType(ToastType.Error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setCurrentUser(null);
        setToken("");
        return;
      }

      const user = { id, role, exp };
    } catch (error) {
      console.log("❌ Error decoding token: ", error);
      setShowToast(true);
      setToastMessage("Login session expired");
      setToastType(ToastType.Error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setCurrentUser(null);
      setToken("");
    }
  };

  useEffect(() => {
    if (token !== "") {
      decodeToken(token);
    }
  }, [token]);
  return <div></div>;
};

export default AuthWrapper;
