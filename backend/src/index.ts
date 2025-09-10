import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

let userCount = 0;
let allSockets = [];

wss.on("connection", ( socket ) => {
  userCount ++ ;
  allSockets.push(socket);
  console.log(`User ${userCount} connected !`);

  socket.on("message", (message) => {
    console.log(`Message recieved: ${message.toString()}`);
    for (let i = 0; i < allSockets.length; i++) {
      const s = allSockets[i];
      setTimeout(() => {
        s!.send(`${message.toString()} from server`);
      }, 1000);
    }
  })
})