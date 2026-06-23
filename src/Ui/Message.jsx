import PropTypes from "prop-types";
import MessageActionBar from "./MessageActionBar";
// import MessageActionMenu from "./MessageActionMenu";
import { memo, useRef, useState } from "react";
import { useMessageMenu } from "../context/MessageMenuContext";
import { getOutboundStatusInfo } from "../features/chat/messageStatus.ts";
import { API_ORIGIN } from "../api/axiosInstance";
import { FaCheck } from "react-icons/fa6";
import { useSettings } from "../context/SettingsContext";

const messageStyle = {
  sent: "bg-myLightBlue ml-auto w-fit max-w-xs p-3 rounded-l-lg rounded-b-lg text-black",
  received:
    "bg-myGray w-fit max-w-xl p-3 rounded-r-lg rounded-b-lg text-messageGray",
  sentBox: "max-w-xs w-fit ml-auto",
  receivedBox: "max-w-xs w-fit",
};

function Message({
  message,
  currentUser,
  currentUserId,
  onContextMenu,
  isGroupChat,
  recipientsCount,
}) {
  const date = new Date(message.createdAt);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const ref = useRef();
  const { dispatch } = useMessageMenu();
  const { settings } = useSettings();
  const [lightboxUrl, setLightboxUrl] = useState(null);

  const media = message.media ?? message.Media;
  const hasImages = Array.isArray(media) && media.length > 0;
  const messageContent = message.messageContent ?? message.MessageContent;

  const isSentByCurrentUser =
    Number(currentUserId) === Number(message.senderId) ||
    currentUser === message.senderUserName;

  const statusInfo = getOutboundStatusInfo(
    message,
    currentUserId,
    recipientsCount,
  );

  const outboundStatusInfo = isSentByCurrentUser
    ? (statusInfo ?? {
        icon: "✓",
        className: "text-myBgDark/70",
        label: "Sent",
        seenCount: 0,
        totalRecipients: recipientsCount ?? 1,
      })
    : null;

  const statusTooltip = isGroupChat
    ? `Seen by ${outboundStatusInfo?.seenCount ?? 0} of ${outboundStatusInfo?.totalRecipients ?? recipientsCount ?? 1}`
    : outboundStatusInfo?.label;

  const containerStyle = isSentByCurrentUser
    ? messageStyle.sentBox
    : messageStyle.receivedBox;
  const padding = settings.compactMode ? "p-1.5" : "p-3";
  const bubbleStyle = isSentByCurrentUser
    ? `bg-myLightBlue ml-auto w-fit max-w-xs ${padding} rounded-l-lg rounded-b-lg text-black`
    : `bg-myGray w-fit max-w-xl ${padding} rounded-r-lg rounded-b-lg text-messageGray`;

  function onMessageActionMenuClick() {
    const rect = ref.current.getBoundingClientRect();
    const data = {
      type: "OPEN_MENU",
      payload: {
        messageId: message.id,
        messageContent: messageContent,
        media: media ?? null,
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
    <>
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
                {Array.isArray(message.repliedToMessage?.media) &&
                  message.repliedToMessage.media.length > 0 &&
                  (() => {
                    const u = message.repliedToMessage.media[0]?.url ?? "";
                    const src = u.startsWith("http") ? u : `${API_ORIGIN}${u}`;
                    return (
                      <img
                        src={src}
                        alt=""
                        className="w-12 h-12 object-cover rounded mt-1"
                      />
                    );
                  })()}
                {(message.repliedToMessage.messageContent ??
                  message.repliedToMessage.MessageContent) && (
                  <span>
                    {message.repliedToMessage.messageContent ??
                      message.repliedToMessage.MessageContent}
                  </span>
                )}
              </div>
            )}
            {hasImages && (
              <div className="flex flex-wrap gap-1 mb-1">
                {media.map((item, idx) => {
                  // item can be a string URL, or an object with url/Url
                  const rawUrl =
                    typeof item === "string"
                      ? item
                      : (item.url ?? item.Url ?? "");
                  // If the URL is already absolute, use it directly
                  const fullUrl = rawUrl.startsWith("http")
                    ? rawUrl
                    : `${API_ORIGIN}/uploads/${rawUrl}`;
                  return (
                    <img
                      key={idx}
                      src={fullUrl}
                      alt=""
                      style={{
                        maxWidth: "300px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "block",
                      }}
                      onClick={() => setLightboxUrl(fullUrl)}
                    />
                  );
                })}
              </div>
            )}
            {messageContent && <span>{messageContent}</span>}
            <span
              className={`text-[0.7rem] float-end mt-2 ${
                isSentByCurrentUser ? "text-myBgDark" : "text-textGray"
              } ml-5`}
            >
              {`${hours}:${minutes}`}
              {isSentByCurrentUser && outboundStatusInfo && (
                <span
                  className={`ml-1 inline-flex align-middle drop-shadow-md ${outboundStatusInfo.className}`}
                  title={statusTooltip}
                >
                  {outboundStatusInfo.icon === "✓✓" ? (
                    <span className="inline-flex items-center">
                      <FaCheck size={16} />
                      <FaCheck size={16} className="-ml-[11px]" />
                    </span>
                  ) : (
                    <FaCheck size={18} />
                  )}
                </span>
              )}
            </span>
          </div>
          <MessageActionBar
            position={isSentByCurrentUser ? "sent" : "received"}
            onClickHandler={onMessageActionMenuClick}
          />
        </div>
      </div>
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxUrl(null)}
        >
          <div
            className="relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxUrl}
              alt="Full size"
              className="max-w-[88vw] max-h-[85vh] rounded-xl object-contain shadow-2xl ring-1 ring-white/10"
            />
            <button
              className="absolute -top-4 -right-4 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-xl leading-none shadow-lg transition-colors duration-150"
              onClick={() => setLightboxUrl(null)}
              aria-label="Close"
            >
              ×
            </button>
            <span className="mt-3 text-xs text-white/40 select-none">
              Click outside to close
            </span>
          </div>
        </div>
      )}
    </>
  );
}

Message.propTypes = {
  message: PropTypes.object,
  currentUser: PropTypes.string,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onContextMenu: PropTypes.func,
  isGroupChat: PropTypes.bool,
  recipientsCount: PropTypes.number,
};

export default memo(Message);
