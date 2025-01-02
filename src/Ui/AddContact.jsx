import PropTypes from "prop-types";
import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import UserSearchCard from "./UserSearchCard";
import { useConversation } from "../features/useConversation";
import { useDispatch } from "react-redux";
import { addNewConversation } from "../features/chat/ChatSlice";
import { useQuery } from "@tanstack/react-query";

function AddContact({ isOpen, setIsOpen }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const { createConversation } = useConversation();
  const { data } = useQuery({
    queryKey: ["currentUser"],
  });
  const dispatch = useDispatch();

  function onCreateConversation(user) {
    const conversationData = {
      groupName: null,
      isGroup: false,
      lastMessageAt: null,
      userId: user.id,
      isAdmin: true,
      senderId: 0,
      isRead: false,
      lastMessage: "",
      username: user.userName,
    };
    createConversation({ createdBy: data.id, userId: user.id });
    dispatch(addNewConversation(conversationData));
    setIsOpen(false);
    setUsers([]);
  }

  async function searchUsers() {
    if (search.length < 4) {
      setUsers([]);
      return;
    }
    const { data } = await axiosInstance.get(`/User/Search/${search}`);
    setUsers(data);
  }
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 bg-[rgba(255,255,255,0.1)]">
          <div className="bg-white w-full bg-myBgBlue max-w-md p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Search Users
              </h2>
              <button
                className="text-myBlue hover:text-myBlue focus:outline-none"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setUsers([]);
                  setSearch("");
                }}
              >
                ✖
              </button>
            </div>
            <div className="mt-4">
              <input
                defaultValue={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  searchUsers();
                }}
                type="text"
                placeholder="Search by phone..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="mt-4 max-h-60 overflow-y-auto">
              {users.map((user) => (
                <UserSearchCard
                  user={user}
                  key={user.id}
                  onCreateConversation={() => onCreateConversation(user)}
                />
              ))}
              {search.length === 0 && (
                <p className="text-gray-600 text-center">
                  Search user by phone number.
                </p>
              )}
              {users.length === 0 && search.length > 5 && (
                <p className="text-gray-600 text-center">No users found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

AddContact.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
};

export default AddContact;