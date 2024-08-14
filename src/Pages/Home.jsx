import Chat from "../Ui/Chat";
import LeftSideBar from "../Ui/LeftSideBar";
import MessagesList from "../Ui/MessagesList";

function Home() {
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
