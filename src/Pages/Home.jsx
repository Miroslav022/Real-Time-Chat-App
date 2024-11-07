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
  const [ActiveChatId, SetActiveChatId] = useState(null);

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
      newConnection.on("JoinedRoom", (roomId) => {
        console.log(roomId);
      });

      if (ActiveChatId) {
        await newConnection.invoke(
          "JoinPrivateChat",
          data.id,
          ActiveChatId.toString()
        );
      }
      setConnection(newConnection);
    }
    try {
      connection();
    } catch (error) {
      console.log(error);
    }
  }, [ActiveChatId, data.id]);
  if (conn == null) return;

  return (
    <div
      className="h-screen grid gap-0 bg-gray-900 text-white"
      style={{ gridTemplateColumns: "6rem 22rem 5fr auto" }}
    >
      <LeftSideBar />
      <MessagesList setActiveChat={SetActiveChatId} />
      {ActiveChatId ? (
        <Chat connection={conn} userId={ActiveChatId} />
      ) : (
        <WelcomeToHome />
      )}
      <div className="bg-gray-850 p-4 sm:hidden"></div>
    </div>
  );
}

export default Home;
