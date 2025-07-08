"use client";

import socket from "@/helpers/socket";
import React, { useEffect } from "react";

const SocketWrapper = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket successfully connected ", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected ", socket.id);
    });
  }, []);
  return <div></div>;
};

export default SocketWrapper;
