import { CiBookmarkMinus } from "react-icons/ci";
import { IoMdChatbubbles } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineGroup } from "react-icons/md";
function LeftSideBar() {
  return (
    <div className="bg-gray-800 p-4 flex flex-col items-center justify-center gap-10 border-r-2 border-myGray">
      <div className="icon-style">
        <IoMdChatbubbles size={35} />
      </div>
      <div className="icon-style">
        <MdOutlineGroup size={35} />
      </div>

      <div className="icon-style">
        {" "}
        <CiBookmarkMinus size={35} />
      </div>

      <div className="icon-style">
        <IoSettingsOutline size={35} />
      </div>
    </div>
  );
}

export default LeftSideBar;
