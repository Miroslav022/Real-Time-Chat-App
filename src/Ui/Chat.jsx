import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import ProfileImage from "./ProfileImage";

function Chat() {
  return (
    <div className="bg-gray-900 border-myGray ">
      <div className="border-b-2 border-myGray">
        <div className="p-4 flex justify-between">
          <div className="flex gap-5">
            <ProfileImage />
            <div>
              <span className="block font-medium">Michael</span>
              <span className="block text-sm text-myLightBlue">Typing...</span>
            </div>
          </div>
          <div className="border-2 border-myGray w-[3rem] h-[3rem] flex items-center justify-center rounded-full ml-auto">
            <PiDotsThreeOutlineVertical size={20} />
          </div>
        </div>
      </div>
      <div className="bg-myBgDark"></div>
    </div>
  );
}

export default Chat;
