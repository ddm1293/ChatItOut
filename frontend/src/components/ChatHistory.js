import React, { useContext, useEffect, useState } from 'react';
import chathist from "../assets/icon_chathist.png";
import Stage from '../Stage';
import { HistoryContext, HistoryContextProvider } from '../HistoryContext';

export default function ChatHistory(props) {
    const [startState, setStartState] = useState(props.startState);
    const time = props.startState.time;
    const {currChatHist, setCurrChatHist} = useContext(HistoryContext);

    const dbReq = indexedDB.open("chathistory", 1);
    
    const getTime = (today) => {
        let hours = today.getHours();
        let mins = today.getMinutes();
        let minsString = mins < 10 ? `0${mins}` : `${mins}`;
        let timeOfDay = hours < 12 ? 'am' : 'pm';
        hours = hours % 12 || 12;

        let month = today.toLocaleString('default', {month: 'short'});
        let day = today.getDay();
        let year = today.getFullYear();

        return `${hours}:${minsString}${timeOfDay} ${month} ${day}, ${year}`;
    }

    useEffect(() => {
        let dbReq = indexedDB.open("chathistory", 1);

        dbReq.onsuccess = function(evt) {
            let db = dbReq.result;
            const tx = db.transaction('current', 'readwrite');
            const store = tx.objectStore('current');
            store.add(startState);
        }

        setCurrChatHist(startState);
    }, []);

    const updateStartState = () => {
        console.log('here');
        dbReq.onsuccess = function(evt) {
            console.log('hi');
            let db = dbReq.result;
            const tx = db.transaction('current', 'readonly');
            const store = tx.objectStore('current');
            const updatedState = store.get([time]);
            console.log(updatedState);
            setCurrChatHist(updatedState);
        }
        dbReq.onerror = function(err) {
            console.log('fu');
            //console.log(err);
        }
        dbReq.onerror = console.log('why the fuck');
        //setCurrChatHist(startState);
    }

    return (
        <>
            <button onClick={() => setCurrChatHist(startState)} className='font-normal text-lg leading-5 text-white font-calibri'>
                <img src={chathist}/>
                {getTime(time)}
            </button>
        </>
    ) 
}


// each ChatHistory can be associated with a key for the IndexedDB.
// - so when it passes its info to ChatBot to display the messages, msgs are
//   saved to the key in IndexedDB assoaciated with the current ChatHistory
// - so maybe ChatHistory doesn't even need the list of messages, it just needs
//   the IndexedDB key which it sends to ChatBot which can then update its message
//   state
// - so loading would be going through all keys in IndexedDB and creating
//   a new component accordingly (done in LeftSideBar on startup + reload?)
