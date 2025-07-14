"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ToastType } from "@/types";
import { registerToastHandler } from "@/helpers/utils/globals";

type ToastContextType = {
  showToast: boolean;
  toastMessage: string;
  toastType: ToastType;
  setShowToast: (show: boolean) => void;
  setToastMessage: (message: string) => void;
  setToastType: (type: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>(ToastType.Info);

  useEffect(() => {
    registerToastHandler((msg, type) => {
      setShowToast(true);
      setToastMessage(msg);
      setToastType(type || ToastType.Info);
    });
  }, []);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        toastMessage,
        toastType,
        setShowToast,
        setToastMessage,
        setToastType,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
