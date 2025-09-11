import { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    
    if (wsRef.current) return;

    const ws = new WebSocket("ws://localhost:3000");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected!");
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };

    ws.onmessage = (event) => {
      //@ts-ignore
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      wsRef.current = null;
    };

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    };
  }, []);

  return (
    <div className="h-screen bg-neutral-900 flex flex-col justify-between p-4">
      <div className="h-[95vh]">
        {messages.map((message, idx) => (
          <div key={idx} className="m-4 p-3">
            <span className="bg-white text-black rounded-xl p-3 ">
              {" "}
              {message}{" "}
            </span>
          </div>
        ))}
      </div>
      <div className="h-[5vh] flex m-2">
        <input
          id="message"
          className="w-full mr-3 px-2 py-1 bg-neutral-300 rounded-md"
          type="text"
          placeholder="Enter your message"
        />
        <button
          className="bg-violet-500 rounded-md px-2 py-1 text-white"
          onClick={() => {
            const messageInput = document.getElementById(
              "message"
            ) as HTMLInputElement;
            const message = messageInput.value.trim();

            if (
              message &&
              wsRef.current &&
              wsRef.current.readyState === WebSocket.OPEN
            ) {
              
              //@ts-ignore
              setMessages((prevMessages) => [...prevMessages, message]);

              
              wsRef.current.send(
                JSON.stringify({
                  type: "chat",
                  payload: {
                    message: message,
                  },
                })
              );

             
              messageInput.value = "";
            } else {
              console.error(
                "WebSocket connection is not established or message is empty."
              );
            }
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
