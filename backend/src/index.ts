import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 3000 });

interface User  {
  socket: WebSocket,
  room: string
}


let allSockets: User[] = [];  // MAPS and RECORDS

wss.on("connection", ( socket ) => {
  
  

  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message as unknown as string);
    if (parsedMessage.type === "join" ) {
      allSockets.push({
        socket,
        room: parsedMessage.payload.roomId
      })
    }  
    if (parsedMessage.type === "chat") {
      const foundUser = allSockets.find((x) => x.socket === socket);
      const currUserRoom = foundUser ? foundUser.room : undefined;

      for (let i = 0; i < allSockets.length; i++) {
          //@ts-ignore
          if (currUserRoom === allSockets[i].room && allSockets[i].socket !== socket) {
            //@ts-ignore
            allSockets[i].socket.send(parsedMessage.payload.message);
          }
      }

    }
  });
  
})

//replace, ts-ignore