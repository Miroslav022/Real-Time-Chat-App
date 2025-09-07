import PropTypes from "prop-types";
import MessageActionBar from "./MessageActionBar";
// import MessageActionMenu from "./MessageActionMenu";
import { useRef } from "react";
import { useMessageMenu } from "../context/MessageMenuContext";

const messageStyle = {
  sent: "bg-myLightBlue ml-auto w-fit max-w-xs p-3 rounded-l-lg rounded-b-lg text-black",
  received:
    "bg-myGray w-fit max-w-xl p-3 rounded-r-lg rounded-b-lg text-messageGray",
  sentBox: "max-w-xs w-fit ml-auto",
  receivedBox: "max-w-xs w-fit",
};

function Message({ message, currentUser, onContextMenu, isGroupChat }) {
  const date = new Date(message.createdAt);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const ref = useRef();
  const { dispatch } = useMessageMenu();

  const isSentByCurrentUser = currentUser === message.senderUserName;

  const containerStyle = isSentByCurrentUser
    ? messageStyle.sentBox
    : messageStyle.receivedBox;
  const bubbleStyle = isSentByCurrentUser
    ? messageStyle.sent
    : messageStyle.received;

  function onMessageActionMenuClick() {
    const rect = ref.current.getBoundingClientRect();
    console.log("RECT>>>", rect);
    const data = {
      type: "OPEN_MENU",
      payload: {
        messageId: message.id,
        messageContent: message.messageContent,
        position: {
          top: rect.top + rect.height,
        },
      },
    };
    isSentByCurrentUser
      ? (data.payload.position.right = 30)
      : (data.payload.position.left = rect.left);
    dispatch(data);
  }

  return (
    <div
      ref={ref}
      onContextMenu={(e) => {
        if (isSentByCurrentUser) onContextMenu(e, message.id);
      }}
      className={`${containerStyle} relative`}
    >
      <div className="flex items-center gap-2 group relative">
        <div className={`${bubbleStyle}`}>
          {isGroupChat && (
            <div
              className={`
                text-[0.7rem]
                font-bold
                ${isSentByCurrentUser ? "text-myBgDark" : "text-secondary"} `}
            >
              {message.senderUserName}
            </div>
          )}
          {message.repliedToMessageId && (
            <div className="mb-2 px-2 py-1 text-xs bg-white/30 border-l-4 border-blue-300 rounded-sm text-gray-700">
              <span className="block font-medium text-xs text-gray-600">
                {message.repliedToMessage.senderUserName}
              </span>
              <span>{message.repliedToMessage.messageContent}</span>
            </div>
          )}
          {message.messageContent}
          <span
            className={`text-[0.7rem] float-end mt-2 ${
              isSentByCurrentUser ? "text-myBgDark" : "text-textGray"
            } ml-5`}
          >
            {`${hours}:${minutes}`}
          </span>
        </div>
        <MessageActionBar
          position={isSentByCurrentUser ? "sent" : "received"}
          onClickHandler={onMessageActionMenuClick}
        />
      </div>
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.object,
  currentUser: PropTypes.string,
  onContextMenu: PropTypes.func,
  isGroupChat: PropTypes.bool,
};

export default Message;
