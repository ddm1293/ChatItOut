import React, { useContext, useEffect, useState } from 'react';
import LeftSideBar from "../components/LeftSideBar"
import Chatbot from '../components/Chatbot'
import { ChatDeleteContext, HistoryContext, ChatCompleteContext } from '../ChatContexts';
import ChatStage from '../ChatStage';


export default function HomePage() {
    const [currChatHist, setCurrChatHist] = useState({messages: {invitation: [], connection: [], exchange: [], agreement: [], reflection: []}, time: new Date(), stage: new ChatStage(), atStartRef: false});
    const historyContextValue = {currChatHist, setCurrChatHist};

    const [chatToDelete, setChatToDelete] = useState({stage: new ChatStage(), time: new Date()});
    const chatToDeleteValue = {chatToDelete, setChatToDelete};

    const [chatToComplete, setChatToComplete] = useState(new Date());
    const chatToCompleteValue = {chatToComplete, setChatToComplete};


    return (
        <>
            <HistoryContext.Provider value={historyContextValue}>
                <ChatDeleteContext.Provider value={chatToDeleteValue}>
                    <ChatCompleteContext.Provider value={chatToCompleteValue}>
                        <div className="bg-[#1e1e1e] flex h-screen">
                            <div>
                                <LeftSideBar />
                                <Chatbot />
                            </div>
                        </div>
                    </ChatCompleteContext.Provider>
                </ChatDeleteContext.Provider>
            </HistoryContext.Provider>
        </>
    )
}