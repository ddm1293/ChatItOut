import { useContext, useEffect, useState, useRef, createContext } from "react";
import React from 'react';
import newchat from "../assets/icon_newchat.png";
import newchatDark from "../assets/icon_newchat_dark.png";
import stageexp from "../assets/icon_stageexp.png";
import stageexpDark from "../assets/icon_stageexp_dark.png";
import ChatHistory from "./ChatHistory";
import { HistoryContext, ChatCompleteContext, ChatDeleteContext } from '../ChatContexts';
import ChatStage from "../ChatStage";
import { SideBarContext } from '../components/PageRoute';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { serverURL } from '../components/chatBot/Chatbot'

export default function SideBar() {
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
    const { currChatHist, setCurrChatHist } = useContext(HistoryContext);
    const currChatHistValue = { currChatHist, setCurrChatHist };


    const { chatToComplete, setChatToComplete } = useContext(ChatCompleteContext);
    const { chatToDelete, setChatToDelete } = useContext(ChatDeleteContext);

    let isInitialMount = useRef(true);
    const containerRef = useRef(null);

    const { currentPage, setCurrentPage } = useContext(SideBarContext);
    const currentPageValue = { currentPage, setCurrentPage };
   
    const loadDbReq = indexedDB.open("chathistory", 2);
    const delDbReq = indexedDB.open("chathistory", 2);


    const loadChats = () => {
        loadDbReq.onsuccess = async function (evt) {
            let db = loadDbReq.result;
            if (!db.objectStoreNames.contains('chats')) {
                return;
            }

            const tx = await db.transaction('chats', 'readonly');
            const store = tx.objectStore('chats');
            let dbChatsObj = await store.getAll();
            dbChatsObj.onsuccess = () => {
                let dbChats = dbChatsObj.result;
                let currChatHistories = [];
                let doneChatHistories = [];
                for (let dbChat of dbChats) {
                    let stage = new ChatStage(dbChat.stage.name);
                    dbChat.stage = stage;
                    if (stage.name === 'complete') {
                        doneChatHistories.push(<ChatHistory key={dbChat.time.getTime()} startState={dbChat} />);
                    } else {
                        currChatHistories.push(<ChatHistory key={dbChat.time.getTime()} startState={dbChat} />);
                    }
                }
                setCurrChats(currChats.concat(currChatHistories));
                setDoneChats(doneChats.concat(doneChatHistories));
            }
            tx.oncomplete = () => {
                db.close();
            }
        }
        loadDbReq.onerror = (err) => {
            console.log(err);
        }
    }



    
    // Start a new chat
    const newChat = () => {
        let today = new Date();
        const sessionId = uuidv4();
        let emptyStart = { 
            sessionId: sessionId,
            messages: {
                invitation: [
                    { type: 'newStage', message: 'invitation' }, 
                    { type: 'chatbot', message: "I'm an AI conflict coach here to help you with any conflicts or issues you may be facing. How can I assist you today?" }
                ], 
                connection: [],
                exchange: [], 
                agreement: [], 
                reflection: [] 
            }, 
            time: today, 
            stage: new ChatStage(), 
            atStartRef: false,
            messageCapCount: 0,
            refusalCapCount: 0
        };
        setCurrChats(currChats.concat([<ChatHistory key={today.getTime()} startState={emptyStart} />]));
        if (currentPage !== 'home') {
            setCurrentPage('home');
        }
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    // Move the chat to complete section
    const completeChat = () => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }


        let chatToCompleteTime = chatToComplete.getTime();
        let completedChat;
        let newCurrChats = [];


        for (let currChat of currChats) {
            if (currChat.key != chatToCompleteTime) {
                newCurrChats.push(currChat);
            } else {
                completedChat = currChat;
            }
        }


        setCurrChats(newCurrChats);
        setDoneChats(doneChats.concat([completedChat]));
    }

    const deleteSession = async (session_id) => {
        try {
            console.log("see chatToDelete.sessionId:", session_id)
            let resp = await axios.delete(`${serverURL}/chat/${session_id}`);
            console.log("see response data: ", resp.data)
        } catch (err) {
            console.log(err);
            return "An error occured. Please try again later."
        }
    }

    // Delete chat history
    const deleteChat = async () => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        let chatToDeleteTime = chatToDelete.time.getTime();

        // Update UI
        let newChats = [];
        if (chatToDelete.stage.name === 'complete') {
            for (let doneChat of doneChats) {
                if (doneChat.key != chatToDeleteTime) {
                    newChats.push(doneChat);
                }
            }
            setDoneChats(newChats);
        } else {
            for (let currChat of currChats) {
                if (currChat.key != chatToDeleteTime) {
                    newChats.push(currChat);
                }
            }
            setCurrChats(newChats);
        }

        // Update DB
        delDbReq.onsuccess = async function (evt) {
            let db = delDbReq.result;
            if (!db.objectStoreNames.contains('chats')) {
                return;
            }
            const tx = await db.transaction('chats', 'readwrite');
            const store = tx.objectStore('chats');
            store.delete(chatToDelete.time);
        }

        console.log('see chatToDelete', chatToDelete)
        await deleteSession(chatToDelete.sessionId)
    }


    // Load chat history in the side bar
    useEffect(() => {
        loadChats();
    }, []);


    useEffect(() => {
        completeChat();
    }, [chatToComplete]);


    useEffect(() => {
        deleteChat();
    }, [chatToDelete]);

    useEffect(() => {
        if (currentPage === 'newchat') {
            newChat();
        }
    }, [currentPage]);


    return (
        <>
            <div className={`lg:flex flex-col h-screen bg-[#FFFFFF] lg:bg-[#333333] absolute top-0 lg:left-0 w-80 right-0 z-10`}>
                {/* Title */}
                
                    <div>
                        <button onClick={() => setCurrentPage('welcome')} className="m-6 font-bold text-2xl hidden lg:block text-white font-calibri">
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
                            className={`flex w-full h-fit p-1.5 mt-2 py-2 hover:bg-[#D9D9D9] lg:hover:bg-[#1e1e1e] rounded-lg ${(currentPage === "stageexp") ? 'lg:bg-[#1e1e1e] bg-[#D9D9D9] rounded-lg' : ''
                                }`}
                        >
                            <button onClick={() => setCurrentPage('stageexp')} className="flex items-center ml-5 font-normal text-base text-black lg:text-white font-calibri">
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

                    <div className="pt-3 max-h-[180px] overflow-y-auto custom-scrollbar" ref={containerRef}>{currChats}</div>


                    {/* Completed */}
                    <div className="flex flex-col ml-6 mt-8 font-normal text-base leading-5 text-[#878787]  lg:text-[#ababad] text-opacity-80 font-calibri">
                        Completed
                    </div>
                    
                    <div className="pt-3 max-h-[200px] overflow-y-auto custom-scrollbar">{doneChats}</div>
                    

                    {/* Divider */}
                    <hr className="absolute bottom-20 left-3 w-11/12 mx-auto bg-[#000000] lg:bg-[#eeeeee] lg:opacity-20" />

                    {/* Menu items */}
                    <div
                        className={`flex absolute bottom-7 w-full h-fit p-2 hover:bg-[#D9D9D9] lg:hover:bg-[#1e1e1e] rounded-lg ${(currentPage === "useterms") ? 'lg:bg-[#1e1e1e] bg-[#D9D9D9] rounded-lg pr-28 p1-6 pt-1' : ''
                            }`}
                    >
                        <button onClick={() => setCurrentPage('useterms')} className="ml-5 font-normal text-base leading-7 text-black lg:text-white font-calibri">
                            Terms of use
                        </button>
                    </div>
                
            </div>
        </>
    )
}