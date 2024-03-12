import { createSlice, configureStore } from '@reduxjs/toolkit'
import chatSlice from './chatSlice'
import chatCompleteSlice from './chatCompleteSlice'
import sideBarSlice from './sideBarSlice'
import currChatSlice from './currChatSlice'

export const store = configureStore({
  reducer: {
    chat: chatSlice,
    currChat: currChatSlice,
    chatComplete: chatCompleteSlice,
    sideBar: sideBarSlice,
  }
})