import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  roomId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    loadConversationsFromDB(state, action) {
      state.conversations.push(...action.payload);
    },
    addNewConversation(state, action) {
      state.conversations.push(action.payload);
    },
    setRoomId(state, action) {
      state.roomId = action.payload;
    },
  },
});

export const { addNewConversation, loadConversationsFromDB, setRoomId } =
  chatSlice.actions;
export default chatSlice.reducer;
