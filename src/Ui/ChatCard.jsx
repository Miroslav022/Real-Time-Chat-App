import PropTypes from "prop-types";
import UnReadMessageNotification from "./UnReadMessageNotification";

function ChatCard({ SelectChat, chatInfo, isOnline }) {
  const date = new Date(chatInfo.lastMessageAt);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const lastMessage =
    (chatInfo.isGroup && chatInfo.lastMessage) ||
    (!chatInfo.isGroup &&
      !chatInfo.participants[0].isBlocked &&
      chatInfo.lastMessage)
      ? chatInfo.lastMessage
      : "No message";

  const hasUnread = !chatInfo.isRead || (chatInfo.unreadCount ?? 0) > 0;

  return (
    <div
      className={`flex gap-3 items-center cursor-pointer p-4 hover:bg-inpurBorder ${
        !chatInfo.isGroup &&
        chatInfo.participants.some((x) => x.isBlocked) &&
        "bg-error/30"
      } ${hasUnread ? "bg-white/5" : ""}`}
      onClick={() => SelectChat(chatInfo)}
    >
      <div className="w-[3rem] h-[3rem] rounded-full relative flex-shrink-0">
        <img
          src={`https://localhost:7257/Uploads/${chatInfo.displayImage}`}
          className="w-full h-full rounded-full object-cover"
          alt="message-avatar"
        />

        {isOnline && (
          <div className="w-3 h-3 bg-myLightBlue rounded-full absolute right-0 bottom-[0.1rem]"></div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span
          className={`block truncate ${hasUnread ? "font-bold text-white" : "font-medium"}`}
        >
          {chatInfo.displayName}
        </span>
        <span
          className={`block text-sm truncate ${hasUnread ? "text-white/70" : "text-iconsGray"}`}
        >
          {lastMessage}
        </span>
      </div>
      <div className="ml-auto flex flex-col items-end gap-1.5 flex-shrink-0">
        <span
          className={`block text-[0.75rem] font-medium ${
            hasUnread ? "text-myLightBlue font-bold" : "text-myLightBlue"
          }`}
        >
          {`${hours}:${minutes}`}
        </span>
        {hasUnread && (
          <UnReadMessageNotification count={chatInfo.unreadCount ?? 1} />
        )}
      </div>
    </div>
  );
}

ChatCard.propTypes = {
  SelectChat: PropTypes.func,
  chatInfo: PropTypes.object,
  isOnline: PropTypes.bool,
  image: PropTypes.string,
};

export default ChatCard;
