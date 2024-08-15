import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import ProfileImage from "./ProfileImage";
import InputEmoji from "react-input-emoji";
import { useState } from "react";
import { RiAttachment2 } from "react-icons/ri";

function Chat() {
  const [text, setText] = useState("");
  // const base = "w-fit max-w-xs p-3";
  // const styles = {
  //   sent: base + "bg-myLightBlue mr-auto rounded-l-lg rounded-b-lg text-black",
  //   received: base + "bg-myGray rounded-r-lg rounded-b-lg text-messageGray",
  // };
  return (
    <div
      className="bg-gray-900 border-myGray grid"
      style={{ gridTemplateRows: "5rem auto 5rem" }}
    >
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
      <div className="bg-myBgDark p-4 flex flex-col gap-4">
        <div className="max-w-xl w-fit">
          <div className="bg-myGray w-fit max-w-xl p-3 rounded-r-lg rounded-b-lg text-messageGray">
            message
          </div>
          <span className="text-[0.7rem] float-end mt-2 text-textGray">
            12:00 PM
          </span>
        </div>
        <div className="max-w-xs w-fit">
          <div className="bg-myGray w-fit max-w-xs p-3 rounded-r-lg rounded-b-lg text-messageGray">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
            exercitationem sit officiis inventore similique repellat asperiores,
            unde odio, voluptate id facilis, blanditiis necessitatibus dolores.
            Quam fugit quae odio quia nulla.
          </div>
          <span className="text-[0.7rem] float-end mt-2 text-textGray">
            12:00 PM
          </span>
        </div>
        <div className="max-w-xs w-fit ">
          <div className="bg-myLightBlue ml-auto w-fit max-w-xs p-3 rounded-l-lg rounded-b-lg text-black">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
            exercitationem sit officiis inventore similique repellat asperiores,
            unde odio, voluptate id facilis, blanditiis necessitatibus dolores.
            Quam fugit quae odio quia nulla.
          </div>
          <span className="text-[0.7rem] float-end mt-2 text-textGray">
            12:00 PM
          </span>
        </div>
      </div>
      <div className="flex gap-2 items-center p-4">
        <RiAttachment2 size={30} />
        <InputEmoji
          color="#fff"
          background="#202426"
          borderColor="#26292B"
          borderRadius="0.75rem"
          value={text}
          onChange={setText}
          cleanOnEnter
          placeholder="Type a message"
        />
      </div>
    </div>
  );
}

export default Chat;
