import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import ProfileImage from "./ProfileImage";
// import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { IoPersonAddSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import AddContact from "./AddContact";
import ChatCard from "./ChatCard";
import { useFetchConversations } from "../features/useFetchConversations";
import DropDownSettings from "./DropDownSettings";
import { useNavigate } from "react-router-dom";
import QuickMenu from "./QuickMenu";
import OnlineUser from "./OnlineUser";
import CreateGroupModal from "./CreateGroupModal";
import { useAuth } from "../context/AuthProvider";
import { useContacts } from "../features/Contacts/useContacts";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchConversations } from "../features/useSearchConversations";

function MessagesList({ setActiveChat, onlineUsers }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingDropDownOpen, setIsSettingsDropDownOpen] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const navigation = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  // const { data } = useQuery({
  //   queryKey: ["currentUser"],
  // });
  const { contacts } = useContacts();
  const { conversations } = useFetchConversations(user?.sub);
  const { conversations: searchedConversations, isSearchingConversations } =
    useSearchConversations(debouncedSearchTerm);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const isSearchMode = searchTerm.trim().length > 0;
  const displayedConversations = isSearchMode
    ? searchedConversations
    : conversations;

  const totalUnread =
    conversations?.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0) ?? 0;

  console.log("OnlineUsers>>>", onlineUsers);

  function SelectChat(chat) {
    console.log("user>>>", chat);

    queryClient.setQueryData(["Conversations"], (oldConversations) => {
      if (!Array.isArray(oldConversations)) return oldConversations;

      return oldConversations.map((conversation) =>
        Number(conversation.id) === Number(chat.id)
          ? { ...conversation, isRead: true, unreadCount: 0 }
          : conversation,
      );
    });

    setActiveChat({ ...chat, isRead: true, unreadCount: 0 });
    navigation("/home");
  }

  function handleGroupSubmit(data) {
    console.log("Group Created:", data);
    // Call your API here
  }

  function handleIsOnline(chat) {
    //Check this!!!
    return (
      !chat.isGroup &&
      onlineUsers.some((x) => x.userId === chat.participants[0].id)
    );
  }

  return (
    <div className="bg-gray-850 flex flex-col h-full overflow-hidden">
      <div className="flex gap-5 p-4 items-center border-b-2 border-myGray">
        <ProfileImage fileName={user?.picture} />
        <div>
          <h2 className="font-medium">{user?.unique_name}</h2>
          <span className="text-iconsGray text-sm">My Account</span>
        </div>
        <div className="relative ml-auto cursor-pointer">
          <div
            className="border-2 border-myGray w-[3rem] h-[3rem] flex items-center justify-center rounded-full"
            onClick={() => setIsSettingsDropDownOpen(!isSettingDropDownOpen)}
          >
            <PiDotsThreeOutlineVertical size={20} />
          </div>
          {isSettingDropDownOpen && (
            <DropDownSettings>
              <QuickMenu handleIsModalOpen={setIsSettingsDropDownOpen} />
            </DropDownSettings>
          )}
        </div>
      </div>

      <div className="pl-4 pr-4 pt-4">
        <label className="input input-bordered bg-inputBg border-inpurBorder rounded-xl flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search or start new chat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>

      <div className="pl-4 pr-4 pt-4">
        <h2 className="font-medium text-xl">Online now</h2>
        <div className="flex gap-5 overflow-x-scroll pt-4">
          {onlineUsers.map(
            (user) =>
              !user.isBlocked && (
                <OnlineUser
                  user={user}
                  SelectChat={SelectChat}
                  key={user.userId}
                />
              ),
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5 flex-grow overflow-y-auto min-h-0">
        <div className="flex justify-between h-12 items-center gap-2 pl-4 pr-4 pt-4">
          <h2 className="font-medium flex items-center gap-2 text-xl">
            Messages
            {totalUnread > 0 && (
              <span className="bg-myLightBlue text-xs font-bold rounded-xl min-w-[1.5rem] h-5 text-center flex items-center justify-center px-1">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </h2>
          <div
            className={`bg-inpurBorder w-7 h-7 flex items-center justify-center rounded-full ${
              contacts?.length > 0
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-40"
            }`}
            onClick={() =>
              contacts?.length > 0 && setShowCreateGroupModal(true)
            }
            title={
              contacts?.length === 0
                ? "Add contacts first to create a group"
                : "Create group"
            }
          >
            <p>+</p>
          </div>
        </div>
        <div className="flex flex-col">
          {displayedConversations?.length > 0 ? (
            displayedConversations.map((chat) => (
              <ChatCard
                SelectChat={SelectChat}
                key={chat.id}
                chatInfo={chat}
                isOnline={handleIsOnline(chat)}
              />
            ))
          ) : isSearchMode && !isSearchingConversations ? (
            <p className="text-center pt-4">No conversations found</p>
          ) : isSearchMode && isSearchingConversations ? (
            <p className="text-center pt-4">Searching...</p>
          ) : (
            <p className="text-center pt-4">Start a conversation</p>
          )}
        </div>
      </div>
      <div
        className="ml-3 mb-3 bg-myLightBlue w-[3.5rem] h-[3.5rem] rounded-full flex items-center justify-center cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <IoPersonAddSharp className="text-xl" />
      </div>
      {showCreateGroupModal && (
        <CreateGroupModal
          onClose={() => setShowCreateGroupModal(false)}
          onSubmit={handleGroupSubmit}
        />
      )}
      <AddContact isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
}

MessagesList.propTypes = {
  setActiveChat: PropTypes.func,
  onlineUsers: PropTypes.array,
};

export default MessagesList;
