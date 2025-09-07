import PropTypes from "prop-types";
import { useBlockUser } from "../features/user/useBlockUser";
import { useOnlineUsers } from "../context/OnlineUsersContext";

function QuickUserMenu({
  currentUser,
  blockUserId,
  handleIsBlockedState,
  handleIsOpen,
}) {
  const { blockUserMutation } = useBlockUser();
  const { dispatch } = useOnlineUsers();
  async function handleUserBlock() {
    await blockUserMutation(
      {
        BlockedUserId: blockUserId,
        userId: currentUser,
      },
      {
        onSuccess: () => {
          handleIsBlockedState(true);
          handleIsOpen(false);
          dispatch({ type: "REMOVE_USER_FROM_LIST", payload: blockUserId });
        },
      }
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
};

export default QuickUserMenu;
