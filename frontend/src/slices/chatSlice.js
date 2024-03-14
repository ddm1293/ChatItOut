import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { addChatToDB } from './chatThunk'
import { chatStages } from '../models/ChatStages'

const chatSlice = createSlice({
  name: 'chat',
  initialState: [],
  reducers: {
    setChat: (state, action) => {
      state.push(action.payload)
    },
    removeChat: (state, action) => {
      const sessionIdToRemove = action.payload;
      return state.filter(chat => chat.sessionId !== sessionIdToRemove);
    },
    pushCurrChatMessage: (state, action) => {
      const { sessionId, stage, content } = action.payload
      const index = state.findIndex(chat => chat.sessionId === sessionId)
      if (index !== -1) {
        state[index].messages[stage].push(content)
      }
    },
    pushCurrChatMessageCount: (state, action) => {
      const { sessionId, stage } = action.payload
      const index = state.findIndex(chat => chat.sessionId === sessionId)
      if (index !== -1) {
        state[index].messageCap[stage].msgCount++
      }
    },
    setZeroCurrChatMessageCount: (state, action) => {
      const { sessionId, stage } = action.payload
      const index = state.findIndex(chat => chat.sessionId === sessionId)
      if (index !== -1) {
        state[index].messageCap[stage].msgCount = 0
      }
    },
    incrementCurrChatRefusalCount: (state, action) => {
      const sessionId = action.payload
      const index = state.findIndex(chat => chat.sessionId === sessionId)
      state[index].refusalCapCount++
    },
    setZeroCurrChatRefusalCount: (state, action) => {
      const sessionId = action.payload
      const index = state.findIndex(chat => chat.sessionId === sessionId)
      state[index].refusalCapCount = 0
    },
    advanceCurrChatStage: (state, action) => {
      const sessionId = action.payload
      const sessionIndex = state.findIndex(chat => chat.sessionId === sessionId)
      const currChatStage = state[sessionIndex].stage

      const currIndex = chatStages.findIndex(stage => stage === currChatStage)
      if (currIndex < chatStages.length - 1) {
        state[sessionIndex].stage = chatStages[currIndex + 1]
        const nextStage = state[sessionIndex].stage
        state[sessionIndex].messages[nextStage].push({ type: 'newStage', message: state.stage })
      } else {
        state[sessionIndex].messages.reflection.push({ type: 'newStage', message: "This is the end of this conversation."})
        state[sessionIndex].stage = "complete"
        state[sessionIndex].completed = true
      }
    },
    setCurrChatAtStartRef: (state, action) => {
      const { sessionId, bool } = action.payload
      const sessionIndex = state.findIndex(chat => chat.sessionId === sessionId)
      state[sessionIndex].atStartRef = bool
    }
  },
  extraReducers: builder => {
    builder
    .addCase(addChatToDB.fulfilled, (state, action) => {
      console.log("addChatToDB fulfilled!")
    })
  }
})

export const selectChats = (state) => state.chat
export const { 
  setChat, 
  removeChat, 
  pushCurrChatMessage, 
  pushCurrChatMessageCount,
  setZeroCurrChatMessageCount,
  incrementCurrChatRefusalCount,
  advanceCurrChatStage,
  setCurrChatAtStartRef,
  setZeroCurrChatRefusalCount,
} = chatSlice.actions
export default chatSlice.reducer