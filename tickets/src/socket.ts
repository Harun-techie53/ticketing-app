import { createServer, Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import type { Express } from "express";

let io: SocketIOServer | null = null;
let httpServer: HTTPServer | null = null;

export const initSocket = (app: Express) => {
  if (!httpServer) {
    httpServer = createServer(app);

    io = new SocketIOServer(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
      path: "/socket.io",
    });

    io.on("connection", (socket) => {
      console.log("🔌 Socket connected:", socket.id);

      // socket.on;
    });
  }

  return { io, httpServer };
};

export const getIO = (): SocketIOServer => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

export const getAllConnections = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io.sockets._ids;
};
