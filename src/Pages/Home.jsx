import { useEffect, useState } from "react";
import Chat from "../Ui/Chat";
import LeftSideBar from "../Ui/LeftSideBar";
import MessagesList from "../Ui/MessagesList";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

function Home() {
  const [msg] = useState("poruka");
  useEffect(() => {
    async function connection() {
      const conn = new HubConnectionBuilder()
        .withUrl("https://localhost:7257/chat")
        .configureLogging(LogLevel.Information)
        .build();

      conn.on("send", (msg) => {
        console.log("Success: ", msg);
      });
      await conn.start();
      await conn.invoke("JoinGroup", msg);
    }
    try {
      connection();
    } catch (error) {
      console.log(error);
    }
  }, [msg]);
  return (
    <div
      className="h-screen grid gap-0 bg-gray-900 text-white"
      style={{ gridTemplateColumns: "6rem 22rem 5fr 2fr" }}
    >
      <LeftSideBar />
      <MessagesList />
      <Chat />
      <div className="bg-gray-850 p-4"></div>
    </div>
  );
}

export default Home;
