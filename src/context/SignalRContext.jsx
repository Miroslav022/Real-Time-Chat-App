import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import * as signalR from "@microsoft/signalr";

const signalRContext = createContext(null);

function SignalRProvider({ children }) {
  const [connection, setConnection] = useState(null);
  const isConnected = useRef(false);

  const memoizedConnection = useMemo(() => {
    if (connection) return connection;
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7257/chat", { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    return newConnection;
  }, [connection]);

  useEffect(() => {
    if (!isConnected.current) {
      memoizedConnection
        .start()
        .then(() => {
          console.log("SignalR Connected");
          isConnected.current = true;
          setConnection(memoizedConnection);
        })
        .catch((err) => console.log("SignalR Connection", err));
    }

    // return () => {
    //   memoizedConnection.stop();
    //   console.log("SignalR Disconnected");
    //   isConnected.current = false;
    // };
  }, [memoizedConnection]);

  return (
    <signalRContext.Provider value={memoizedConnection}>
      {children}
    </signalRContext.Provider>
  );
}

function useSignalRContext() {
  const context = useContext(signalRContext);
  if (context === undefined)
    throw new Error("useSignalRContext must be used within a SignalRProvider");

  return context;
}

SignalRProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export { SignalRProvider, useSignalRContext };
