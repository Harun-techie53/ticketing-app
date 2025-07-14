import { ToastType } from "@/types";

type ToastFn = (message: string, type?: ToastType) => void;

let toastFn: ToastFn | null = null;

export const registerToastHandler = (fn: ToastFn) => {
  toastFn = fn;
};

export const showGlobalToast = (
  message: string,
  type: ToastType = ToastType.Info
) => {
  if (toastFn) toastFn(message, type);
};
