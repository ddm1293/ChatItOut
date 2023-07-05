import React, { useContext, useEffect, useState } from 'react';
import LeftSideBar from "../components/LeftSideBar"
import Chatbot from '../components/Chatbot'
import { openDB } from 'idb';
import { HistoryContext, HistoryContextProvider } from '../HistoryContext';
import ChatStage from '../ChatStage';


export default function HomePage() {
    const [currChatHist, setCurrChatHist] = useState({messages: {invitation: [], connection: [], exchange: [], agreement: [], reflection: []}, stage: new ChatStage()});
    const value = {currChatHist, setCurrChatHist};

    // Open DB
    useEffect(() => {
        async function createDB() {
            // Using https://github.com/jakearchibald/idb
            return await openDB('chathistory', 1, {
                upgrade(db, oldVersion, newVersion, transaction) {
                    // Switch over the oldVersion, *without breaks*, to allow the database to be incrementally upgraded.
                    switch(oldVersion) {
                        case 0:
                            // Placeholder to execute when database is created (oldVersion is 0)
                        case 1:
                            // Create a store of objects
                            const currStore = db.createObjectStore('current', {
                                // The `time` property of the object will be the key, and be incremented automatically
                                autoIncrement: true,
                                keyPath: 'time'
                            });
                            const doneStore = db.createObjectStore('completed', {
                                autoIncrement: true,
                                keyPath: 'time'
                            });
                    }
                }
            });
        }
        createDB();
    }, [])

    return (
        <>
            <HistoryContext.Provider value={value}>
                <div className="bg-[#1e1e1e] flex h-screen">
                    <div>
                        <LeftSideBar />
                        <Chatbot />
                    </div>
                </div>
            </HistoryContext.Provider>
        </>
    )
}