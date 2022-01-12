import * as express from "express";
import * as http from "http";
import * as socketio from "socket.io";

const app = express.default();

app.get("/", (_req, res) => {
  res.send({ uptime: process.uptime() });
});

const server = http.createServer(app);
const io = new socketio.Server(server);

io.on("connection", (...params) => {
  console.log(params);
});

server.listen(process.env.port || 4004, () => {
  console.log("Running at localhost:4004");
});
