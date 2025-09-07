import PropTypes from "prop-types";
import ProfileImage from "./ProfileImage";

function OnlineUser({ user, SelectChat }) {
  return (
    <div
      className="text-center cursor-pointer"
      onClick={() => SelectChat(user)}
    >
      <ProfileImage fileName={user.displayImage} />
      <span className="block mt-3 text-iconsGray font-medium text-[0.9rem]">
        {user.displayName}
      </span>
    </div>
  );
}

OnlineUser.propTypes = {
  user: PropTypes.object,
  SelectChat: PropTypes.func,
};

export default OnlineUser;
