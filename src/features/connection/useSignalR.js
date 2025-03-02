// import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

let globalConnection = null;

function useSignalR() {
  const [connection, setConnection] = useState(null);
  //   const queryClient = useQueryClient();
  const isConnected = useRef(false);
  const memoizedConnection = useMemo(() => {
    if (globalConnection) return globalConnection;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7257/chat", { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    globalConnection = newConnection;
    return newConnection;
  }, []);

  useEffect(() => {
    if (!isConnected.current) {
      memoizedConnection
        .start()
        .then(() => {
          console.log("SignalR Connected");
          isConnected.current = true;
          setConnection(memoizedConnection);
        })
        .catch((err) => console.error("Connection error:", err));
    } else {
      setConnection(memoizedConnection);
    }

    // setConnection(newConnection);

    // newConnection.onclose().then(() => console.log("Disconnected"));

    return () => {
      if (isConnected.current && memoizedConnection) {
        memoizedConnection.stop();
        isConnected.current = false;
        globalConnection = null;
      }
    };
  }, [memoizedConnection]);

  return connection;
}

export default useSignalR;
