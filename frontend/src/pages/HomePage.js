import React, { useContext, useEffect, useState } from 'react';
import LeftSideBar from "../components/LeftSideBar"
import Chatbot from '../components/Chatbot'
import { ChatDeleteContext, HistoryContext, ChatCompleteContext } from '../ChatContexts';
import ChatStage from '../ChatStage';
import ham from '../assets/icon_hamburgermenu.png';


export default function HomePage() {
    const [currChatHist, setCurrChatHist] = useState({messages: {invitation: [], connection: [], exchange: [], agreement: [], reflection: []}, stage: new ChatStage()});
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
                                <div className="hidden sm:block">
                                    <LeftSideBar />
                                </div>

                                <div className="sm:hidden">
                                    <button>
                                        <img src={ham} className="absolute top-0 right-0 m-8" alt="Hamburger menu bar"/>
                                    </button>
                                </div>
                                <Chatbot />
                            </div>
                        </div>
                    </ChatCompleteContext.Provider>
                </ChatDeleteContext.Provider>
            </HistoryContext.Provider>
        </>
    )
}