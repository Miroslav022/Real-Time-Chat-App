import { RiCloseLine } from "react-icons/ri";
import { useMessageMenu } from "../context/MessageMenuContext";

function ReplyToMessage() {
  const { state, dispatch } = useMessageMenu();

  function handleClose() {
    dispatch({ type: "CLOSE_MENU" });
  }
  return (
    <div
      className="border-l-4 border-myLightBlue bg-[#2C2C2C] text-white p-3 rounded-xl mb-3 relative"
      onClick={handleClose}
    >
      <div className="text-sm text-gray-400 mb-1">Replying to</div>
      <div className="text-white font-medium truncate pr-6">
        {state.messageContent}
      </div>
      <button className="absolute right-2 top-2 text-gray-400 hover:text-red-400 transition-colors">
        <RiCloseLine size={18} />
      </button>
    </div>
  );
}

export default ReplyToMessage;
