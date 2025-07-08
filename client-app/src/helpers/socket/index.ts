import { io } from "socket.io-client";

const socket = io("https://ticketing.dev", {
  path: "/socket.io",
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
