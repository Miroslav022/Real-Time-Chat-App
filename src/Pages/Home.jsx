import { useEffect, useState } from "react";
import Chat from "../Ui/Chat";
import LeftSideBar from "../Ui/LeftSideBar";
import MessagesList from "../Ui/MessagesList";
import { useQueryClient } from "@tanstack/react-query";
import { useSignalRContext } from "../context/SignalRContext";
import { Outlet, useLocation } from "react-router-dom";
import { useOnlineUsers } from "../context/OnlineUsersContext";
import { MessageMenuProvider } from "../context/MessageMenuContext";
import { useAuth } from "../context/AuthProvider";

function Home() {
  const [ActiveChat, SetActiveChat] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const queryClient = useQueryClient();
  // const [onlineUsers, setOnlineUsers] = useState([]);
  const location = useLocation();
  const newConnection = useSignalRContext();
  const { state, dispatch } = useOnlineUsers();

  const urlPath = location.pathname;
  const isHome = urlPath === "/home";
  const { user } = useAuth();

  useEffect(() => {
    async function connection() {
      if (newConnection.state === "Disconnected") return;

      newConnection.on("ReceiveMessage", (message) => {
        console.log(message);
      });

      newConnection.on("UserStatusChanged", (online_users) => {
        dispatch({ type: "SET_INITIAL_STATE", payload: online_users });
      });

      newConnection.on("newOnlineUser", (newOnlineUser) => {
        console.log(">>>", newOnlineUser);
        dispatch({ type: "ADD_NEW_USER", payload: newOnlineUser });
      });

      newConnection.on("JoinedRoom", (roomId) => {
        setRoomId(roomId);
      });

      newConnection.on("UserWentOffline", (offlineUser) => {
        dispatch({ type: "USER_WENT_OFLINE", payload: offlineUser });
      });

      newConnection.on("GroupChatCreated", (data) => {
        console.log("New group Chat created>>>", data);
        queryClient.invalidateQueries({ queryKey: ["Conversations"] });
      });

      if (ActiveChat) {
        const coversationId = ActiveChat.id;
        await newConnection.invoke("JoinPrivateChat", coversationId);
      }
    }
    try {
      connection();
    } catch (error) {
      console.log(error);
    }
    return () => {
      if (newConnection) {
        newConnection.off("ReceiveMessage");
        newConnection.off("JoinedRoom");
        newConnection.off("UserStatusChanged");
        newConnection.off("newOnlineUser");
        newConnection.off("GroupChatCreated");
      }
    };
  }, [ActiveChat, user?.sub, state, newConnection, dispatch, queryClient]);
  if (newConnection == null) return;

  return (
    <div
      className="h-screen grid gap-0 bg-gray-900 text-white"
      style={{ gridTemplateColumns: "6rem 22rem 5fr auto" }}
    >
      <LeftSideBar />
      <MessagesList setActiveChat={SetActiveChat} onlineUsers={state} />
      {ActiveChat && roomId && isHome ? (
        <MessageMenuProvider>
          <Chat
            conversation={ActiveChat}
            roomId={roomId}
            isBlocked={false}
            isOnline={state.some(
              (user) => user.displayName === ActiveChat.displayName
            )}
          />
        </MessageMenuProvider>
      ) : (
        <Outlet />
      )}
      <div className="bg-gray-850 p-4 sm:hidden"></div>
    </div>
  );
}

export default Home;
