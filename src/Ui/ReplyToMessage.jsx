import { RiCloseLine } from "react-icons/ri";
import { useMessageMenu } from "../context/MessageMenuContext";
import { API_ORIGIN } from "../api/axiosInstance";

function ReplyToMessage() {
  const { state, dispatch } = useMessageMenu();

  const firstMedia =
    Array.isArray(state.replyMedia) && state.replyMedia.length > 0
      ? state.replyMedia[0]
      : null;
  const thumbUrl = firstMedia
    ? (() => {
        const u =
          typeof firstMedia === "string" ? firstMedia : (firstMedia.url ?? "");
        return u.startsWith("http") ? u : `${API_ORIGIN}${u}`;
      })()
    : null;

  function handleClose() {
    dispatch({ type: "CLOSE_MENU" });
  }

  return (
    <div
      className="border-l-4 border-myLightBlue bg-[#2C2C2C] text-white p-3 rounded-xl mb-3 relative"
      onClick={handleClose}
    >
      <div className="text-sm text-gray-400 mb-1">Replying to</div>
      <div className="flex items-center gap-2">
        {thumbUrl && (
          <img
            src={thumbUrl}
            alt=""
            className="w-10 h-10 object-cover rounded flex-shrink-0"
          />
        )}
        {state.messageContent ? (
          <div className="text-white font-medium truncate pr-6">
            {state.messageContent}
          </div>
        ) : !thumbUrl ? null : (
          <div className="text-gray-400 italic text-sm pr-6">Image</div>
        )}
      </div>
      <button className="absolute right-2 top-2 text-gray-400 hover:text-red-400 transition-colors">
        <RiCloseLine size={18} />
      </button>
    </div>
  );
}

export default ReplyToMessage;
