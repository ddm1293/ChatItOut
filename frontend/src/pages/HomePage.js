import React, { useContext, useEffect, useState } from 'react';
import LeftSideBar from "../components/LeftSideBar"
import Chatbot from '../components/Chatbot'
import { HistoryContext, HistoryContextProvider } from '../HistoryContext';
import ChatStage from '../ChatStage';


export default function HomePage() {
    const [currChatHist, setCurrChatHist] = useState({messages: {invitation: [], connection: [], exchange: [], agreement: [], reflection: []}, stage: new ChatStage()});
    const value = {currChatHist, setCurrChatHist};

    return (
        <>
            <HistoryContext.Provider value={value}>
                <div className="bg-[#1e1e1e] flex h-screen">
                    <div>
                        <LeftSideBar />
                        <Chatbot />
                    </div>
                </div>
            </HistoryContext.Provider>
        </>
    )
}