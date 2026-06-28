import { useEffect, useRef, useState } from "react";
import Chat from "../Ui/Chat";
import Spinner from "../Ui/Spinner";
import LeftSideBar from "../Ui/LeftSideBar";
import MessagesList from "../Ui/MessagesList";
import ContactsPanel from "../Ui/ContactsPanel";
import SettingsPage from "../Ui/SettingsPage";
import { useQueryClient } from "@tanstack/react-query";
import { useSignalRContext } from "../context/SignalRContext";
import { Outlet, useLocation } from "react-router-dom";
import { useOnlineUsers } from "../context/OnlineUsersContext";
import { MessageMenuProvider } from "../context/MessageMenuContext";
import { useAuth } from "../context/AuthProvider";
import { useFetchConversations } from "../features/useFetchConversations";
import { useSettingsRef } from "../context/SettingsContext";
import notificationSound from "../assets/universfield-new-notification-09-352705.mp3";

function playNotificationSound() {
  try {
    const audio = new Audio(notificationSound);
    audio.play();
  } catch {
    // Audio not supported
  }
}

function showDesktopNotification(message) {
  if (Notification.permission !== "granted") return;
  try {
    new Notification(message.senderUserName ?? "New message", {
      body: message.messageContent ?? "You have a new message",
      icon: "/favicon.ico",
      silent: true,
    });
  } catch {
    // Notification not supported
  }
}

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
  const [activeView, setActiveView] = useState("chats"); // 'chats' | 'contacts'
  const activeChatIdRef = useRef(null);
  const defaultTitleRef = useRef(document.title || "Chat");
  const titleIntervalRef = useRef(null);
  const hiddenUnreadCountRef = useRef(0);

  const queryClient = useQueryClient();
  const { conversations } = useFetchConversations();
  // const [onlineUsers, setOnlineUsers] = useState([]);
  const location = useLocation();
  const newConnection = useSignalRContext();
  const { state, dispatch } = useOnlineUsers();
  const { user } = useAuth();
  const settingsRef = useSettingsRef();

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

      if (!isIncomingFromMe && settingsRef.current.messageSounds) {
        playNotificationSound();
      }

      if (document.hidden && !isActiveChat && !isIncomingFromMe) {
        hiddenUnreadCountRef.current += 1;
        startTitleNotification();
        if (settingsRef.current.desktopNotifications) {
          showDesktopNotification(incomingMessage);
        }
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

    newConnection.onreconnected(() => {
      setRoomId(null);
      if (activeChatIdRef.current) {
        newConnection
          .invoke("JoinPrivateChat", activeChatIdRef.current)
          .catch(console.error);
      }
    });

    return () => {
      newConnection.off("ReceiveMessage");
      newConnection.off("ReceivePrivateMessage", handleReceivePrivateMessage);
      newConnection.off("JoinedRoom");
      newConnection.off("UserStatusChanged");
      newConnection.off("newOnlineUser");
      newConnection.off("UserWentOffline");
      newConnection.off("GroupChatCreated");
      newConnection.onreconnected(null);
    };
  }, [newConnection, dispatch, queryClient, user?.sub]);

  // 2️⃣ Effect just for joining chats (depends on ActiveChat)
  useEffect(() => {
    if (!newConnection || newConnection.state !== "Connected") return;

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

  // On mobile, show the right panel whenever we navigate away from /home
  useEffect(() => {
    if (!isHome) {
      setMobileView("chat");
      setActiveView("chats");
    } else if (!ActiveChat) {
      setMobileView("list");
    }
  }, [isHome, ActiveChat]);

  if (newConnection == null) return;

  function handleSetActiveChat(chat) {
    SetActiveChat(chat);
    setMobileView("chat");
  }

  const liveActiveChat =
    ActiveChat && conversations
      ? (conversations.find((c) => Number(c.id) === Number(ActiveChat.id)) ??
        ActiveChat)
      : ActiveChat;

  const chatPanel =
    liveActiveChat && roomId && isHome ? (
      <MessageMenuProvider>
        <Chat
          conversation={liveActiveChat}
          currentOpenConversationId={liveActiveChat.id}
          isOnline={state.some(
            (user) => user.displayName === liveActiveChat.displayName,
          )}
          onBack={() => {
            SetActiveChat(null);
            setMobileView("list");
          }}
        />
      </MessageMenuProvider>
    ) : liveActiveChat && !roomId && isHome ? (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    ) : (
      <Outlet />
    );

  return (
    <div className="h-[100dvh] bg-gray-900 text-white overflow-hidden flex flex-col lg:flex-row">
      {/* LeftSideBar: renders at bottom on mobile (order-last), left on desktop (lg:order-first) */}
      <div className="order-last lg:order-first flex-shrink-0">
        <LeftSideBar
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view);
            if (view === "settings") setMobileView("list");
          }}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        {/* Left panel — hidden on mobile when chat is open */}
        <div
          className={`${
            mobileView === "chat" ? "hidden lg:flex" : "flex"
          } flex-col flex-1 min-h-0 lg:flex-none lg:w-[22rem] border-r-2 border-myGray`}
        >
          {activeView === "contacts" ? (
            <ContactsPanel
              onOpenChat={(conv) => {
                handleSetActiveChat(conv);
                setActiveView("chats");
              }}
              activeChat={ActiveChat}
              onCloseChat={() => {
                SetActiveChat(null);
                setMobileView("list");
              }}
            />
          ) : activeView === "settings" ? (
            <SettingsPage />
          ) : (
            <MessagesList
              setActiveChat={handleSetActiveChat}
              onlineUsers={state}
            />
          )}
        </div>

        {/* Chat / outlet — hidden on mobile when list is shown */}
        <div
          className={`${
            mobileView === "list" ? "hidden lg:flex" : "flex"
          } flex-col flex-1 min-h-0 overflow-hidden`}
        >
          {chatPanel}
        </div>
      </div>
    </div>
  );
}

export default Home;
