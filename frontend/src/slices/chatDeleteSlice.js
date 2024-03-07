import { createSlice } from '@reduxjs/toolkit'

const chatDeleteSlice = createSlice({
  name: 'chatDelete',
  initialState: {
    stage: "invitation", 
    time: new Date().toISOString(), 
    sessionId: ""
  },
  reducers: {
    
  }
});

export default chatDeleteSlice.reducer