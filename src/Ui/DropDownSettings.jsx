import { CiLogout } from "react-icons/ci";
import { FaUserEdit } from "react-icons/fa";
import { useLogout } from "../features/Auth/useLogout";
import { useSignalRContext } from "../context/SignalRContext";

function DropDownSettings() {
  const { logout, isLoading } = useLogout();
  const connection = useSignalRContext();

  function onClickLogout() {
    try {
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
        <li className="flex items-center gap-2 p-2 mb-2 hover:bg-myBgBlue rounded-[0.7rem]">
          <FaUserEdit />
          Edit Account
        </li>
      </ul>
    </div>
  );
}

export default DropDownSettings;
