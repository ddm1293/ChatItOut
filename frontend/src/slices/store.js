import { configureStore } from '@reduxjs/toolkit'
import chatSlice from './chatSlice'
import sideBarSlice from './sideBarSlice'
import currChatSlice from './currChatSlice'

export const store = configureStore({
  reducer: {
    chat: chatSlice,
    currChat: currChatSlice,
    sideBar: sideBarSlice,
  }
})