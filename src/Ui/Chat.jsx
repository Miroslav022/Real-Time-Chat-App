import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import ProfileImage from "./ProfileImage";
import InputEmoji from "react-input-emoji";
import { useEffect, useState } from "react";
import { RiAttachment2 } from "react-icons/ri";
import PropTypes from "prop-types";
import Message from "./Message";
import { useQuery } from "@tanstack/react-query";

function Chat({ connection, userId }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const { data } = useQuery({
    queryKey: ["user"],
  });

  useEffect(() => {
    if (connection) {
      connection.on("ReceivePrivateMessage", (sender, message, time) => {
        console.log({ sender, message });
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender, message, time },
        ]);
      });
      // await connection.invoke("JoinPrivateChat", user1Id, user2Id);
    }

    return () => {
      if (connection) {
        connection.off("ReceivePrivateMessage");
      }
    };
  }, [connection, messages]);

  async function sendMessage() {
    try {
      await connection.invoke("SendMessage", data.sub, userId.toString(), text);
      setText("");
    } catch (err) {
      console.log("error while sending the message:" + err);
    }
  }
  return (
    <div
      className="bg-gray-900 border-r-2 border-myGray grid overflow-y-hidden"
      style={{ gridTemplateRows: "5rem auto 5rem" }}
    >
      <div className="border-b-2  border-myGray">
        <div className="p-4 flex justify-between">
          <div className="flex gap-5">
            <ProfileImage />
            <div>
              <span className="block font-medium">Mile</span>
              <span className="block text-sm text-myLightBlue">Typing...</span>
            </div>
          </div>
          <div className="border-2 border-myGray w-[3rem] h-[3rem] flex items-center justify-center rounded-full ml-auto">
            <PiDotsThreeOutlineVertical size={20} />
          </div>
        </div>
      </div>
      <div className="bg-myBgDark p-4 flex flex-col gap-4 overflow-y-scroll">
        {messages.length === 0 && (
          <span className="text-center p-3 text-messageGray">
            No messages, start covnersation.
          </span>
        )}

        {messages.map((message, key) => (
          <Message message={message} currentUser={data.unique_name} key={key} />
        ))}
      </div>
      <div className="flex gap-2 items-center p-4">
        <RiAttachment2 size={30} />
        <div className="w-full flex items-center">
          <InputEmoji
            color="#fff"
            background="#202426"
            borderColor="#26292B"
            borderRadius="0.75rem"
            value={text}
            onChange={setText}
            onEnter={sendMessage}
            placeholder="Type a message"
          />
          <button
            type="submit"
            className="bg-myLightBlue btn-sm rounded-full"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

Chat.propTypes = {
  connection: PropTypes.object,
  userId: PropTypes.number,
};

export default Chat;
