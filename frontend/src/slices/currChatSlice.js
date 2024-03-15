import { createSlice } from '@reduxjs/toolkit'
import { chatStages } from '../models/ChatStages';
import ChatSession from '../models/ChatSession';

const currChatSlice = createSlice({
  name: 'currChat',
  initialState: new ChatSession().toPlainObject(),
  reducers: {
    setCurrChat: (state, action) => {
      return action.payload
    },
    pushMessage: (state, action) => {
      const { stage, content } = action.payload
      state.messages[stage].push(content)
    },
    addMessageCount: (state, action) => {
      const stage = action.payload
      state.messageCap[stage].msgCount++
    },
    setMessageCap: (state, action) => {
      const { stage, cap } = action.payload
      state.messageCap[stage].msgCap = cap
    },
    setZeroMessageCount: (state, action) => {
      const stage = action.payload
      state.messageCap[stage].msgCount = 0
    },
    incrementRefusalCount: (state) => {
      state.refusalCapCount++
    },
    setZeroRefusalCount: (state) => {
      state.refusalCapCount = 0
    },
    advanceStage: (state) => {
      const currIndex = chatStages.findIndex(stage => stage === state.stage)
      if (currIndex < chatStages.length - 1) {
        state.stage = chatStages[currIndex + 1]
        const nextStage = state.stage
        state.messages[state.stage].push({ type: 'newStage', message: nextStage })
      } else {
        state.messages.reflection.push({ type: 'newStage', message: "This is the end of this conversation."})
        state.stage = "complete"
        state.completed = true
      }
    },
    setAtStartRef: (state, action) => {
      state.atStartRef = action.payload
    }
  }
});

export const selectCurrChat = (state) => state.currChat
export const selectCurrChatSessionId = (state) => state.sessionId
export const selectCurrChatMessages = (state) => state.currChat.messages
export const selectCurrChatStage = (state) => state.currChat.stage
export const selectCurrChatAtStartRef = (state) => state.currChat.atStartRef
export const selectCurrChatMessageCap = (state) => state.currChat.messageCap
export const selectCurrChatRefusalCount = (state) => state.currChat.refusalCapCount
export const selectCurrChatRefusalCap = (state) => state.currChat.refusalCap
export const { 
  setCurrChat, 
  pushMessage, 
  addMessageCount, 
  setMessageCap,
  setZeroMessageCount,
  incrementRefusalCount,
  advanceStage,
  setAtStartRef,
  setZeroRefusalCount } = currChatSlice.actions
export default currChatSlice.reducer