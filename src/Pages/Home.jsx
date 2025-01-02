import { useEffect, useState } from "react";
import Chat from "../Ui/Chat";
import LeftSideBar from "../Ui/LeftSideBar";
import MessagesList from "../Ui/MessagesList";
import { HubConnectionBuilder } from "@microsoft/signalr";
import WelcomeToHome from "../Ui/WelcomeToHome";
import { useQuery } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "../store.js";

const newConnection = new HubConnectionBuilder()
  .withUrl("https://localhost:7257/chat", {
    withCredentials: true,
  })
  .build();

function Home() {
  const [conn, setConnection] = useState(null);
  const [ActiveChat, SetActiveChat] = useState(null);

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
  }, [ActiveChat, data.id]);
  if (conn == null) return;

  return (
    <Provider store={store}>
      <div
        className="h-screen grid gap-0 bg-gray-900 text-white"
        style={{ gridTemplateColumns: "6rem 22rem 5fr auto" }}
      >
        <LeftSideBar />
        <MessagesList setActiveChat={SetActiveChat} />
        {ActiveChat ? (
          <Chat connection={conn} user={ActiveChat} />
        ) : (
          <WelcomeToHome />
        )}
        <div className="bg-gray-850 p-4 sm:hidden"></div>
      </div>
    </Provider>
  );
}

export default Home;
