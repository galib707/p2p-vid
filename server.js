const express = require("express");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

const httpServer = app.listen(process.env.PORT || 8000, () => {
  const port = httpServer.address().port;
  console.log("server is running on port " + port);
});

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected with", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("new-connection", (peerId) => {
    console.log("new connection requested");
    socket.broadcast.emit("new-user", peerId);
  });
});

const { ExpressPeerServer } = require("peer");

const peerServer = ExpressPeerServer(httpServer);

app.use("/peerjs", peerServer);

peerServer.on("connection", (peerClient) => {
  console.log("peer connected", peerClient);
});
