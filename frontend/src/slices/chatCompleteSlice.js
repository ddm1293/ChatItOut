import { createSlice } from '@reduxjs/toolkit'

const chatCompleteSlice = createSlice({
  name: 'chatComplete',
  initialState: {
    time: new Date().toISOString(),
  },
  reducers: {
    setChatComplete: (state, action) => {
      state.time = action.payload
    }
  }
});

export const selectChatComplete = (state) => state.chatComplete.time
export const { setChatComplete } = chatCompleteSlice.actions
export default chatCompleteSlice.reducer