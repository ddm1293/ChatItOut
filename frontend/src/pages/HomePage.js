import React, { useContext, useEffect, useState } from 'react';
import SideBar from "../components/SideBar"
import Chatbot from '../components/Chatbot'
import { ChatDeleteContext, HistoryContext, ChatCompleteContext } from '../ChatContexts';
import ChatStage from '../ChatStage';
import ham from '../assets/icon_hamburgermenu.png';
import { Link } from "react-router-dom";
import close from '../assets/icon_close.png'


export default function HomePage() {
    const [currChatHist, setCurrChatHist] = useState({messages: {invitation: [], connection: [], exchange: [], agreement: [], reflection: []}, time: new Date(), stage: new ChatStage(), atStartRef: false});
    const historyContextValue = {currChatHist, setCurrChatHist};

    const [chatToDelete, setChatToDelete] = useState({stage: new ChatStage(), time: new Date()});
    const chatToDeleteValue = {chatToDelete, setChatToDelete};

    const [chatToComplete, setChatToComplete] = useState(new Date());
    const chatToCompleteValue = {chatToComplete, setChatToComplete};

    const [hamOpen, setHamOpen] = useState(false);
    
    const handleButtonOpen= () => {
        setHamOpen(true);
    };

    const handleButtonClose = () => {
        setHamOpen(close);
    };

    return (
        <>
            <HistoryContext.Provider value={historyContextValue}>
                <ChatDeleteContext.Provider value={chatToDeleteValue}>
                    <ChatCompleteContext.Provider value={chatToCompleteValue}>
                        <div className="bg-[#1e1e1e] flex h-screen">
                                <div className="z-10 absolute top-0 left-0 w-1/5 hidden sm:block">
                                    <SideBar />
                                </div>

                                <div className="sm:hidden">
                                    <Link to={"/welcome"}>
                                        <p className="z-10 absolute top-0 left-0 m-4 text-white font-calibri font-medium text-2xl">
                                            Chat IT Out
                                         </p>   
                                    </Link>
                                </div>

                                <button onClick={handleButtonOpen} className="sm:hidden">
                                    <img src={ham} className="z-10 absolute top-0 right-0 mt-6 mr-10" alt="Hamburger menu bar"/>
                                </button>

                                <div className={`absolute right-0 top-0 z-50 w-4/5 ${hamOpen === true? "block": "hidden"}`}>
                                    <SideBar />
                                    
                                    <button onClick={handleButtonClose}>
                                        <img src={close} className="absolute right-0 top-0 m-8"/>
                                    </button>
                                </div>

                                <Chatbot />
                        </div>
                    </ChatCompleteContext.Provider>
                </ChatDeleteContext.Provider>
            </HistoryContext.Provider>
        </>
    )
}