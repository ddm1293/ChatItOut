import { useContext, useEffect, useState, useRef } from "react";
import React from 'react';
import { Link , useLocation } from "react-router-dom";
import newchat from "../assets/icon_newchat.png";
import stageexp from "../assets/icon_stageexp.png";
import ChatHistory from "../components/ChatHistory";
import { HistoryContext, ChatCompleteContext, ChatDeleteContext } from '../ChatContexts';
import ChatStage from "../ChatStage";

export default function LeftSideBar() {
    const [currChats, setCurrChats] = useState([]);
    const [doneChats, setDoneChats] = useState([]);
    const {currChatHist, setCurrChatHist} = useContext(HistoryContext);
    const value = {currChatHist, setCurrChatHist};

    const {chatToComplete, setChatToComplete} = useContext(ChatCompleteContext);
    const {chatToDelete, setChatToDelete} = useContext(ChatDeleteContext);

    let isInitialMount = useRef(true);

    const [clickedButton, setClickedButton] = useState(false);

    const handleButtonClick = () => {
        setClickedButton(true);
    };

    const loadDbReq = indexedDB.open("chathistory", 1);
    const delDbReq = indexedDB.open("chathistory", 1);

    const loadChats = () => {
        loadDbReq.onsuccess = async function(evt) {
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
                let currChatHistories = []
                let doneChatHistories = []
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
        // read from db
        // for each object, add a new ChatHistory to the correct array
        //   - if stage is complete, it goes in doneChats
        //   - pass the ChatHist the object from db (to set its startState)
    }

    const newChat = () => {
        let today = new Date();
        let emptyStart = {messages: {invitation: [], connection: [], exchange: [], agreement: [], reflection: []}, stage: new ChatStage()};
        emptyStart.time = today;
        setCurrChats(currChats.concat([<ChatHistory key={today.getTime()} startState={emptyStart} />]));
        // switch welcome page to Chatbot pg with a blank startState
    }

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
        delDbReq.onsuccess = async function(evt) {
            let db = delDbReq.result;
            if (!db.objectStoreNames.contains('chats')) {
                return;
            }
            const tx = await db.transaction('chats', 'readwrite');
            const store = tx.objectStore('chats');
            store.delete(chatToDelete.time);
        }
    }

    useEffect(() => {
        loadChats();
    }, []);

    useEffect(() => {
        completeChat();
    }, [chatToComplete]);

    useEffect(() => {
        deleteChat();
    }, [chatToDelete]);

    return (
        <>
            <div className="fixed flex h-screen bg-[#333333] inset-y-0 w-1/5">
                    {/* Title */}
                    <Link to={"/home"}>
                        <button className="absolute top-6 h-29 left-7 font-bold md:text-lg lg:text-2xl text-white font-calibri">
                            Chat IT Out
                        </button>
                    </Link>

                    {/* Divider */}
                    <div className="absolute top-20 left-0 h-px bg-[#eeeeee] opacity-20 w-full"></div>

                    {/* New Chat */} {/* When the user clicks, a new instance of the chathistory component should be created*/}  
                    <div className="flex absolute top-28">
                        <img src={newchat} className="w-4 h-4 md:mx-4 lg:mx-8 my-2 rounded-full" alt="New Chat Icon" />
                        <span>
                            <button onClick={newChat} className="md:text-base lg:text-lg leading-5 text-white font-calibri px-2">
                                New Chat 
                            </button>
                        </span>
                    </div>

                    {/* Stage Explanation */} {/* When the user clicks, explanations of 5 stages should load*/} 
                    <div
                        className={`flex absolute top-40 align-center ${
                        (useLocation().pathname === "/stageexp") ? 'flex bg-[#1e1e1e] rounded-lg w-full h-12 items-center' : ''
                        }`}
                        >
                        <img src={stageexp} className="w-4 h-4 md:mx-4 lg:mx-8 my-2 square-full" alt="Stage Icon" />
                        <span>
                            <a href="/stageexp" className="md:text-base lg:text-lg leading-5 text-white font-calibri px-2">
                                What are 5 stages?
                            </a>
                        </span>
                    </div>

                    {/* Chat History */}
                    <HistoryContext.Provider value={value}>
                        {/* In Progress */}
                        <div className="absolute left-10 top-56 font-normal text-base leading-5 text-[#ababad] text-opacity-80 font-calibri">
                            In Progress
                            <div>{currChats}</div>
                        </div>

                        {/* Completed */}
                        <div className="absolute left-10 top-1/2 font-normal text-base leading-5 text-[#ababad] text-opacity-80 font-calibri">
                            Completed
                            <div>{doneChats}</div>
                        </div>
                    </HistoryContext.Provider>
                    

                    {/* Divider */}
                    <div className="absolute bottom-28 left-0 h-px bg-[#eeeeee] opacity-20 w-full" />

                    {/* Terms of use */}
                    <div
                        className={`flex absolute left-0 bottom-12 align-center ${
                        (useLocation().pathname === "/useragreement") ? 'flex bg-[#1e1e1e] rounded-lg w-full h-10' : ''
                        }`}
                    >
                        <span>
                            <a href="/useragreement" className="md:text-base lg:text-lg leading-5 text-white font-calibri px-3">
                                Terms of use
                            </a>
                        </span>
                    </div>

            </div>
        </>
    )
}