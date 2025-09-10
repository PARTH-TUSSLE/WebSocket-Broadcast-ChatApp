import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

let userCount = 0;

wss.on("connection", ( socket ) => {
  userCount ++ ;
  console.log(`User ${userCount} connected !`);

  
})