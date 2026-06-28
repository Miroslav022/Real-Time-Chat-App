import PropTypes from "prop-types";
import { useRef } from "react";
import { IoClose } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi2";
import { MdAccessTime } from "react-icons/md";
import { IoChatbubbleEllipses } from "react-icons/io5";
import ProfileImage from "./ProfileImage";
import { useOnlineUsers } from "../context/OnlineUsersContext";

function buildImageSrc(fileName) {
  if (!fileName) return "/avatar.jpg";
  if (fileName.startsWith("/")) return `https://localhost:7257${fileName}`;
  return `https://localhost:7257/Uploads/${fileName}`;
}

function formatLastActive(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function GroupDetailsModal({ conversation, onClose }) {
  const overlayRef = useRef(null);
  const participants = conversation?.participants ?? [];
  const imageSrc = buildImageSrc(conversation?.displayImage);
  const { state: onlineUsers } = useOnlineUsers();

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-myBgBlue shadow-2xl overflow-hidden">
        {/* Close */}
        <button
          className="absolute right-3 top-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <IoClose size={18} />
        </button>

        {/* Banner with blurred bg */}
        <div className="relative h-32 overflow-hidden">
          <img
            src={imageSrc}
            onError={(e) => {
              e.currentTarget.src = "/avatar.jpg";
            }}
            className="w-full h-full object-cover scale-110"
            alt=""
          />
          <div className="absolute inset-0 bg-myBgDark/60 backdrop-blur-[2px]" />
        </div>

        {/* Avatar overlapping the banner */}
        <div className="flex justify-center -mt-10 mb-3 relative z-10">
          <div className="w-20 h-20 rounded-full ring-4 ring-myBgBlue overflow-hidden shadow-xl">
            <img
              src={imageSrc}
              onError={(e) => {
                e.currentTarget.src = "/avatar.jpg";
              }}
              className="w-full h-full object-cover"
              alt="group avatar"
            />
          </div>
        </div>

        {/* Name & subtitle */}
        <div className="flex flex-col items-center gap-1 px-6 mb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {conversation?.displayName}
          </h2>
          <span className="text-sm text-iconsGray">Group Chat</span>
        </div>

        {/* Stats strip */}
        <div className="flex justify-center gap-3 px-6 mb-5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-myGray text-sm text-white">
            <HiUserGroup size={15} className="text-myLightBlue" />
            {participants.length} member{participants.length !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-myGray text-sm text-white">
            <MdAccessTime size={15} className="text-myLightBlue" />
            {formatLastActive(conversation?.lastMessageAt)}
          </div>
        </div>

        {/* Last message preview */}
        {conversation?.lastMessage && (
          <div className="mx-5 mb-5 flex items-start gap-3 rounded-xl bg-myBgDark border border-myGray p-3">
            <IoChatbubbleEllipses
              size={18}
              className="text-myLightBlue mt-0.5 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs text-iconsGray mb-0.5">Last message</p>
              <p className="text-sm text-white truncate">
                {conversation.lastMessage}
              </p>
            </div>
          </div>
        )}

        {/* Divider + members heading */}
        <div className="flex items-center gap-3 px-5 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-iconsGray">
            Members
          </span>
          <div className="flex-1 h-px bg-myGray" />
        </div>

        {/* Members list */}
        <div className="flex flex-col gap-1 px-3 pb-4 max-h-52 overflow-y-auto">
          {participants.map((p) => {
            const isOnline = onlineUsers.some((u) => u.userId === p.id);
            return (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-myGray transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <ProfileImage
                    fileName={
                      p.profilePicture ?? p.profileImage ?? p.displayImage
                    }
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-myBgBlue" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {p.userName ?? p.displayName ?? p.phoneNumber ?? "Unknown"}
                  </p>
                  <p className="text-xs truncate">
                    {isOnline ? (
                      <span className="text-green-400">Online</span>
                    ) : p.phoneNumber ? (
                      <span className="text-iconsGray">{p.phoneNumber}</span>
                    ) : null}
                  </p>
                </div>
                {p.isBlocked && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-900/50 text-red-400 flex-shrink-0">
                    Blocked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

GroupDetailsModal.propTypes = {
  conversation: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GroupDetailsModal;
