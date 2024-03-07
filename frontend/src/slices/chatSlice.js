import { createSlice } from '@reduxjs/toolkit'

const stages = [
  "invitation",
  "connection",
  "exchange",
  "agreement",
  "reflection",
  "complete"
]

const initialState = {
  sessionId: "", 
  messages: {
    invitation: [],
    connection: [], 
    exchange: [], 
    agreement: [], 
    reflection: []
  }, 
  time: new Date().toISOString(), 
  stage: "invitation", 
  atStartRef: false,
  messageCapCount: 0,
  refusalCapCount: 0
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { targetStage, message } = action.payload
      state.messages[targetStage].push(message)
    },
    advanceStage: (state) => {
      const currentStageIndex = stages.findIndex(stage => stage === state.stage)
      if (currentStageIndex === -1 || currentStageIndex === stages.length - 1) {
        console.error('Cannot advance stage');
        return;
      }
      state.stage = stages[currentStageIndex + 1]
    }
  }
})

export const { addMessage, advanceStage } = chatSlice.actions
export default chatSlice.reducer