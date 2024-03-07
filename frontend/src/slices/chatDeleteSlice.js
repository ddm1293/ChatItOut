import { createSlice } from '@reduxjs/toolkit'

const chatDeleteSlice = createSlice({
  name: 'chatDelete',
  initialState: {
    stage: "invitation", 
    time: new Date().toISOString(), 
    sessionId: ""
  },
  reducers: {
    setChatDelete: (state, action) => {
      state.stage = action.payload.stage
      state.time = action.payload.time
      state.sessionId = action.payload.sessionId
    }
  }
});

export const selectChatDelete = (state) => state.chatDelete
export const { setChatDelete } = chatDeleteSlice.actions
export default chatDeleteSlice.reducer