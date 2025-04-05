import { CiLogout } from "react-icons/ci";
import { FaUserEdit } from "react-icons/fa";
import { useLogout } from "../features/Auth/useLogout";
import { useSignalRContext } from "../context/SignalRContext";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function DropDownSettings({ handleIsModalOpen }) {
  const { logout, isLoading } = useLogout();
  const connection = useSignalRContext();
  const navigate = useNavigate();

  function handleEditAccountClick(e) {
    e.preventDefault();
    handleIsModalOpen(false);
    navigate("edituser");
  }

  function onClickLogout() {
    try {
      handleIsModalOpen(false);
      logout();
      connection.stop();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="absolute bg-myGray p-3 top-[110%] rounded-[1rem] w-[10rem] text-md z-[9999]">
      <ul>
        <li
          className="flex items-center gap-2 p-2 mb-2 hover:bg-myBgBlue rounded-[0.7rem]"
          onClick={onClickLogout}
        >
          <CiLogout /> {isLoading ? "Logging out..." : "Logout"}
        </li>
        <li
          className="flex items-center gap-2 p-2 mb-2 hover:bg-myBgBlue rounded-[0.7rem]"
          onClick={handleEditAccountClick}
        >
          <FaUserEdit />
          Edit Account
        </li>
      </ul>
    </div>
  );
}

DropDownSettings.propTypes = {
  handleIsModalOpen: PropTypes.func,
};

export default DropDownSettings;
