import { MdDeleteForever } from "react-icons/md";
import propTypes from "prop-types";
import { useRef } from "react";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { useDeleteMessage } from "../features/chat/useDeleteMessage";

function ContextMenu({ contextParams, contextMenuCloseHandler }) {
  const { deleteMessageHandler } = useDeleteMessage();

  const contextMenuRef = useRef(null);
  useOnClickOutside(contextMenuRef, contextMenuCloseHandler);
  const style = {
    top: contextParams.y,
    ...(contextParams.x <= 1500 ? { left: contextParams.x } : { right: 30 }),
    backgroundColor: "rgba(37, 43, 46, 0.6)",
    backdropFilter: "blur(30px)",
    WebkitBackdropFilter: "blur(30px)",
    borderRadius: "12px",
    padding: "1rem",
  };

  function deleteMessage() {
    deleteMessageHandler(contextParams.messageId);
    contextMenuCloseHandler();
  }

  return (
    <div
      style={style}
      className={`absolute bottom-100 w-[13rem] bg-myGray p-3 rounded-md z-50 mt-3 cursor-pointer`}
      ref={contextMenuRef}
    >
      <ul>
        <li
          className="font-medium text-lg text-white pt-2 pb-2 pl-1 pr-1 flex gap-2 items-center"
          onClick={deleteMessage}
        >
          <MdDeleteForever className="text-xl" /> Delete message
        </li>

      </ul>
    </div>
  );
}

ContextMenu.propTypes = {
  contextParams: propTypes.object,
  contextMenuCloseHandler: propTypes.func,
};

export default ContextMenu;
