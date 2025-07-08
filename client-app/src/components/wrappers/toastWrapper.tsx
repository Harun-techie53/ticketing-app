"use client";

import { useEffect } from "react";
import Toast from "../toasts";
import { useToast } from "@/contexts/ToastContext";

const ToastWrapper = () => {
  const { showToast, toastMessage, toastType, setShowToast } = useToast();

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showToast, setShowToast]);

  if (!showToast) return null;

  return <Toast message={toastMessage} type={toastType} />;
};

export default ToastWrapper;
