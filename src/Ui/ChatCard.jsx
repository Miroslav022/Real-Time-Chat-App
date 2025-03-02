import PropTypes from "prop-types";

function ChatCard({ SelectChat, chatInfo, isOnline }) {
  const date = new Date(chatInfo.lastMessageAt);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return (
    <div
      className="flex gap-3 items-center cursor-pointer p-4 hover:bg-inpurBorder"
      onClick={() => SelectChat(chatInfo)}
    >
      <div className="w-[3rem] rounded-full relative">
        <img
          src="../public/avatar.jpg"
          className="w-full h-full rounded-full"
          alt="message-avatar"
        />

        {isOnline && (
          <div className="w-3 h-3 bg-myLightBlue rounded-full absolute right-0 bottom-[0.1rem]"></div>
        )}
      </div>
      <div>
        <span className="block">{chatInfo.username}</span>
        <span className="block text-sm text-iconsGray">
          {chatInfo.lastMessage ? chatInfo.lastMessage : "No message yet"}
        </span>
      </div>
      <span className="block text-[0.8rem] text-iconsGray ml-auto pr-4">
        {`${hours}:${minutes}`}
      </span>
    </div>
  );
}

ChatCard.propTypes = {
  SelectChat: PropTypes.func,
  chatInfo: PropTypes.object,
  isOnline: PropTypes.bool,
};

export default ChatCard;
