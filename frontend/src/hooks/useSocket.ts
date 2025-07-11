import { useEffect, useState } from "react";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_BACKEND_URL);
    ws.onopen = () => {
      console.log("connected");
      setSocket(ws);
    };
    ws.onclose = () => {
      console.log("disconnected");
      setSocket(null);
    };
    return () => {
      ws.close();
    };
  }, []);
  return socket;
};
