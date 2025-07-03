import { getToastClass } from "@/helpers/utils/toastClass";
import React from "react";

const Toast = ({ message, type }: { message: string; type: string }) => {
  return (
    <div
      role="alert"
      className={`alert ${getToastClass(type) || "alert-info"} size-fit fixed right-0 z-50 m-4`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
