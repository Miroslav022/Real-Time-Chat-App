import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
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
  },
});

export const { addNewConversation, loadConversationsFromDB } =
  chatSlice.actions;
export default chatSlice.reducer;
