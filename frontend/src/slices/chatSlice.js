import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { addChatToDB } from './chatThunk'

const stages = [
  "invitation",
  "connection",
  "exchange",
  "agreement",
  "reflection",
  "complete"
]

const chatSlice = createSlice({
  name: 'chat',
  initialState: [],
  reducers: {
    addMessage: (state, action) => {
      const { targetStage, message } = action.payload
      state.messages[targetStage].push(message)
    },
    advanceStage: (state) => {
      const currentStageIndex = stages.findIndex(stage => stage === state.stage)
      if (currentStageIndex === -1 || currentStageIndex === stages.length - 1) {
        console.error('Cannot advance stage')
        return;
      }
      state.stage = stages[currentStageIndex + 1]
    },
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
  addMessage,
  advanceStage,
  setChat, 
  removeChat, 
  pushCurrChatMessage, 
  pushCurrChatMessageCount,
  setZeroCurrChatMessageCount,
  incrementCurrChatRefusalCount
} = chatSlice.actions
export default chatSlice.reducer