import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sessionId: '',
  messages: {
    invitation: [
        { type: 'newStage', message: 'invitation' },
        { type: 'chatbot', message: "I'm an AI conflict coach here to help you with any conflicts or issues you may be facing. How can I assist you today?" }
    ],
    connection: [],
    exchange: [],
    agreement: [],
    reflection: []
  },
  time: new Date().toISOString(),
  stage: 'invitation',
  atStartRef: false,
  messageCapCount: 0,
  refusalCapCount: 0,
  completed: false,
  messageCap: {
    invitation: {
      msgCount: 0,
      msgCap: 1
    },
    connection: {
      msgCount: 0,
      msgCap: 1
    },
    exchange: {
      msgCount: 0,
      msgCap: 1
    },
    agreement: {
      msgCount: 0,
      msgCap: 1
    },
    reflection: {
      msgCount: 0,
      msgCap: 1
    }
  }
}

const currChatSlice = createSlice({
  name: 'currChat',
  initialState,
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
    }
  }
});

export const selectCurrChat = (state) => state.currChat
export const selectCurrChatMessages = (state) => state.currChat.messages
export const selectCurrChatStage = (state) => state.currChat.stage
export const selectCurrChatAtStartRef = (state) => state.currChat.atStartRef
export const selectCurrChatMessageCap = (state) => state.currChat.messageCap
export const selectCurrChatRefusalCap = (state) => state.currChat.refusalCapCount
export const { 
  setCurrChat, 
  pushMessage, 
  addMessageCount, 
  setMessageCap,
  setZeroMessageCount,
  incrementRefusalCount, } = currChatSlice.actions
export default currChatSlice.reducer