import React, { useState } from 'react';
import SideBar from "../components/SideBar"
import Chatbot from "../components/chatBot/Chatbot"
import Welcome from "../components/Welcome"
import StageExp from "../components/StageExplanation";
import TermsOfUse from "../components/TermsOfUse"
import { ChatDeleteContext, HistoryContext, ChatCompleteContext } from '../ChatContexts';
import ChatStage from '../ChatStage';
import ham from '../assets/icon_hamburgermenu.png';
import close from "../assets/icon_close.png";
import { SideBarContext  } from '../components/PageRoute';

export default function HomePage() {
    const [currChatHist, setCurrChatHist] = useState({messages: {invitation: [], connection: [], exchange: [], agreement: [], reflection: []}, time: new Date(), stage: new ChatStage(), atStartRef: false});
    const historyContextValue = {currChatHist, setCurrChatHist};

    const [chatToDelete, setChatToDelete] = useState({stage: new ChatStage(), time: new Date()});
    const chatToDeleteValue = {chatToDelete, setChatToDelete};

    const [chatToComplete, setChatToComplete] = useState(new Date());
    const chatToCompleteValue = {chatToComplete, setChatToComplete};

    const [hamOpen, setHamOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState('welcome');
    const currentPageValue = {currentPage, setCurrentPage};
    
    const handleButtonOpen= () => {
        setHamOpen(true);
    };

    const handleButtonClose = () => {
        setHamOpen(false);
    };

    return (
        <>
        <SideBarContext.Provider value={currentPageValue}>
            <HistoryContext.Provider value={historyContextValue}>
                <ChatDeleteContext.Provider value={chatToDeleteValue}>
                    <ChatCompleteContext.Provider value={chatToCompleteValue}>

                        <div className="bg-[#1e1e1e] flex h-screen overflow-hidden">
                                <div className="lg:hidden absolute top-0 w-full h-16 z-10 bg-black">
                                    <button onClick={() => setCurrentPage('welcome')} className="absolute top-0 left-0 m-4 font-bold text-2xl sm:block text-white font-calibri">
                                            Chat IT Out
                                    </button>   
                                </div>

                                <div>

                                <button onClick={() => handleButtonOpen()} className={"block lg:hidden"}>
                                    <img src={ham} className="z-10 absolute top-0 right-0 mt-6 mr-10 h-5" alt="Hamburger menu bar"/>
                                </button>

                                <div className={`lg:block z-20 ${(hamOpen === true? "visible" : "hidden")}`}>
                                    <SideBar />

                                    <button onClick={() => handleButtonClose()} className={`${(hamOpen == true? "block" : "hidden")}`}>
                                        <img src={close} className="absolute z-10 right-0 top-0 m-8 w-5"/>
                                    </button>
                                </div>

                                <div className= {`${currentPage === 'home' || currentPage === 'newchat' ? "block" : "hidden"}`}>
                                    <Chatbot />
                                </div>

                                <div className= {`${currentPage === 'welcome'? "block" : "hidden"}`}>
                                    <Welcome />
                                </div>
                                <div className= {`${currentPage === 'useterms'? "block" : "hidden"}`}>
                                    <TermsOfUse />
                                </div>

                                <div className= {` ${currentPage === 'stageexp'? "visible" : "hidden"}`}>
                                    <StageExp />
                                </div>
                                </div>
                        </div>
                    </ChatCompleteContext.Provider>
                </ChatDeleteContext.Provider>
            </HistoryContext.Provider>
            </SideBarContext.Provider>
        
        </>
    )
}