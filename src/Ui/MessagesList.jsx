import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import ProfileImage from "./ProfileImage";

function MessagesList() {
  return (
    <div className="bg-gray-850 border-r-2 border-myGray flex flex-col h-screen">
      <div className="flex gap-5 p-4 items-center border-b-2 border-myGray">
        <ProfileImage />
        <div>
          <h2 className="font-medium">Miroslav Jandric</h2>
          <span className="text-iconsGray text-sm">My Account</span>
        </div>
        <div className="border-2 border-myGray w-[3rem] h-[3rem] flex items-center justify-center rounded-full ml-auto">
          <PiDotsThreeOutlineVertical size={20} />
        </div>
      </div>

      <div className="pl-4 pr-4 pt-4">
        <label className="input input-bordered bg-inputBg border-inpurBorder rounded-xl flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search or start new chat..."
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>

      <div className="pl-4 pr-4 pt-4">
        <h2 className="font-medium text-xl">Online now</h2>
        <div className="flex gap-5 overflow-x-scroll pt-4">
          {/* Online contacts go here */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="text-center">
              <ProfileImage />
              <span className="block mt-3 text-iconsGray font-medium text-[0.9rem]">
                John
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5 flex-grow overflow-y-auto pl-4 pr-4 pt-4">
        <h2 className="font-medium flex items-center gap-2 text-xl">
          Messages
          <span className="bg-myLightBlue text-sm rounded-xl w-6 text-center block">
            20
          </span>
        </h2>
        <div className="flex flex-col gap-4">
          {/* Messages go here */}
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="w-[3rem] rounded-full">
                <img
                  src="../public/avatar.jpg"
                  className="w-full h-full rounded-full"
                  alt="message-avatar"
                />
              </div>
              <div>
                <span className="block">John Doe</span>
                <span className="block text-sm text-iconsGray">
                  Lorem ipsum dolor sit amet
                </span>
              </div>
              <span className="block text-[0.8rem] text-iconsGray ml-auto pr-4">
                10:10pm
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MessagesList;
