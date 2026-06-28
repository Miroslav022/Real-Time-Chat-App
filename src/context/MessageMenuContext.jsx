import { createContext, useContext, useReducer } from "react";
import propTypes from "prop-types";
import MessageActionMenu from "../Ui/MessageActionMenu";

const initialState = {
  isOpen: false,
  messageId: null,
  messageContent: "",
  replyMedia: null,
  position: {
    top: 0,
    left: 0,
  },
  action: "none",
};
const MessageMenuContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "OPEN_MENU":
      return {
        isOpen: true,
        messageId: action.payload.messageId,
        messageContent: action.payload.messageContent,
        replyMedia: action.payload.media ?? null,
        position: action.payload.position,
      };
    case "REPLY_MESSAGE":
      return {
        ...state,
        isOpen: false,
        action: "replyToMessage",
      };
    case "CLOSE_MENU":
      return initialState;
    default:
      return state;
  }
}

export function MessageMenuProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MessageMenuContext.Provider value={{ state, dispatch }}>
      {children}
      <MessageActionMenu />
    </MessageMenuContext.Provider>
  );
}

export function useMessageMenu() {
  const context = useContext(MessageMenuContext);
  if (!context)
    throw new Error(
      "MessageMenuContext was used outside of the OnlineUsersProvider",
    );
  return context;
}

MessageMenuProvider.propTypes = {
  children: propTypes.oneOfType([
    propTypes.node || propTypes.arrayOf(propTypes.node),
  ]),
};
