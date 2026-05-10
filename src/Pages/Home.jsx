import { useEffect, useRef, useState } from "react";
import Chat from "../Ui/Chat";
import LeftSideBar from "../Ui/LeftSideBar";
import MessagesList from "../Ui/MessagesList";
import { useQueryClient } from "@tanstack/react-query";
import { useSignalRContext } from "../context/SignalRContext";
import { Outlet, useLocation } from "react-router-dom";
import { useOnlineUsers } from "../context/OnlineUsersContext";
import { MessageMenuProvider } from "../context/MessageMenuContext";
import { useAuth } from "../context/AuthProvider";

function sortConversations(convs) {
  return [...convs].sort((a, b) => {
    const aUnread = (a.unreadCount ?? 0) > 0 ? 1 : 0;
    const bUnread = (b.unreadCount ?? 0) > 0 ? 1 : 0;
    if (bUnread !== aUnread) return bUnread - aUnread;
    return (
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
  });
}

function Home() {
  const [ActiveChat, SetActiveChat] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [mobileView, setMobileView] = useState("list"); // 'list' | 'chat'
  const activeChatIdRef = useRef(null);
  const defaultTitleRef = useRef(document.title || "Chat");
  const titleIntervalRef = useRef(null);
  const hiddenUnreadCountRef = useRef(0);

  const queryClient = useQueryClient();
  // const [onlineUsers, setOnlineUsers] = useState([]);
  const location = useLocation();
  const newConnection = useSignalRContext();
  const { state, dispatch } = useOnlineUsers();
  const { user } = useAuth();

  const urlPath = location.pathname;
  const isHome = urlPath === "/home";

  function stopTitleNotification(resetCounter = true) {
    if (titleIntervalRef.current) {
      clearInterval(titleIntervalRef.current);
      titleIntervalRef.current = null;
    }

    document.title = defaultTitleRef.current;

    if (resetCounter) hiddenUnreadCountRef.current = 0;
  }

  function startTitleNotification() {
    if (titleIntervalRef.current) return;

    let showAlertTitle = true;

    titleIntervalRef.current = setInterval(() => {
      const count = hiddenUnreadCountRef.current;
      const alertTitle =
        count > 1 ? `(${count}) New messages` : "(1) New message";

      document.title = showAlertTitle ? alertTitle : defaultTitleRef.current;
      showAlertTitle = !showAlertTitle;
    }, 1000);
  }

  useEffect(() => {
    const onTabVisible = () => {
      if (document.hidden) return;
      stopTitleNotification(true);
    };

    document.addEventListener("visibilitychange", onTabVisible);
    window.addEventListener("focus", onTabVisible);

    return () => {
      document.removeEventListener("visibilitychange", onTabVisible);
      window.removeEventListener("focus", onTabVisible);
      stopTitleNotification(true);
    };
  }, []);

  // 1️⃣ Effect for stable event handlers (runs once)
  useEffect(() => {
    if (!newConnection) return;

    if (newConnection.state === "Disconnected") return;

    const handleReceivePrivateMessage = (messageOrSender, maybeMessage) => {
      const incomingMessage = messageOrSender?.id
        ? messageOrSender
        : maybeMessage;

      const convId = incomingMessage?.conversationId;

      if (!convId) {
        // No conversation id on the payload — fall back to a full refetch
        queryClient.invalidateQueries({ queryKey: ["Conversations"] });
        return;
      }

      const isActiveChat = Number(activeChatIdRef.current) === Number(convId);
      const isIncomingFromMe =
        Number(incomingMessage?.senderId) === Number(user?.sub);

      const currentData = queryClient.getQueryData(["Conversations"]);
      if (!Array.isArray(currentData)) {
        queryClient.invalidateQueries({ queryKey: ["Conversations"] });
        return;
      }

      const convExists = currentData.some(
        (c) => Number(c.id) === Number(convId),
      );
      if (!convExists) {
        // New conversation not yet in cache — do a full refetch
        queryClient.invalidateQueries({ queryKey: ["Conversations"] });
        return;
      }

      queryClient.setQueryData(["Conversations"], (old) => {
        if (!Array.isArray(old)) return old;

        const updated = old.map((conv) => {
          if (Number(conv.id) !== Number(convId)) return conv;
          return {
            ...conv,
            isRead: isActiveChat,
            unreadCount: isActiveChat ? 0 : (conv.unreadCount ?? 0) + 1,
            lastMessage: incomingMessage?.messageContent ?? conv.lastMessage,
            lastMessageAt: incomingMessage?.createdAt ?? conv.lastMessageAt,
          };
        });

        return sortConversations(updated);
      });

      if (document.hidden && !isActiveChat && !isIncomingFromMe) {
        hiddenUnreadCountRef.current += 1;
        startTitleNotification();
      }
    };

    newConnection.on("ReceiveMessage", (message) => {
      console.log(message);
    });

    newConnection.on("ReceivePrivateMessage", handleReceivePrivateMessage);

    newConnection.on("UserStatusChanged", (online_users) => {
      dispatch({ type: "SET_INITIAL_STATE", payload: online_users });
    });

    newConnection.on("newOnlineUser", (newOnlineUser) => {
      console.log(">>>", newOnlineUser);
      dispatch({ type: "ADD_NEW_USER", payload: newOnlineUser });
    });

    newConnection.on("JoinedRoom", (roomId) => {
      console.log("JOINED ROOM", roomId);
      setRoomId(roomId);
    });

    newConnection.on("UserWentOffline", (offlineUser) => {
      dispatch({ type: "USER_WENT_OFLINE", payload: offlineUser });
    });

    newConnection.on("GroupChatCreated", (data) => {
      console.log("New group Chat created>>>", data);
      queryClient.invalidateQueries({ queryKey: ["Conversations"] });
    });

    return () => {
      newConnection.off("ReceiveMessage");
      newConnection.off("ReceivePrivateMessage", handleReceivePrivateMessage);
      newConnection.off("JoinedRoom");
      newConnection.off("UserStatusChanged");
      newConnection.off("newOnlineUser");
      newConnection.off("GroupChatCreated");
    };
  }, [newConnection, dispatch, queryClient, user?.sub]);

  // 2️⃣ Effect just for joining chats (depends on ActiveChat)
  useEffect(() => {
    if (!newConnection || newConnection.state === "Disconnected") return;

    if (ActiveChat) {
      const conversationId = ActiveChat.id;
      newConnection
        .invoke("JoinPrivateChat", conversationId)
        .catch(console.error);
    }
  }, [ActiveChat, newConnection]);

  useEffect(() => {
    activeChatIdRef.current = ActiveChat?.id ?? null;
    if (ActiveChat) {
      setRoomId(null); // reset old roomId before joining new one
    }
  }, [ActiveChat]);

  if (newConnection == null) return;

  function handleSetActiveChat(chat) {
    SetActiveChat(chat);
    setMobileView("chat");
  }

  const chatPanel =
    ActiveChat && roomId && isHome ? (
      <MessageMenuProvider>
        <Chat
          conversation={ActiveChat}
          currentOpenConversationId={ActiveChat.id}
          isOnline={state.some(
            (user) => user.displayName === ActiveChat.displayName,
          )}
          onBack={() => setMobileView("list")}
        />
      </MessageMenuProvider>
    ) : (
      <Outlet />
    );

  return (
    <div className="h-[100dvh] bg-gray-900 text-white overflow-hidden flex flex-col lg:flex-row">
      {/* LeftSideBar: renders at bottom on mobile (order-last), left on desktop (lg:order-first) */}
      <div className="order-last lg:order-first flex-shrink-0">
        <LeftSideBar />
      </div>

      {/* Main content area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        {/* Conversation list — hidden on mobile when chat is open */}
        <div
          className={`${
            mobileView === "chat" ? "hidden lg:flex" : "flex"
          } flex-col flex-1 lg:flex-none lg:w-[22rem] border-r-2 border-myGray`}
        >
          <MessagesList
            setActiveChat={handleSetActiveChat}
            onlineUsers={state}
          />
        </div>

        {/* Chat / outlet — hidden on mobile when list is shown */}
        <div
          className={`${
            mobileView === "list" ? "hidden lg:flex" : "flex"
          } flex-col flex-1`}
        >
          {chatPanel}
        </div>
      </div>
    </div>
  );
}

export default Home;
