import { useEffect, useState } from "react";
import Chat from "../Ui/Chat";
import LeftSideBar from "../Ui/LeftSideBar";
import MessagesList from "../Ui/MessagesList";
import { HubConnectionBuilder } from "@microsoft/signalr";
import WelcomeToHome from "../Ui/WelcomeToHome";
import { useQuery } from "@tanstack/react-query";

const newConnection = new HubConnectionBuilder()
  .withUrl("https://localhost:7257/chat", {
    withCredentials: true,
  })
  .build();

function Home() {
  const [conn, setConnection] = useState(null);
  const [ActiveChat, SetActiveChat] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { data } = useQuery({
    queryKey: ["currentUser"],
  });

  useEffect(() => {
    async function connection() {
      if (newConnection.state === "Disconnected") {
        await newConnection.start();
      }

      newConnection.on("ReceiveMessage", (message) => {
        console.log(message);
      });

      newConnection.on("UserStatusChanged", (online_users) => {
        setOnlineUsers(online_users);
        console.log(online_users);
      });

      newConnection.on("test", (newOnlineUser) => {
        console.log("USAU U TEST");
        const data = new Set([...onlineUsers, newOnlineUser]);
        console.log(Array.from(data));
        setOnlineUsers(Array.from(data));
      });

      newConnection.on("JoinedRoom", (roomId) => {
        console.log(roomId);
        setRoomId(roomId);
      });

      if (ActiveChat) {
        console.log(ActiveChat);
        await newConnection.invoke(
          "JoinPrivateChat",
          data.id,
          ActiveChat.userId
        );
      }
      setConnection(newConnection);
    }
    try {
      connection();
    } catch (error) {
      console.log(error);
    }
  }, [ActiveChat, data.id, onlineUsers]);
  if (conn == null) return;

  return (
    <div
      className="h-screen grid gap-0 bg-gray-900 text-white"
      style={{ gridTemplateColumns: "6rem 22rem 5fr auto" }}
    >
      <LeftSideBar />
      <MessagesList setActiveChat={SetActiveChat} onlineUsers={onlineUsers} />
      {ActiveChat && roomId ? (
        <Chat
          connection={conn}
          user={ActiveChat}
          roomId={roomId}
          isOnline={onlineUsers.some(
            (user) => user.userId === ActiveChat.userId
          )}
        />
      ) : (
        <WelcomeToHome />
      )}
      <div className="bg-gray-850 p-4 sm:hidden"></div>
    </div>
  );
}

export default Home;
