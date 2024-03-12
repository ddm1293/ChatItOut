import { createSlice } from '@reduxjs/toolkit'

const currChatSlice = createSlice({
  name: 'currChat',
  initialState: {},
  reducers: {
    setCurrChat: (state, action) => {
      return action.payload
    }
  }
});

export const selectCurrChat = (state) => state.currChat
export const { setCurrChat } = currChatSlice.actions
export default currChatSlice.reducer