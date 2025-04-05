import { IoAlertCircleSharp } from "react-icons/io5";
import { useUnblockUser } from "../features/user/useUnblockUser";
import PropTypes from "prop-types";

const BlockedUserAlert = ({
  participantId,
  currentUserId,
  handleIsBlockedState,
}) => {
  const { UnblockUserMutation } = useUnblockUser();

  function unblockHandler() {
    UnblockUserMutation(
      {
        userId: currentUserId,
        blockedUserId: participantId,
      },
      { onSuccess: () => handleIsBlockedState(false) }
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-white dark:bg-gray-800">
        <IoAlertCircleSharp className="text-error" size={50} />
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            User is blocked
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            You can’t send messages to this contact.
          </p>
          <button
            className="btn btn-primary border-myLightBlue bg-myLightBlue mt-4 text-lg"
            onClick={unblockHandler}
          >
            Unblock user
          </button>
        </div>
      </div>
    </div>
  );
};

BlockedUserAlert.propTypes = {
  participantId: PropTypes.number,
  currentUserId: PropTypes.number,
  handleIsBlockedState: PropTypes.func,
};

export default BlockedUserAlert;
