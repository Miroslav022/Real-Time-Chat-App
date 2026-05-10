import { CiBookmarkMinus } from "react-icons/ci";
import { IoMdChatbubbles } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineGroup } from "react-icons/md";
function LeftSideBar() {
  return (
    <div className="bg-gray-800 border-t-2 lg:border-t-0 lg:border-r-2 border-myGray flex flex-row lg:flex-col items-center justify-around lg:justify-center gap-0 lg:gap-10 p-2 lg:p-4 h-16 lg:h-full w-full lg:w-24">
      <div className="icon-style active p-2 lg:p-4">
        <IoMdChatbubbles size={28} />
      </div>
      <div className="icon-style p-2 lg:p-4">
        <MdOutlineGroup size={28} />
      </div>

      <div className="icon-style p-2 lg:p-4">
        {" "}
        <CiBookmarkMinus size={28} />
      </div>

      <div className="icon-style p-2 lg:p-4">
        <IoSettingsOutline size={28} />
      </div>
    </div>
  );
}

export default LeftSideBar;
