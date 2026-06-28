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
import { useAuth } from "./AuthProvider";

const signalRContext = createContext(null);

function SignalRProvider({ children }) {
  const [connection, setConnection] = useState(null);
  const { token } = useAuth();
  const isConnected = useRef(false);

  const memoizedConnection = useMemo(() => {
    if (connection) return connection;
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7257/chat", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    return newConnection;
  }, [connection, token]);

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
