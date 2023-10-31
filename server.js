const app = require("./app");
const { Server } = require("socket.io");
const { createServer } = require("http");

const httpServer = createServer();
const mongoose = require("mongoose");

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const activeRooms = [];
const allMessages = [];

io.on("connection", (socket) => {
  console.log("New frontend connection");

  socket.on("room", (room, name) => {
    const user = {
      room,
      name,
    };
    activeRooms.push(user);
    io.emit("roomJoined", activeRooms);
  });

  socket.on("getRooms", () => {
    io.emit("roomJoined", activeRooms);
  });

  socket.on("message", (objMessage) => {
    allMessages.push(objMessage);
    io.emit("messages", allMessages);
  });

  socket.on("getMessages", () => {
    io.emit("messages", allMessages);
  });

  socket.on("joinRoom", (roomName) => {
    const room = activeRooms.find((room) => room.room === roomName);
    if (room) {
      socket.join(room.room);
    }
  });
});

httpServer.listen(5050, () => {
  console.log("listening on *:5050");
});

const { DB_HOST, PORT } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT);
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
