import PropTypes from "prop-types";

const messageStyle = {
  sent: "bg-myLightBlue ml-auto w-fit max-w-xs p-3 rounded-l-lg rounded-b-lg text-black",
  received:
    "bg-myGray w-fit max-w-xl p-3 rounded-r-lg rounded-b-lg text-messageGray",
  sentBox: "max-w-xs w-fit ml-auto",
  receivedBox: "max-w-xs w-fit",
};

function Message({ message, currentUser }) {
  const date = new Date(message.createdAt);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return (
    <div
      className={
        currentUser === message.senderUserName
          ? messageStyle.sentBox
          : messageStyle.receivedBox
      }
    >
      <div
        className={
          currentUser === message.senderUserName
            ? messageStyle.sent
            : messageStyle.received
        }
      >
        {message.messageContent}
      </div>
      <span className="text-[0.7rem] float-end mt-2 text-textGray">
        {`${hours}:${minutes}`}
      </span>
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.object,
  currentUser: PropTypes.string,
};

export default Message;
