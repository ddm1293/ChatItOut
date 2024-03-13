import { createSlice } from '@reduxjs/toolkit'

const chatCompleteSlice = createSlice({
  name: 'chatComplete',
  initialState: {
    sessionId: '',
  },
  reducers: {
    setChatComplete: (state, action) => {
      state.sessionId = action.payload
    },
    updateCurrChat: (state, action) => {
      
    }
  }
});

export const selectChatComplete = (state) => state.chatComplete.sessionId
export const { setChatComplete } = chatCompleteSlice.actions
export default chatCompleteSlice.reducer