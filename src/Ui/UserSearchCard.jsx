import PropTypes from "prop-types";
import { IoPersonAdd } from "react-icons/io5";
// import { useConversation } from "../features/useConversation";
// import { useQuery } from "@tanstack/react-query";

function UserSearchCard({ user, onCreateConversation }) {
  return (
    <div
      className="group flex justify-between items-center p-3 hover:bg-textGray rounded-lg cursor-pointer"
      onClick={onCreateConversation}
    >
      <div className="flex items-center">
        <img
          src="../public/avatar.jpg"
          alt="asda"
          className="w-10 h-10 rounded-full mr-4"
        />
        <div>
          <p className="text-gray-800 font-medium">{user.userName}</p>
          <p className="text-gray-600 text-sm">{user.phoneNumber}</p>
        </div>
      </div>
      <IoPersonAdd className="text-xl hidden group-hover:block" />
    </div>
  );
}

UserSearchCard.propTypes = {
  user: PropTypes.object,
  onCreateConversation: PropTypes.func,
};

export default UserSearchCard;
