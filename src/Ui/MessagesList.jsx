import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import ProfileImage from "./ProfileImage";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { IoPersonAddSharp } from "react-icons/io5";
import { useState } from "react";
import AddContact from "./AddContact";
import ChatCard from "./ChatCard";
import { useFetchConversations } from "../features/useFetchConversations";
import DropDownSettings from "./DropDownSettings";

function MessagesList({ setActiveChat, onlineUsers }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingDropDownOpen, setIsSettingsDropDownOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ["currentUser"],
  });
  const { conversations } = useFetchConversations(data.id);

  function SelectChat(user) {
    setActiveChat(user);
  }

  return (
    <div className="bg-gray-850 border-r-2 border-myGray flex flex-col h-screen">
      <div className="flex gap-5 p-4 items-center border-b-2 border-myGray">
        <ProfileImage />
        <div>
          <h2 className="font-medium">{data.username}</h2>
          <span className="text-iconsGray text-sm">My Account</span>
        </div>
        <div className="relative ml-auto cursor-pointer">
          <div
            className="border-2 border-myGray w-[3rem] h-[3rem] flex items-center justify-center rounded-full"
            onClick={() => setIsSettingsDropDownOpen(!isSettingDropDownOpen)}
          >
            <PiDotsThreeOutlineVertical size={20} />
          </div>
          {isSettingDropDownOpen && <DropDownSettings />}
        </div>
      </div>

      <div className="pl-4 pr-4 pt-4">
        <label className="input input-bordered bg-inputBg border-inpurBorder rounded-xl flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search or start new chat..."
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
          {onlineUsers.map((user) => (
            <div
              key={user.userId}
              className="text-center cursor-pointer"
              onClick={() => SelectChat(user)}
            >
              <ProfileImage />
              <span className="block mt-3 text-iconsGray font-medium text-[0.9rem]">
                {user.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5 flex-grow overflow-y-auto">
        <h2 className="font-medium flex items-center gap-2 text-xl pl-4 pr-4 pt-4">
          Messages
          <span className="bg-myLightBlue text-sm rounded-xl w-6 text-center block">
            20
          </span>
        </h2>
        <div className="flex flex-col">
          {conversations?.length > 0 ? (
            conversations.map((chat) => (
              <ChatCard
                SelectChat={SelectChat}
                key={chat.userId}
                chatInfo={chat}
              />
            ))
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
      <AddContact isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
}

MessagesList.propTypes = {
  setActiveChat: PropTypes.func,
  onlineUsers: PropTypes.array,
};

export default MessagesList;
