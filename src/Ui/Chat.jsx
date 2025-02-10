import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import ProfileImage from "./ProfileImage";
import InputEmoji from "react-input-emoji";
import { useEffect, useState } from "react";
import { RiAttachment2 } from "react-icons/ri";
import PropTypes from "prop-types";
import Message from "./Message";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMessages } from "../features/chat/useMessages";

function Chat({ connection, user, roomId, isOnline }) {
  const { messages: storedMessages } = useMessages(user.id);
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState();

  const { data } = useQuery({
    queryKey: ["currentUser"],
  });

  useEffect(() => {
    if (connection) {
      connection.on("ReceivePrivateMessage", (sender, message) => {
        console.log({ sender, message });
        queryClient.invalidateQueries({ queryKey: ["messages"] });
        queryClient.invalidateQueries({ queryKey: ["Conversations"] });
      });

      connection.on("ReceiveTypingNotification", (userName) => {
        setTypingUser(userName);
        setTimeout(() => setTypingUser(""), 3000);
      });
    }

    return () => {
      if (connection) {
        connection.off("ReceivePrivateMessage");
      }
    };
  }, [connection, queryClient]);
  function handleTyping(e) {
    if (!isTyping && roomId) {
      setIsTyping(true);
      setText(e);
      connection
        .invoke("TypingNotification", roomId, data.username)
        .catch((error) =>
          console.error("Error sending typing notification: ", error)
        );
      setTimeout(() => setIsTyping(false), 3000);
    }
  }
  async function sendMessage() {
    try {
      if (!text) return;
      const message = {
        conversationId: user.id,
        senderId: data.id,
        receiverId: user.userId,
        message: text,
        messageTypeId: 1,
      };
      await connection.invoke("SendMessage", message);
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
              <span className="block font-medium">{user.username}</span>
              <p className="block font-normall text-myLightBlue">
                {isOnline ? "Online" : "Offline"}
              </p>
              <span className="block text-sm text-myLightBlue">
                {typingUser && typingUser + " is Typing..."}
              </span>
            </div>
          </div>
          <div className="border-2 border-myGray w-[3rem] h-[3rem] flex items-center justify-center rounded-full ml-auto">
            <PiDotsThreeOutlineVertical size={20} />
          </div>
        </div>
      </div>
      <div className="bg-myBgDark p-4 flex flex-col gap-4 overflow-y-auto">
        {storedMessages?.length === 0 && (
          <span className="text-center p-3 text-messageGray">
            No messages, start covnersation.
          </span>
        )}

        {storedMessages?.map((message, key) => (
          <Message message={message} currentUser={data.username} key={key} />
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
            onChange={handleTyping}
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
  user: PropTypes.object,
  roomId: PropTypes.string,
  isOnline: PropTypes.bool,
};

export default Chat;
