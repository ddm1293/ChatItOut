import { createContext } from "react";
import ChatStage from "./ChatStage";

// Context providers used to pass state information across components

const HistoryContext = createContext({
  currChatHist: {
    sessionId: String, 
    messages: {invitation: [], connection: [], exchange: [], agreement: [], reflection: []}, 
    time: new Date(), 
    stage: new ChatStage(), 
    atStartRef: false,
    messageCapCount: 0,
    refusalCapCount: 0
  },
  setCurrChatHist: () => {}
});

const ChatDeleteContext = createContext({
  chatToDelete: {stage: new ChatStage(), time: new Date(), sessionId: String},
  setChatToDelete: () => {}
});

const ChatCompleteContext = createContext({
  chatToComplete: new Date(),
  setChatToComplete: () => {}
});

export { HistoryContext, ChatDeleteContext, ChatCompleteContext };