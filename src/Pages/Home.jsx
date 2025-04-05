import { useEffect, useState } from "react";
import Chat from "../Ui/Chat";
import LeftSideBar from "../Ui/LeftSideBar";
import MessagesList from "../Ui/MessagesList";
import { useQuery } from "@tanstack/react-query";
import { useSignalRContext } from "../context/SignalRContext";
import { Outlet, useLocation } from "react-router-dom";

function Home() {
  const [ActiveChat, SetActiveChat] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const location = useLocation();
  const newConnection = useSignalRContext();

  const urlPath = location.pathname;
  const isHome = urlPath === "/home";

  const { data } = useQuery({
    queryKey: ["currentUser"],
  });

  useEffect(() => {
    async function connection() {
      if (newConnection.state === "Disconnected") return;

      newConnection.on("ReceiveMessage", (message) => {
        console.log(message);
      });

      newConnection.on("UserStatusChanged", (online_users) => {
        setOnlineUsers(online_users);
      });

      newConnection.on("newOnlineUser", (newOnlineUser) => {
        let alreadyExist = onlineUsers.some(
          (x) => x.userId === newOnlineUser.userId
        );
        if (alreadyExist) return;

        const data = new Set([...onlineUsers, newOnlineUser]);
        console.log(Array.from(data));
        setOnlineUsers(Array.from(data));
      });

      newConnection.on("JoinedRoom", (roomId) => {
        setRoomId(roomId);
      });

      newConnection.on("UserWentOffline", (offlineUser) => {
        console.log(offlineUser);
        let filteredOnlineUsers = onlineUsers.filter((x) => {
          console.log(x.userId, offlineUser);
          return x.userId !== Number(offlineUser);
        });
        console.log(onlineUsers);
        console.log(filteredOnlineUsers);
        setOnlineUsers(filteredOnlineUsers);
      });

      if (ActiveChat) {
        await newConnection.invoke(
          "JoinPrivateChat",
          data.id,
          ActiveChat.participant.id
        );
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
      }
    };
  }, [ActiveChat, data.id, onlineUsers, newConnection]);
  if (newConnection == null) return;

  return (
    <div
      className="h-screen grid gap-0 bg-gray-900 text-white"
      style={{ gridTemplateColumns: "6rem 22rem 5fr auto" }}
    >
      <LeftSideBar />
      <MessagesList setActiveChat={SetActiveChat} onlineUsers={onlineUsers} />
      {ActiveChat && roomId && isHome ? (
        <Chat
          user={ActiveChat}
          roomId={roomId}
          isBlocked={ActiveChat.participant.isBlocked}
          isOnline={onlineUsers.some(
            (user) => user.participant.id === ActiveChat.participant.id
          )}
        />
      ) : (
        <Outlet />
      )}
      <div className="bg-gray-850 p-4 sm:hidden"></div>
    </div>
  );
}

export default Home;
