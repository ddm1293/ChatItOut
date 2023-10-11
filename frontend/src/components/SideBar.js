import { useContext, useEffect, useState, useRef, createContext } from "react";
import React from 'react';
import newchat from "../assets/icon_newchat.png";
import stageexp from "../assets/icon_stageexp.png";
import ChatHistory from "./ChatHistory";
import { HistoryContext, ChatCompleteContext, ChatDeleteContext } from '../ChatContexts';
import ChatStage from "../ChatStage";
import { SideBarContext } from '../components/PageRoute';

export default function SideBar() {
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


            // load chats
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
        let emptyStart = { messages: { invitation: [{ type: 'newStage', message: 'invitation' }, { type: 'chatbot', message: "I'm an AI conflict coach here to help you with any conflicts or issues you may be facing. How can I assist you today?" }], connection: [], exchange: [], agreement: [], reflection: [] }, time: today, stage: new ChatStage(), atStartRef: false };
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

    // Delete chat history
    const deleteChat = () => {
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
            <div className={`sm:flex flex-col h-screen bg-[#333333] absolute top-0 sm:left-0 sm:w-1/5 w-4/5 right-0 z-10`}>
                {/* Title */}
                
                    <div>
                        <button onClick={() => setCurrentPage('welcome')} className="m-8 font-bold hidden sm:block md:text-lg lg:text-2xl text-white font-calibri">
                            Chat IT Out
                        </button>
                    </div>

                    {/* Divider */}
                    <hr className="-my-4 w-full bg-[#eeeeee] opacity-20 hidden sm:block" />


                    {/* New Chat */}
                    <div className='flex w-full h-fit p-2 mt-24 sm:mt-10 hover:bg-[#1e1e1e] rounded-lg'>
                        <button onClick={() => newChat()} className="flex items-center ml-5 font-normal text-lg text-white font-calibri">
                            <img src={newchat} className="square-full mx-3 w-4 h-4" alt="New Chat Icon" />
                            <span>New Chat</span>
                        </button>
                    </div>

                    {/* What are 5 stages? */}
                    <div
                        className={`flex w-full h-fit p-2 mt-2 hover:bg-[#1e1e1e] rounded-lg ${(currentPage === "stageexp") ? 'bg-[#1e1e1e] rounded-lg' : ''
                            }`}
                    >
                        <button onClick={() => setCurrentPage('stageexp')} className="flex items-center ml-5 font-normal text-lg text-white font-calibri">
                            <img src={stageexp} className="square-full mx-3 w-4 h-4" alt="Stage Icon" />
                            <span>What are the 5 stages?</span>
                        </button>
                    </div>

                    
                        {/* In Progress */}
                        <div className="flex flex-col ml-8 mt-10 font-normal text-base leading-5 text-[#ababad] text-opacity-80 font-calibri">
                            In Progress


                            <div className="max-h-[180px] overflow-y-auto" ref={containerRef}>{currChats}</div>
                        </div>


                        {/* Completed */}
                        <div className="flex flex-col ml-8 mt-8 font-normal text-base leading-5 text-[#ababad] text-opacity-80 font-calibri">
                            Completed
                            <div className="max-h-[200px] overflow-y-auto">{doneChats}</div>
                        </div>
                    

                    {/* Divider */}
                    <hr className="absolute bottom-20 w-full bg-[#eeeeee] opacity-20" />

                    {/* Menu items */}
                    <div
                        className={`flex absolute bottom-8 w-full h-fit p-2 hover:bg-[#1e1e1e] rounded-lg ${(currentPage === "useterms") ? 'bg-[#1e1e1e] rounded-lg pr-28 p1-6 pt-1' : ''
                            }`}
                    >
                        <button onClick={() => setCurrentPage('useterms')} className="ml-5 font-normal text-lg leading-5 text-white font-calibri">
                            Terms of use
                        </button>
                    </div>
                
            </div>
        </>
    )
};

