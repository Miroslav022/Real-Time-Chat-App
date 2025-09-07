import { createContext, useContext, useReducer } from "react";
import propTypes from "prop-types";

const initialState = [];

const OnlineUsersCotnext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.payload;
    case "ADD_NEW_USER": {
      let alreadyExist = state.some((x) => x.userId === action.payload.userId);
      if (alreadyExist) return state;

      const data = new Set([...state, action.payload]);
      return Array.from(data);
    }
    case "USER_WENT_OFLINE": {
      return state.filter((x) => {
        return x.userId !== Number(action.payload);
      });
    }
    case "REMOVE_USER_FROM_LIST": {
      return state.filter((x) => x.userId != action.payload);
    }
    default:
      throw new Error("action unknown");
  }
}

function OnlineUsersProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <OnlineUsersCotnext.Provider value={{ state, dispatch }}>
      {children}
    </OnlineUsersCotnext.Provider>
  );
}

function useOnlineUsers() {
  const context = useContext(OnlineUsersCotnext);
  if (context === undefined)
    throw new Error(
      "OnlineUsersContext was used outside of the OnlineUsersProvider"
    );
  return context;
}

OnlineUsersProvider.propTypes = {
  children: propTypes.oneOfType([
    propTypes.node,
    propTypes.arrayOf(propTypes.node),
  ]),
};

export { OnlineUsersProvider, useOnlineUsers };
