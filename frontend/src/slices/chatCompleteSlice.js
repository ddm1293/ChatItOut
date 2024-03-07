import { createSlice } from '@reduxjs/toolkit'

const chatCompleteSlice = createSlice({
  name: 'chatComplete',
  initialState: {
    time: new Date().toDateString(),
  },
  reducers: {
    
  }
});

export default chatCompleteSlice.reducer