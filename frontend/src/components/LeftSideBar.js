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
        console.log(chatToDeleteTime);

        // Update UI
        let newChats = [];
        console.log(chatToDelete);
        if (chatToDelete.stage.name === 'complete') {
            console.log('delete a complete');
            for (let doneChat of doneChats) {
                console.log(doneChat.key);
                if (doneChat.key != chatToDeleteTime) {
                    newChats.push(doneChat);
                }
            }
            setDoneChats(newChats);
        } else {
            for (let currChat of currChats) {
                console.log(currChat.key);
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
            <div className="fixed flex h-screen bg-[#333333] inset-y-0 left-0 w-1/5">
                    {/* Title */}
                    <Link to={"/welcome"}>
                    <button className="absolute top-6 h-29 left-7 font-bold text-2xl text-white font-calibri">
                    Chat IT Out
                    </button>
                    </Link>

                    {/* Divider */}
                    <div className="absolute top-20 left-0 h-px bg-[#eeeeee] opacity-20 w-full"></div>

                    {/* New Chat Icon */}
                    <img src={newchat} className="absolute left-8 top-28 rounded-full" />

                    {/* New Chat */} {/* When the user clicks, a new instance of the chathistory component should be created*/}
                    <button onClick={newChat} className="absolute left-14 top-28 font-normal text-lg leading-5 text-white font-calibri">
                        New Chat 
                    </button>

                    {/* What are 5 stages? */}
                    <Link to= {"/stageexp"}>
                    <div
                        className={`flex absolute left-1 top-40 w-80 h-10 ${
                        (useLocation().pathname === "/stageexp") ? 'bg-[#1e1e1e] rounded-lg pr-28 p1-6 pt-1' : ''
                        }`}
                    >
                        <button className="flex items-center absolute left-4 font-normal text-lg text-white font-calibri">
                        <img src={stageexp} className="left-2 top-2 square-full mx-3" alt="Stage Icon" />
                        <span>What are 5 stages?</span>
                        </button>
                    </div>
                    </Link>

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
                    <div className="absolute bottom-28 left-0 h-px bg-[#eeeeee] opacity-20 w-full"></div>

                    {/* Menu items */}
                    <Link to={'/useragreement'}>
                    <div
                        className={`flex absolute left-1 bottom-12 w-80 h-10 ${
                        (useLocation().pathname === "/useragreement") ? 'bg-[#1e1e1e] rounded-lg pr-28 p1-6 pt-1' : ''
                        }`}
                    >
                    <button className="absolute left-6 font-normal text-lg leading-5 text-white font-calibri">
                        Terms of use
                    </button>
                    </div>
                    </Link>

            </div>
        </>
    )
}