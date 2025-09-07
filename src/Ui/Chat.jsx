import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import ProfileImage from "./ProfileImage";
import InputEmoji from "react-input-emoji";
import { useEffect, useState } from "react";
import { RiAttachment2 } from "react-icons/ri";
import PropTypes from "prop-types";
import Message from "./Message";
import { useQueryClient } from "@tanstack/react-query";
import { useMessages } from "../features/chat/useMessages";
import { useSignalRContext } from "../context/SignalRContext";
import { AlwaysScrollToBottom } from "./AlwaysScrollToBottom";
import BlockedUserAlert from "./BlockedUserAlert";
import DropDownSettings from "./DropDownSettings";
import QuickUserMenu from "./QuickUserMenu";
import ContextMenu from "./ContextMenu";
import { useMessageMenu } from "../context/MessageMenuContext";
import ReplyToMessage from "./ReplyToMessage";
import { useAuth } from "../context/AuthProvider";
// import { useFetchConversations } from "../features/useFetchConversations";

const initialContextParams = {
  isOpen: false,
  x: null,
  y: null,
};

function Chat({ conversation, roomId, isOnline }) {
  // const { data } = useQuery({
  //   queryKey: ["currentUser"],
  // });
  const { user } = useAuth();

  const { messages: storedMessages } = useMessages(conversation.id);
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState();
  const { state, dispatch } = useMessageMenu();
  const connection = useSignalRContext();
  const [contextParams, setContextParams] = useState(initialContextParams);
  const [isOpen, setIsOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (connection && connection.state === "Connected") {
      connection.on("ReceivePrivateMessage", (sender, message) => {
        console.log("message>>>", { sender, message });
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

  useEffect(() => {
    // const isUserBlocked = conversation?.participants[0]?.isBlocked ?? conversation?.isBlocked;
    const isUserBlocked = false;
    console.log(isUserBlocked);
    setIsBlocked(isUserBlocked);
  }, [conversation]);

  function handleTyping(e) {
    if (!isTyping && roomId) {
      setIsTyping(true);
      setText(e);
      connection
        .invoke("TypingNotification", roomId, user?.unique_name)
        .catch((error) =>
          console.error("Error sending typing notification: ", error)
        );
      setTimeout(() => setIsTyping(false), 3000);
    }
  }

  function handleOpenCloseMenu(e) {
    if (e.target.closest("ul") || e.target.closest("li")) return;
    setIsOpen(!isOpen);
  }

  async function sendMessage() {
    try {
      if (!text) return;
      const participantIds = conversation.participants.map((x) =>
        x.id.toString()
      );
      participantIds.push(user?.sub.toString());
      const message = {
        conversationId: conversation.id,
        senderId: user?.sub,
        participantIds: participantIds,
        message: text,
        messageTypeId: 1,
        replyToMessageId: null,
      };

      if (state && state.action == "replyToMessage") {
        message.replyToMessageId = state.messageId;
      }
      await connection.invoke("SendMessage", message);
      setText("");
      if (state.action == "replyToMessage") dispatch({ type: "CLOSE_MENU" });
    } catch (err) {
      console.log("error while sending the message:" + err);
    }
  }

  function handleContextMenu(e, id) {
    e.preventDefault();

    setContextParams({
      isOpen: true,
      x: e.pageX,
      y: e.pageY,
      messageId: id,
    });
  }

  function handleCloseContextMenu() {
    setContextParams(initialContextParams);
  }

  return (
    <div
      className="bg-gray-900 border-r-2 border-myGray grid overflow-y-hidden"
      style={{ gridTemplateRows: "5rem auto 5rem" }}
    >
      <div className="border-b-2  border-myGray">
        <div className="p-4 flex justify-between">
          <div className="flex gap-5">
            <ProfileImage fileName={conversation.displayImage} />
            <div>
              <span className="block font-medium">
                {conversation.displayName}
              </span>
              <p className="block font-normall text-myLightBlue">
                {typingUser
                  ? typingUser + " is Typing..."
                  : isOnline
                  ? "Online"
                  : "Offline"}
              </p>
            </div>
          </div>
          <div className="relative cursor-pointer">
            <div
              className="border-2 border-myGray w-[3rem] h-[3rem] flex items-center justify-center rounded-full ml-auto"
              onClick={handleOpenCloseMenu}
            >
              <PiDotsThreeOutlineVertical size={20} />
              {isOpen && (
                <DropDownSettings>
                  <QuickUserMenu
                    handleIsOpen={setIsOpen}
                    currentUser={user?.sub}
                    blockUserId={conversation.userId}
                    handleIsBlockedState={setIsBlocked}
                  />
                </DropDownSettings>
              )}
            </div>
          </div>
        </div>
      </div>
      {isBlocked ? (
        <BlockedUserAlert
          participantId={conversation?.userId}
          currentUserId={user?.sub}
          handleIsBlockedState={setIsBlocked}
        />
      ) : (
        <>
          <div className="bg-myBgDark p-4 flex flex-col gap-4 overflow-y-auto scrollToBottom">
            {storedMessages?.length === 0 && (
              <span className="text-center p-3 text-messageGray">
                No messages, start covnersation.
              </span>
            )}
            {storedMessages?.map((message, key) => (
              <Message
                onContextMenu={handleContextMenu}
                message={message}
                currentUser={user?.unique_name}
                isGroupChat={conversation.isGroup}
                key={key}
              />
            ))}

            <AlwaysScrollToBottom />
            {contextParams.isOpen && (
              <ContextMenu
                contextParams={contextParams}
                contextMenuCloseHandler={handleCloseContextMenu}
              />
            )}
          </div>
          <div className="p-4">
            {state.action == "replyToMessage" && <ReplyToMessage />}
            <div className="flex gap-2 items-center">
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
        </>
      )}
    </div>
  );
}

Chat.propTypes = {
  conversation: PropTypes.object,
  roomId: PropTypes.string,
  isOnline: PropTypes.bool,
};

export default Chat;
