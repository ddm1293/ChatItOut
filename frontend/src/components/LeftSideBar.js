import { useContext, useEffect, useState } from "react";
import React from 'react';
import newchat from "../assets/icon_newchat.png";
import stageexp from "../assets/icon_stageexp.png";
import ChatHistory from "../components/ChatHistory";
import { HistoryContext, HistoryContextProvider } from '../HistoryContext';
import Stage from '../Stage';

export default function LeftSideBar() {
    const [currChats, setCurrChats] = useState([]);
    const [doneChats, setDoneChats] = useState([]);
    const {currChatHist, setCurrChatHist} = useContext(HistoryContext);
    const value = {currChatHist, setCurrChatHist};

    const dbReq = indexedDB.open("chathistory", 1);

    const loadChats = () => {
        dbReq.onsuccess = async function(evt) {
            let db = dbReq.result;
            if (!db.objectStoreNames.contains('current')) {
                return;
            }

            // load current chats
            const currTx = await db.transaction('current', 'readonly');
            const currStore = currTx.objectStore('current');
            let currDBChatsObj = await currStore.getAll();
            currDBChatsObj.onsuccess = () => {
                let currDBChats = currDBChatsObj.result;
                let chatHistories = []
                for (let dbChat of currDBChats) {
                    chatHistories.push(<ChatHistory key={dbChat.time} startState={dbChat} />);
                }
                setCurrChats(currChats.concat(chatHistories));
            }

            // load completed chats
            const doneTx = await db.transaction('completed', 'readonly');
            const doneStore = doneTx.objectStore('completed');
            let doneDBChatsObj = await doneStore.getAll();
            doneDBChatsObj.onsuccess = () => {
                let doneDBChats = doneDBChatsObj.result;
                let chatHistories = []
                for (let dbChat of doneDBChats) {
                    chatHistories.push(<ChatHistory key={dbChat.time} startState={dbChat} />);
                }
                setDoneChats(doneChats.concat(chatHistories));
            }
        }
        // read from db
        // for each object, add a new ChatHistory to the correct array
        //   - if stage is complete, it goes in doneChats
        //   - pass the ChatHist the object from db (to set its startState)
    }

    const newChat = () => {
        let today = new Date();
        let emptyStart = {messages: {invitation: [], connection: [], exchange: [], agreement: [], reflection: []}, stage: new Stage()};
        emptyStart.time = today;
        setCurrChats(currChats.concat([<ChatHistory key={today} startState={emptyStart} />]));
        // switch welcome page to Chatbot pg with a blank startState
    }

    useEffect(() => {
        loadChats();
    }, []);

    return (
        <>
            <div className="fixed flex h-screen bg-[#333333] inset-y-0 left-0 w-1/5">
                    {/* Title */}
                    <div className="absolute inset-x-0 top-6 h-29 left-6 font-bold text-2xl text-white font-calibri">
                    CONFLICT RESOLVER
                    </div>

                    {/* Divider */}
                    <div className="absolute top-20 left-0 h-px bg-[#eeeeee] opacity-20 w-full"></div>

                    {/* New Chat Icon */}
                    <img src={newchat} className="absolute left-10 top-28 rounded-full" />

                    {/* New Chat */} {/* When the user clicks, a new instance of the chathistory component should be created*/}
                    <button onClick={newChat} className="absolute left-16 top-28 font-normal text-lg leading-5 text-white font-calibri">
                        New Chat 
                    </button>

                    {/* Stage Explanation Icon */}
                    <img src={stageexp} className="absolute left-10 top-40 square-full" />

                    {/* What are 5 stages? */}
                    <div className="absolute left-16 top-40 font-normal text-lg leading-5 text-white font-calibri">
                        What are 5 stages?
                    </div>

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

                    <div className="absolute left-10 bottom-16 font-normal text-lg leading-5 text-white font-calibri">
                        Terms of use
                    </div>

            </div>
        </>
    )
}