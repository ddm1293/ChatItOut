import { createContext, useMemo, useState } from "react";
import ChatStage from "./ChatStage";

const HistoryContext = createContext({
  currChatHist: {messages: {invitation: [], connection: [], exchange: [], agreement: [], reflection: []}, stage: new ChatStage()},
  setCurrChatHist: () => {}
});

const ChatDeleteContext = createContext({
  chatToDelete: new Date(),
  setChatToDelete: () => {}
});

const ChatCompleteContext = createContext({
  currChatHist: new Date(),
  setChatToComplete: () => {}
});

export { HistoryContext, ChatDeleteContext, ChatCompleteContext };