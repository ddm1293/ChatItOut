import { createSlice, configureStore } from '@reduxjs/toolkit'
import chatSlice from './chatSlice'
import chatDeleteSlice from './chatDeleteSlice'
import chatCompleteSlice from './chatCompleteSlice'
import sideBarSlice from './sideBarSlice'

export const store = configureStore({
  reducer: {
    chat: chatSlice,
    chatDelete: chatDeleteSlice,
    chatComplete: chatCompleteSlice,
    sideBar: sideBarSlice,
  }
})