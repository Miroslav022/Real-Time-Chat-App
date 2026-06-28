import PropTypes from "prop-types";
import { useRef } from "react";
import { useBlockUser } from "../features/user/useBlockUser";
import { useOnlineUsers } from "../context/OnlineUsersContext";
import { useUpdateGroupImage } from "../features/Conversations/useUpdateGroupImage";

function QuickUserMenu({
  currentUser,
  blockUserId,
  handleIsBlockedState,
  handleIsOpen,
  isGroup,
  conversationId,
  onGroupDetails,
}) {
  const { blockUserMutation } = useBlockUser();
  const { dispatch } = useOnlineUsers();
  const { updateGroupImageMutation, isUpdatingGroupImage } =
    useUpdateGroupImage();
  const fileInputRef = useRef(null);

  async function handleUserBlock() {
    await blockUserMutation(
      {
        BlockedUserId: parseInt(blockUserId),
        userId: parseInt(currentUser),
      },
      {
        onSuccess: () => {
          handleIsBlockedState(true);
          handleIsOpen(false);
          dispatch({ type: "REMOVE_USER_FROM_LIST", payload: blockUserId });
        },
      },
    );
  }

  function handleGroupImageClick() {
    fileInputRef.current?.click();
  }

  function handleGroupImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("groupImage", file);

    updateGroupImageMutation(
      { conversationId, formData },
      {
        onSuccess: () => handleIsOpen(false),
      },
    );

    e.target.value = "";
  }

  if (isGroup) {
    return (
      <>
        <ul>
          <li
            className="flex items-center gap-2 p-2 mb-1 hover:bg-myBgBlue rounded-[0.7rem] cursor-pointer"
            onClick={onGroupDetails}
          >
            Group Details
          </li>
          <li
            className="flex items-center gap-2 p-2 hover:bg-myBgBlue rounded-[0.7rem] cursor-pointer"
            onClick={handleGroupImageClick}
          >
            {isUpdatingGroupImage ? "Updating..." : "Update Image"}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleGroupImageChange}
            />
          </li>
        </ul>
      </>
    );
  }

  return (
    <ul>
      <li
        className="flex items-center gap-2 p-2 mb-2 hover:bg-myBgBlue rounded-[0.7rem]"
        onClick={handleUserBlock}
      >
        Block
      </li>
    </ul>
  );
}

QuickUserMenu.propTypes = {
  handleIsOpen: PropTypes.func,
  currentUser: PropTypes.number,
  blockUserId: PropTypes.number,
  handleIsBlockedState: PropTypes.func,
  isGroup: PropTypes.bool,
  conversationId: PropTypes.number,
  onGroupDetails: PropTypes.func,
};

export default QuickUserMenu;
