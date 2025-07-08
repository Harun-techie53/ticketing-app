import { ToastType } from "@/types";

export const getToastClass = (type: string) => {
  switch (type) {
    case ToastType.Success:
      return "alert-success";
    case ToastType.Error:
      return "alert-error";
    case ToastType.Info:
      return "alert-info";
    default:
      return "alert-info";
  }
};
