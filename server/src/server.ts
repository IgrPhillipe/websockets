import express from "express";
import http from 'http';
import { Server } from "socket.io";

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*"
  },
});

httpServer.listen(3001, () => {
  console.log(`🚀 Server is running on port 3001`);

  io.on("connection", (socket) => {
    socket.emit("connected", "You are connected to the server.");
  });
});