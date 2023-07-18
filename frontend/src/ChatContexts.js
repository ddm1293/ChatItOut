import { createContext, useMemo, useState } from "react";
import ChatStage from "./ChatStage";

const HistoryContext = createContext({
  currChatHist: {messages: {invitation: [], connection: [], exchange: [], agreement: [], reflection: []}, time: new Date(), stage: new ChatStage(), atStartRef: false},
  setCurrChatHist: () => {}
});

const ChatDeleteContext = createContext({
  chatToDelete: {stage: new ChatStage(), time: new Date()},
  setChatToDelete: () => {}
});

const ChatCompleteContext = createContext({
  chatToComplete: new Date(),
  setChatToComplete: () => {}
});

export { HistoryContext, ChatDeleteContext, ChatCompleteContext };