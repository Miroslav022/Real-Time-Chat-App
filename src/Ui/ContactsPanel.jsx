import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { MdOutlineMoreVert } from "react-icons/md";
import { IoChatbubbleOutline } from "react-icons/io5";
import { MdOutlinePersonRemove } from "react-icons/md";
import { MdBlock } from "react-icons/md";
import { MdOutlineLockOpen } from "react-icons/md";
import { useContacts } from "../features/Contacts/useContacts";
import { useRemoveContact } from "../features/Contacts/useRemoveContact";
import { useBlockUser } from "../features/user/useBlockUser";
import { useUnblockUser } from "../features/user/useUnblockUser";
import { useConversation } from "../features/useConversation";
import { useAuth } from "../context/AuthProvider";
import { useFetchConversations } from "../features/useFetchConversations";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import Spinner from "./Spinner";

function ContactsPanel({ onOpenChat, activeChat, onCloseChat }) {
  const { contacts, isLoading } = useContacts();
  const { removeContactMutation } = useRemoveContact();
  const { blockUserMutation } = useBlockUser();
  const { UnblockUserMutation } = useUnblockUser();
  const { createConversation } = useConversation();
  const { user } = useAuth();
  const { conversations } = useFetchConversations(user?.sub);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [search, setSearch] = useState("");
  const [blockedOverrides, setBlockedOverrides] = useState({}); // userId -> bool
  const menuRef = useRef(null);

  useOnClickOutside(menuRef, () => setOpenMenuId(null));

  const filtered = contacts.filter((c) =>
    (c.name || c.userName || "").toLowerCase().includes(search.toLowerCase()),
  );

  function findOrCreateConversation(contact) {
    const existing = conversations?.find(
      (conv) =>
        !conv.isGroup &&
        conv.participants?.some((p) => Number(p.id) === Number(contact.userId)),
    );
    if (existing) {
      onOpenChat(existing);
    } else {
      createConversation(
        { createdBy: user?.sub, userId: contact.userId },
        {
          onSuccess: (res) => {
            if (res?.data?.value) onOpenChat(res.data.value);
          },
        },
      );
    }
    setOpenMenuId(null);
  }

  function handleBlock(contact) {
    blockUserMutation({
      BlockedUserId: Number(contact.userId),
      userId: Number(user?.sub),
    });
    setBlockedOverrides((prev) => ({ ...prev, [contact.userId]: true }));
    setOpenMenuId(null);

    const isActiveChatWithUser =
      activeChat &&
      !activeChat.isGroup &&
      activeChat.participants?.some(
        (p) => Number(p.id) === Number(contact.userId),
      );
    if (isActiveChatWithUser) onCloseChat?.();
  }

  function handleUnblock(contact) {
    UnblockUserMutation({
      BlockedUserId: Number(contact.userId),
      userId: Number(user?.sub),
    });
    setBlockedOverrides((prev) => ({ ...prev, [contact.userId]: false }));
    setOpenMenuId(null);
  }

  function handleRemove(contact) {
    removeContactMutation(contact.userId);
    setOpenMenuId(null);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-myGray flex-shrink-0">
        <h2 className="text-lg font-semibold text-white mb-3">Contacts</h2>
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-myBgBlue text-white placeholder-iconsGray text-sm focus:outline-none focus:ring-1 focus:ring-myLightBlue"
        />
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-iconsGray text-center mt-10 text-sm">
            {search ? "No contacts match your search." : "No contacts yet."}
          </p>
        ) : (
          filtered.map((contact) => (
            <div
              key={contact.userId}
              className="relative flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
                <img
                  src={`https://localhost:7257/Uploads/${contact.profilePicture}`}
                  onError={(e) => {
                    e.currentTarget.src = "/avatar.jpg";
                  }}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => findOrCreateConversation(contact)}
              >
                <p className="text-white font-medium truncate">
                  {contact.username}
                </p>
                <p className="text-iconsGray text-sm truncate">
                  {contact.phoneNumber}
                </p>
              </div>

              {/* Action menu trigger */}
              <button
                className="text-iconsGray hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(
                    openMenuId === contact.userId ? null : contact.userId,
                  );
                }}
              >
                <MdOutlineMoreVert size={20} />
              </button>

              {/* Dropdown menu */}
              {openMenuId === contact.userId && (
                <div
                  ref={menuRef}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="absolute right-4 top-[3.5rem] z-50 min-w-[160px] rounded-xl shadow-lg overflow-hidden"
                  style={{
                    backgroundColor: "rgba(37, 43, 46, 0.95)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                >
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                    onClick={() => findOrCreateConversation(contact)}
                  >
                    <IoChatbubbleOutline size={16} />
                    Open Chat
                  </button>

                  {(
                    contact.userId in blockedOverrides
                      ? blockedOverrides[contact.userId]
                      : contact.isBlocked
                  ) ? (
                    <button
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-green-400 hover:bg-white/10 transition-colors"
                      onClick={() => handleUnblock(contact)}
                    >
                      <MdOutlineLockOpen size={16} />
                      Unblock
                    </button>
                  ) : (
                    <button
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-yellow-400 hover:bg-white/10 transition-colors"
                      onClick={() => handleBlock(contact)}
                    >
                      <MdBlock size={16} />
                      Block
                    </button>
                  )}

                  <button
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-colors"
                    onClick={() => handleRemove(contact)}
                  >
                    <MdOutlinePersonRemove size={16} />
                    Remove Contact
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

ContactsPanel.propTypes = {
  onOpenChat: PropTypes.func.isRequired,
  activeChat: PropTypes.object,
  onCloseChat: PropTypes.func,
};

export default ContactsPanel;
