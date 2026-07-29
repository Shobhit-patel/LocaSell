import { io } from "socket.io-client";

export const socket = io("https://locasell.onrender.com",
  {
    withCredentials: true,
    autoConnect: false,
  }
);
