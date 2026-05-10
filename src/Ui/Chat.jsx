import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import ProfileImage from "./ProfileImage";
import InputEmoji from "react-input-emoji";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RiAttachment2 } from "react-icons/ri";
import { IoArrowBack } from "react-icons/io5";
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
import {
  applyConversationStatusUpdate,
  applyMessageStatusUpdate,
  upsertMessage,
} from "../features/chat/messageStatus.ts";
import { uploadImages } from "../Services/apiMessage";
// import { useFetchConversations } from "../features/useFetchConversations";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const initialContextParams = {
  isSettingsOpen: false,
  x: null,
  y: null,
};

function Chat({ conversation, isOnline, currentOpenConversationId, onBack }) {
  const { user } = useAuth();
  const { messages: storedMessages } = useMessages(conversation.id);
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [typingUser, setTypingUser] = useState();
  const { state: messageMenuState, dispatch } = useMessageMenu();
  const connection = useSignalRContext();
  const [contextParams, setContextParams] = useState(initialContextParams);
  const [isSettingsOpen, setIsOpen] = useState(false);
  const [blockedOverride, setBlockedOverride] = useState(null);
  const typingCooldownRef = useRef(null);
  const typingUserTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const hideTypingIndicator = useCallback(() => {
    setTypingUser("");
    clearTimeout(typingUserTimeoutRef.current);
    typingUserTimeoutRef.current = null;
  }, []);

  const otherParticipantId = useMemo(
    () => conversation?.participants?.[0]?.id || conversation?.userId,
    [conversation?.participants, conversation?.userId],
  );

  const isBlocked =
    blockedOverride ??
    conversation?.isBlocked ??
    (!conversation?.isGroup && conversation?.participants?.[0]?.isBlocked);

  useEffect(() => {
    setBlockedOverride(null);
  }, [conversation?.id]);

  useEffect(() => {
    setMessages(storedMessages ?? []);
  }, [storedMessages]);

  const updateMessagesState = useCallback(
    (updater) => {
      setMessages((prevMessages) => {
        const nextMessages = updater(prevMessages ?? []);

        queryClient.setQueryData(["messages", conversation.id], nextMessages);

        return nextMessages;
      });
    },
    [conversation.id, queryClient],
  );

  useEffect(() => {
    if (!connection || connection.state !== "Connected") return;

    function handleReceiveMessage(messageOrSender, maybeMessage) {
      const incomingMessage = messageOrSender?.id
        ? messageOrSender
        : maybeMessage;

      if (!incomingMessage?.id) return;

      if (
        incomingMessage.conversationId &&
        Number(incomingMessage.conversationId) !== Number(conversation.id)
      ) {
        return;
      }

      updateMessagesState((currentMessages) =>
        upsertMessage(currentMessages, incomingMessage),
      );
      // Conversation list updates (lastMessage, unreadCount) are handled
      // optimistically in Home.jsx — no invalidation needed here.
    }

    function handleMessageDelivered(payload) {
      if (!payload?.messageId) return;
      if (Number(payload?.conversationId) !== Number(conversation.id)) return;

      updateMessagesState((currentMessages) =>
        applyMessageStatusUpdate(currentMessages, payload),
      );
    }

    function handleMessageStatusUpdated(payload) {
      if (!payload?.messageId) return;
      if (Number(payload?.conversationId) !== Number(conversation.id)) return;

      updateMessagesState((currentMessages) =>
        applyMessageStatusUpdate(currentMessages, payload),
      );
    }

    function handleConversationStatusUpdated(payload) {
      if (Number(payload?.conversationId) !== Number(conversation.id)) return;

      updateMessagesState((currentMessages) =>
        applyConversationStatusUpdate(currentMessages, payload, user?.sub),
      );
    }

    function handleTypingNotification(incomingConversationId, userName) {
      // Reject non-numeric values (legacy string overload) and the sentinel -1.
      if (
        typeof incomingConversationId !== "number" ||
        incomingConversationId === -1
      )
        return;
      // Only show typing for the currently-open conversation.
      if (incomingConversationId !== Number(currentOpenConversationId)) return;

      setTypingUser(userName);
      clearTimeout(typingUserTimeoutRef.current);
      // Auto-hide indicator after 3 s of inactivity.
      typingUserTimeoutRef.current = setTimeout(() => {
        hideTypingIndicator();
      }, 3000);
    }

    connection.on("ReceivePrivateMessage", handleReceiveMessage);
    connection.on("TypingNotification", handleTypingNotification);
    connection.on("MessageDelivered", handleMessageDelivered);
    connection.on("MessageStatusUpdated", handleMessageStatusUpdated);
    connection.on("ConversationStatusUpdated", handleConversationStatusUpdated);

    return () => {
      if (connection) {
        connection.off("ReceivePrivateMessage", handleReceiveMessage);
        connection.off("TypingNotification", handleTypingNotification);
        connection.off("MessageDelivered", handleMessageDelivered);
        connection.off("MessageStatusUpdated", handleMessageStatusUpdated);
        connection.off(
          "ConversationStatusUpdated",
          handleConversationStatusUpdated,
        );
      }
      hideTypingIndicator();
    };
  }, [
    connection,
    conversation.id,
    currentOpenConversationId,
    hideTypingIndicator,
    queryClient,
    updateMessagesState,
    user?.sub,
  ]);

  useEffect(() => {
    if (!connection || connection.state !== "Connected" || !conversation?.id)
      return;

    connection
      .invoke("MarkConversationAsSeen", Number(conversation.id))
      .catch((error) =>
        console.error("Error while marking conversation as seen:", error),
      );
  }, [connection, conversation?.id]);

  useEffect(() => {
    if (!connection || connection.state !== "Connected" || !conversation?.id)
      return;

    if (!messages?.length) return;

    const lastMessage = messages[messages.length - 1];
    if (Number(lastMessage?.senderId) === Number(user?.sub)) return;

    connection
      .invoke("MarkConversationAsSeen", Number(conversation.id))
      .catch((error) =>
        console.error("Error while marking conversation as seen:", error),
      );
  }, [connection, conversation?.id, messages, user?.sub]);

  useEffect(() => {
    return () => clearTimeout(typingCooldownRef.current);
  }, []);

  useEffect(() => {
    hideTypingIndicator();
    clearTimeout(typingCooldownRef.current);
    typingCooldownRef.current = null;

    return () => {
      clearTimeout(typingCooldownRef.current);
      typingCooldownRef.current = null;
      hideTypingIndicator();
    };
  }, [conversation?.id, hideTypingIndicator]);

  const handleTyping = useCallback(
    (value) => {
      setText(value);

      if (
        !conversation?.id ||
        !connection ||
        connection.state !== "Connected" ||
        typingCooldownRef.current
      )
        return;

      connection
        .invoke("TypingNotification", Number(conversation.id))
        .catch((error) =>
          console.error("Error sending typing notification: ", error),
        );

      // Throttle: allow at most one event per 1500 ms while the user keeps typing.
      typingCooldownRef.current = setTimeout(() => {
        typingCooldownRef.current = null;
      }, 1500);
    },
    [connection, conversation?.id],
  );

  const handleOpenCloseMenu = useCallback((e) => {
    if (e.target.closest("ul") || e.target.closest("li")) return;
    setIsOpen((open) => !open);
  }, []);

  const handleImageSelect = useCallback((files) => {
    const valid = [];
    const errors = [];
    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`"${file.name}" exceeds 5MB limit`);
      } else {
        valid.push({ file, previewUrl: URL.createObjectURL(file) });
      }
    });
    if (errors.length) {
      setImageError(errors.join("; "));
      setTimeout(() => setImageError(""), 4000);
    }
    if (valid.length) {
      setSelectedImages((prev) => [...prev, ...valid]);
    }
  }, []);

  const removeImage = useCallback((index) => {
    setSelectedImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const clearImages = useCallback(() => {
    setSelectedImages((prev) => {
      prev.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
      return [];
    });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (e.dataTransfer.files?.length) {
        handleImageSelect(e.dataTransfer.files);
      }
    },
    [handleImageSelect],
  );

  const sendMessage = useCallback(async () => {
    if (!text && selectedImages.length === 0) return;
    if (!connection || connection.state !== "Connected") return;

    try {
      const participantIds = [
        ...(conversation?.userId
          ? [conversation.userId.toString()]
          : (conversation?.participants?.map((x) => x.id.toString()) ?? [])),
        user?.sub?.toString(),
      ];

      if (selectedImages.length > 0) {
        setIsUploading(true);
        setImageError("");
        let imageUrls = [];
        try {
          imageUrls = await uploadImages(
            selectedImages.map(({ file }) => file),
          );
        } catch (err) {
          console.error("Image upload failed:", err);
          setImageError("Failed to upload images. Please try again.");
          setIsUploading(false);
          return;
        }

        // Backend returns { imageUrls: ["filename.jpg", ...] }
        const urlArray = Array.isArray(imageUrls?.imageUrls)
          ? imageUrls.imageUrls
          : Array.isArray(imageUrls)
            ? imageUrls
            : [];

        const newMessage = {
          conversationId: Number(conversation.id),
          senderId: Number(user?.sub),
          participantIds,
          message: text,
          messageTypeId: 2,
          imageUrls: urlArray,
          replyToMessageId:
            messageMenuState?.action === "replyToMessage"
              ? messageMenuState.messageId
              : null,
        };
        await connection.invoke("SendMessage", newMessage);
        clearImages();
        setText("");
        setIsUploading(false);
        if (messageMenuState.action === "replyToMessage")
          dispatch({ type: "CLOSE_MENU" });
      } else {
        const newMessage = {
          conversationId: Number(conversation.id),
          senderId: Number(user?.sub),
          participantIds,
          message: text,
          messageTypeId: 1,
          imageUrls: null,
          replyToMessageId:
            messageMenuState?.action === "replyToMessage"
              ? messageMenuState.messageId
              : null,
        };
        await connection.invoke("SendMessage", newMessage);
        setText("");
        if (messageMenuState.action === "replyToMessage")
          dispatch({ type: "CLOSE_MENU" });
      }
    } catch (err) {
      console.error("error while sending the message:" + err);
      setIsUploading(false);
    }
  }, [
    clearImages,
    connection,
    conversation,
    dispatch,
    messageMenuState,
    selectedImages,
    text,
    user?.sub,
  ]);

  const handleContextMenu = useCallback((e, id) => {
    e.preventDefault();

    setContextParams({
      isSettingsOpen: true,
      x: e.pageX,
      y: e.pageY,
      messageId: id,
    });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextParams(initialContextParams);
  }, []);

  return (
    <div
      className="bg-gray-900 border-r-2 border-myGray grid overflow-y-hidden h-full"
      style={{ gridTemplateRows: "5rem 1fr auto" }}
    >
      <div className="border-b-2  border-myGray">
        <div className="p-4 flex justify-between">
          <div className="flex gap-5 items-center">
            {/* Back button — mobile only */}
            {onBack && (
              <button
                onClick={onBack}
                className="lg:hidden text-iconsGray hover:text-white transition-colors flex-shrink-0"
                aria-label="Back to conversations"
              >
                <IoArrowBack size={22} />
              </button>
            )}
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
              {isSettingsOpen && (
                <DropDownSettings>
                  <QuickUserMenu
                    handleIsOpen={setIsOpen}
                    currentUser={user?.sub}
                    blockUserId={otherParticipantId}
                    handleIsBlockedState={setBlockedOverride}
                  />
                </DropDownSettings>
              )}
            </div>
          </div>
        </div>
      </div>
      {isBlocked ? (
        <BlockedUserAlert
          participantId={otherParticipantId}
          currentUserId={user?.sub}
          handleIsBlockedState={setBlockedOverride}
        />
      ) : (
        <>
          <div
            className="bg-myBgDark p-4 flex flex-col gap-4 overflow-y-auto scrollToBottom"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {messages?.length === 0 && (
              <span className="text-center p-3 text-messageGray">
                No messages, start covnersation.
              </span>
            )}
            {messages?.map((message) => (
              <Message
                onContextMenu={handleContextMenu}
                message={message}
                currentUser={user?.unique_name}
                currentUserId={user?.sub}
                isGroupChat={conversation.isGroup}
                recipientsCount={conversation?.participants?.length}
                key={message.id}
              />
            ))}

            <AlwaysScrollToBottom />
            {contextParams.isSettingsOpen && (
              <ContextMenu
                contextParams={contextParams}
                contextMenuCloseHandler={handleCloseContextMenu}
              />
            )}
          </div>
          <div className="p-4">
            {messageMenuState.action == "replyToMessage" && <ReplyToMessage />}
            {imageError && (
              <div className="text-red-400 text-sm mb-2 px-1">{imageError}</div>
            )}
            {selectedImages.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2 p-2 bg-[#202426] rounded-xl border border-myGray">
                {selectedImages.map(({ previewUrl }, index) => (
                  <div key={index} className="relative">
                    <img
                      src={previewUrl}
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    handleImageSelect(e.target.files);
                    e.target.value = "";
                  }
                }}
              />
              <RiAttachment2
                size={30}
                className="cursor-pointer hover:text-myLightBlue transition-colors flex-shrink-0"
                onClick={() => fileInputRef.current?.click()}
              />
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
                  className="bg-myLightBlue btn-sm rounded-full disabled:opacity-50"
                  onClick={sendMessage}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Send"}
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
  isOnline: PropTypes.bool,
  currentOpenConversationId: PropTypes.number,
  onBack: PropTypes.func,
};

export default Chat;
