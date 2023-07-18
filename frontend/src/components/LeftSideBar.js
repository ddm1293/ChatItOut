import { useContext, useEffect, useState, useRef } from "react";
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import newchat from "../assets/icon_newchat.png";
import stageexp from "../assets/icon_stageexp.png";
import ChatHistory from "../components/ChatHistory";
import { HistoryContext, ChatCompleteContext, ChatDeleteContext } from '../ChatContexts';
import ChatStage from "../ChatStage";

export default function LeftSideBar() {
    const [currChats, setCurrChats] = useState([]);
    const [doneChats, setDoneChats] = useState([]);
    const { currChatHist, setCurrChatHist } = useContext(HistoryContext);
    const value = { currChatHist, setCurrChatHist };

    const { chatToComplete, setChatToComplete } = useContext(ChatCompleteContext);
    const { chatToDelete, setChatToDelete } = useContext(ChatDeleteContext);

    let isInitialMount = useRef(true);

    const [clickedButton, setClickedButton] = useState(false);

    const handleButtonClick = () => {
        setClickedButton(true);
    };

    const loadDbReq = indexedDB.open("chathistory", 1);
    const delDbReq = indexedDB.open("chathistory", 1);

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
        let emptyStart = { messages: { invitation: [{type: 'chatbot', message: 'Hey, how are you doing?'}], connection: [], exchange: [], agreement: [], reflection: [] }, stage: new ChatStage() };
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

                {/* New Chat */}
                <div className='flex absolute left-1 top-28 w-80 h-10 hover:bg-[#1e1e1e] rounded-lg'>
                    <button onClick={() => newChat()} className="flex items-center absolute left-4 font-normal text-lg text-white font-calibri">
                        <img src={newchat} className="left-2 top-2 square-full mx-3" alt="New Chat Icon" />
                        <span>New Chat</span>
                    </button>
                </div>


                {/* What are 5 stages? */}
                <Link to={"/stageexp"}>
                    <div
                        className={`flex absolute left-1 top-40 w-80 h-10 hover:bg-[#1e1e1e] rounded-lg ${(useLocation().pathname === "/stageexp") ? 'bg-[#1e1e1e] rounded-lg pr-28 p1-6 pt-1' : ''
                            }`}
                    >
                        <button className="flex items-center absolute left-4 font-normal text-lg text-white font-calibri">
                            <img src={stageexp} className="left-2 top-2 square-full mx-3" alt="Stage Icon" />
                            <span>What are the 5 stages?</span>
                        </button>
                    </div>
                </Link>

                <HistoryContext.Provider value={value}>
                    {/* In Progress */}
                    <div className="absolute left-10 top-56 font-normal text-base leading-5 text-[#ababad] text-opacity-80 font-calibri">
                        In Progress
                        <div className="max-h-[180px] overflow-y-auto">{currChats}</div>
                    </div>

                    {/* Completed */}
                    <div className="absolute left-10 top-1/2 font-normal text-base leading-5 text-[#ababad] text-opacity-80 font-calibri">
                        Completed
                        <div className="max-h-[200px] overflow-y-auto">{doneChats}</div>
                    </div>
                </HistoryContext.Provider>


                {/* Divider */}
                <div className="absolute bottom-28 left-0 h-px bg-[#eeeeee] opacity-20 w-full"></div>

                {/* Menu items */}
                <Link to={'/useragreement'}>
                    <div
                        className={`flex absolute left-1 bottom-12 w-80 h-10 hover:bg-[#1e1e1e] rounded-lg ${(useLocation().pathname === "/useragreement") ? 'bg-[#1e1e1e] rounded-lg pr-28 p1-6 pt-1' : ''
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