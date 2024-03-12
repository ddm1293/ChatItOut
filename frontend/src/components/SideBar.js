import { useEffect, useState, useRef } from "react";
import React from 'react';
import newchat from "../assets/icon_newchat.png";
import newchatDark from "../assets/icon_newchat_dark.png";
import stageexp from "../assets/icon_stageexp.png";
import stageexpDark from "../assets/icon_stageexp_dark.png";
import ChatHistory from "./ChatHistory";
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentPage, setCurrPage } from '../slices/sideBarSlice'
import { selectChatComplete } from "../slices/chatCompleteSlice"
import { selectChats } from '../slices/chatSlice'
import { setCurrChat } from "../slices/currChatSlice"
import ChatSession from "../models/ChatSession";
import { addChatToDB, loadChatFromDB } from '../slices/chatThunk'
import { produce } from 'immer'
import ChatStage from '../ChatStage'

export default function SideBar() {
    const dispatch = useDispatch();

    //check if the screen width is larger than 1024px
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        function handleResize() {
            setIsLargeScreen(window.innerWidth >= 1024);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const [currChats, setCurrChats] = useState([]);
    const [doneChats, setDoneChats] = useState([]);

    let isInitialMount = useRef(true);
    const containerRef = useRef(null);

    const currPage = useSelector(selectCurrentPage);
    const chatCompleteSessionId = useSelector(selectChatComplete);
    const chats = useSelector(selectChats);

    const loadChats = () => {
        dispatch(loadChatFromDB())
    }

    // Start a new chat
    const newChat = () => {
        const emptyStart = new ChatSession();

        dispatch(addChatToDB(emptyStart))

        dispatch(setCurrChat(emptyStart));

        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    // Move the chat to complete section
    const completeChat = () => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        console.log("trigger completeChat")
    }

    // Load chat history in the side bar
    useEffect(() => {
        loadChats();
    }, []);


    useEffect(() => {
        completeChat();
    }, [chatCompleteSessionId]);


    useEffect(() => {
        if (currPage === 'newchat') {
            newChat();
        }
    }, [currPage]);


    return (
        <>
            <div className={`lg:flex flex-col h-screen bg-[#FFFFFF] lg:bg-[#333333] absolute top-0 lg:left-0 w-80 right-0 z-10`}>
                {/* Title */}
                
                    <div>
                        <button onClick={() => dispatch(setCurrPage('welcome'))} className="m-6 font-bold text-2xl hidden lg:block text-white font-calibri">
                            Chat IT Out
                        </button>
                    </div>

                    {/* Divider */}
                    <hr className="lg:w-11/12 mx-auto w-full bg-[#E6E6E6] lg:bg-[#eeeeee] lg:opacity-20 hidden lg:block" />


                    <div className="mt-20 lg:mt-0">
                        {/* New Chat */}
                        <div className='flex w-full h-fit p-1.5 mt-6 py-2 hover:bg-[#D9D9D9] lg:hover:bg-[#1e1e1e] rounded-lg'>
                            <button onClick={() => newChat()} className="flex items-center ml-5 font-normal text-base text-black lg:text-white font-calibri">
                                <img src={newchat} className={`square-full mr-3 w-4 h-4 ${isLargeScreen ? 'visible' : 'hidden'}`} alt="New Chat Icon" />
                                <img src={newchatDark} className={`square-full mr-3 w-4 h-4 ${isLargeScreen ? 'hidden' : 'visible'}`} alt="New Chat Icon" />
                                <span>New Chat</span>
                            </button>
                        </div>

                        {/* What are 5 stages? */}
                        <div
                            className={`flex w-full h-fit p-1.5 mt-2 py-2 hover:bg-[#D9D9D9] lg:hover:bg-[#1e1e1e] rounded-lg ${(currPage === "stageexp") ? 'lg:bg-[#1e1e1e] bg-[#D9D9D9] rounded-lg' : ''
                                }`}
                        >
                            <button onClick={() => dispatch(setCurrPage('stageexp'))} className="flex items-center ml-5 font-normal text-base text-black lg:text-white font-calibri">
                                <img src={stageexp} className={`square-full mr-3 w-4 h-4 ${isLargeScreen ? 'visible' : 'hidden'}`} alt="Stage Icon" />
                                <img src={stageexpDark} className={`square-full mr-3 w-4 h-4 ${isLargeScreen ? 'hidden' : 'visible'}`} alt="Stage Icon" />
                                <span>What are the 5 stages?</span>
                            </button>
                        </div>
                    </div>

                    
                    {/* In Progress */}
                    <div className="flex flex-col ml-6 mt-10 font-normal text-base leading-5 text-[#878787] lg:text-[#ababad] text-opacity-80 font-calibri">
                        In Progress
                    </div>

                    <div className="pt-3 max-h-[180px] overflow-y-auto custom-scrollbar" ref={containerRef}>
                        {chats.map(chat => {
                            const chatSession = produce(chat, draft => {
                                draft.stage = new ChatStage(draft.stage)
                                draft.time = new Date(draft.time)
                            })
                            return <ChatHistory key={chatSession.time.getTime()} startState={chatSession} />
                        })}
                    </div>


                    {/* Completed */}
                    <div className="flex flex-col ml-6 mt-8 font-normal text-base leading-5 text-[#878787]  lg:text-[#ababad] text-opacity-80 font-calibri">
                        Completed
                    </div>
                    
                    <div className="pt-3 max-h-[200px] overflow-y-auto custom-scrollbar">
                        {chats
                            .filter(chat => chat.completed === true)
                            .map(chat => {
                                const chatSession = produce(chat, draft => {
                                    draft.stage = new ChatStage(draft.stage)
                                    draft.time = new Date(draft.time)
                                })
                                return <ChatHistory key={chatSession.time.getTime()} startState={chatSession} />
                        })}
                    </div>
                    

                    {/* Divider */}
                    <hr className="absolute bottom-20 left-3 w-11/12 mx-auto bg-[#000000] lg:bg-[#eeeeee] lg:opacity-20" />

                    {/* Menu items */}
                    <div
                        className={`flex absolute bottom-7 w-full h-fit p-2 hover:bg-[#D9D9D9] lg:hover:bg-[#1e1e1e] rounded-lg ${(currPage === "useterms") ? 'lg:bg-[#1e1e1e] bg-[#D9D9D9] rounded-lg pr-28 p1-6 pt-1' : ''
                            }`}
                    >
                        <button onClick={() => dispatch(setCurrPage('useterms'))} className="ml-5 font-normal text-base leading-7 text-black lg:text-white font-calibri">
                            Terms of use
                        </button>
                    </div>
                
            </div>
        </>
    )
}