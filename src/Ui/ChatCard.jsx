import PropTypes from "prop-types";
import UnReadMessageNotification from "./UnReadMessageNotification";
import { useContacts } from "../features/Contacts/useContacts";
import { IoPersonAddSharp } from "react-icons/io5";

function ChatCard({ SelectChat, chatInfo, isOnline }) {
  const { contacts } = useContacts();
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

  const participantId = !chatInfo.isGroup
    ? chatInfo.participants?.[0]?.id
    : null;
  const isInContacts =
    chatInfo.isGroup ||
    contacts.some((c) => Number(c.userId) === Number(participantId));

  const displayLabel = isInContacts
    ? chatInfo.displayName
    : chatInfo.participants?.[0]?.phoneNumber ||
      chatInfo.participants?.[0]?.userName ||
      chatInfo.displayName;

  return (
    <div
      className={`relative flex gap-3 items-center cursor-pointer p-4 hover:bg-inpurBorder transition-colors
        ${!chatInfo.isGroup && chatInfo.participants.some((x) => x.isBlocked) ? "bg-error/30" : ""}
        ${!isInContacts ? "border-l-2 border-myLightBlue/50" : "border-l-2 border-transparent"}
        ${hasUnread ? "bg-white/5" : ""}
      `}
      onClick={() => SelectChat(chatInfo)}
    >
      {/* Avatar */}
      <div className="w-[3rem] h-[3rem] rounded-full relative flex-shrink-0">
        <img
          src={
            chatInfo.displayImage
              ? chatInfo.displayImage.startsWith("/")
                ? `https://localhost:7257${chatInfo.displayImage}`
                : `https://localhost:7257/Uploads/${chatInfo.displayImage}`
              : "/avatar.jpg"
          }
          onError={(e) => {
            e.currentTarget.src = "/avatar.jpg";
          }}
          className={`w-full h-full rounded-full object-cover ${!isInContacts ? "ring-2 ring-myLightBlue/30" : ""}`}
          alt="message-avatar"
        />
        {isOnline && (
          <div className="w-3 h-3 bg-myLightBlue rounded-full absolute right-0 bottom-[0.1rem]"></div>
        )}
        {!isInContacts && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-myLightBlue rounded-full flex items-center justify-center ring-2 ring-myBgBlue">
            <IoPersonAddSharp size={9} className="text-white" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div
          className={`flex items-center gap-1.5 min-w-0 ${hasUnread ? "font-bold text-white" : "font-medium"}`}
        >
          <span className="truncate">{displayLabel}</span>
        </div>
        {!isInContacts ? (
          <span className="block text-xs text-myLightBlue/70 truncate">
            Unknown · Tap to add contact
          </span>
        ) : (
          <span
            className={`block text-sm truncate ${hasUnread ? "text-white/70" : "text-iconsGray"}`}
          >
            {lastMessage}
          </span>
        )}
      </div>

      {/* Time + unread */}
      <div className="ml-auto flex flex-col items-end gap-1.5 flex-shrink-0">
        <span
          className={`block text-[0.75rem] font-medium ${hasUnread ? "text-myLightBlue font-bold" : "text-myLightBlue"}`}
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
