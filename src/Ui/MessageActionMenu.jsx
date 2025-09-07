import { GoReply } from "react-icons/go";
import { MdContentCopy } from "react-icons/md";
// import propTypes from "prop-types";
import { createPortal } from "react-dom";
import { useRef } from "react";
import { useMessageMenu } from "../context/MessageMenuContext";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { usePrecentScroll } from "../hooks/usePreventScroll";

function MessageActionMenu() {
  const ref = useRef();
  const { state, dispatch } = useMessageMenu();
  useOnClickOutside(ref, clickOutsideHandler);
  usePrecentScroll(".scrollToBottom");
  function clickOutsideHandler() {
    dispatch({ type: "CLOSE_MENU" });
  }

  function handleActions(action) {
    dispatch({ type: action });
  }

  function handleCopyAction() {
    navigator.clipboard.writeText(state.messageContent);
    dispatch({ type: "CLOSE_MENU" });
  }

  const style = {
    position: "absolute",
    top: state?.position?.top,
    backgroundColor: "rgba(37, 43, 46, 0.6)",
    backdropFilter: "blur(30px)",
    WebkitBackdropFilter: "blur(30px)",
    borderRadius: "12px",
    padding: "1rem",
    width: "13rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    zIndex: 9999,
    cursor: "pointer",
  };
  state?.position?.left
    ? (style.left = state?.position?.left)
    : (style.right = state.position.right);
  if (!state.isOpen) return;
  return createPortal(
    <div ref={ref} style={style}>
      <ul className="flex flex-col gap-2 cursor-pointer">
        <li
          className="font-medium text-sm text-white pt-2 pb-2 pl-1 pr-1 flex gap-2 items-center"
          onClick={() => handleActions("REPLY_MESSAGE")}
        >
          <GoReply className="text-xl" />
          Reply
        </li>
        <li
          className="font-medium text-sm text-white pt-2 pb-2 pl-1 pr-1 flex gap-2 items-center"
          onClick={handleCopyAction}
        >
          <MdContentCopy className="text-xl" />
          Copy
        </li>
      </ul>
    </div>,
    document.body
  );
}

// MessageActionMenu.propTypes = {
//   // position: propTypes.string,
// };
export default MessageActionMenu;
