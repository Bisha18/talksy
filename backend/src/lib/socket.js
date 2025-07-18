import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
})

const userSocketMap = {};

io.on("connection", socket => {
  console.log("user connected", socket.id);
  
  const userId = socket.handshake.query.userId;
  if(userId) userSocketMap[userId] = socket.id

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected")
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }
  );
})

export { io, app, server };