import React, { useState } from 'react';
import SideBar from "../components/SideBar"
import Chatbot from "../components/chatBot/Chatbot"
import Welcome from "../components/Welcome"
import StageExp from "../components/StageExplanation";
import TermsOfUse from "../components/TermsOfUse"
import { HistoryContext } from '../ChatContexts';
import ChatStage from '../ChatStage';
import ham from '../assets/icon_hamburgermenu.png';
import close from "../assets/icon_close.png";
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentPage, setCurrPage } from '../slices/sideBarSlice'

export default function HomePage() {
    const dispatch = useDispatch();

    const [currChatHist, setCurrChatHist] = useState({messages: {invitation: [], connection: [], exchange: [], agreement: [], reflection: []}, time: new Date(), stage: new ChatStage(), atStartRef: false});
    const historyContextValue = {currChatHist, setCurrChatHist};

    const [hamOpen, setHamOpen] = useState(false);

    const currPage = useSelector(selectCurrentPage);
    
    const handleButtonOpen= () => {
        setHamOpen(true);
    };

    const handleButtonClose = () => {
        setHamOpen(false);
    };

    return (
        <>
            <HistoryContext.Provider value={historyContextValue}>
                <div className="bg-[#1e1e1e] flex h-screen overflow-hidden">
                    <div className="lg:hidden absolute top-0 w-full h-16 z-10 bg-black">
                        <button onClick={() => dispatch(setCurrPage('welcome'))} className="absolute top-0 left-0 m-4 font-bold text-2xl sm:block text-white font-calibri">
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
                            <img src={close} className="lg:hidden absolute z-10 right-0 -top-4 m-10 w-5"/>
                        </button>
                    </div>

                    <div className= {`${currPage === 'home' || currPage === 'newchat' ? "block" : "hidden"}`}>
                        <Chatbot />
                    </div>

                    <div className= {`${currPage === 'welcome'? "block" : "hidden"}`}>
                        <Welcome />
                    </div>
                    <div className= {`${currPage === 'useterms'? "block" : "hidden"}`}>
                        <TermsOfUse />
                    </div>

                    <div className= {` ${currPage === 'stageexp'? "visible" : "hidden"}`}>
                        <StageExp />
                    </div>
                    </div>
                </div>
            </HistoryContext.Provider>
        </>
    )
}