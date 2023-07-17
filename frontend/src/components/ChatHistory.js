import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import chathist from "../assets/icon_chathist.png";
import email from "../assets/icon_sendemail.png";
import download from "../assets/icon_download.png";
import trash from "../assets/icon_trashchat.png";
import chatdone from "../assets/icon_chatdone.png";
import { ChatDeleteContext, HistoryContext } from '../ChatContexts';
import { jsPDF } from 'jspdf';

export default function ChatHistory(props) {
    const [startState, setStartState] = useState(props.startState);
    const time = props.startState.time;
    const { currChatHist, setCurrChatHist } = useContext(HistoryContext);
    const { chatToDelete, setChatToDelete } = useContext(ChatDeleteContext);
    const navigate = useNavigate();

    const getTime = (today) => {
        let hours = today.getHours();
        let mins = today.getMinutes();
        let minsString = mins < 10 ? `0${mins}` : `${mins}`;
        let timeOfDay = hours < 12 ? 'am' : 'pm';
        hours = hours % 12 || 12;

        let month = today.toLocaleString('default', { month: 'short' });
        let day = today.getDate();
        let year = today.getFullYear();

        return `${hours}:${minsString}${timeOfDay} ${month} ${day}, ${year}`;
    }

    const getStageMessages = (stageMsgs) => {
        let output = '';
        if (stageMsgs.length === 0) {
            return '*not started*\n\n'
        }
        for (let msg of stageMsgs) {
            msg.type === 'user' ? output += 'You: ' : output += 'Coach: ';
            output += `${msg.message}\n\n`;
        }
        return output;
    }

    const formatData = () => {
        let messages = startState.messages;
        let output = '-- INVITATION STAGE --\n\n';
        output += getStageMessages(messages['invitation']);
        output += '\n\n-- CONNECTION STAGE --\n\n';
        output += getStageMessages(messages['connection']);
        output += '\n\n-- EXCHANGE STAGE --\n\n';
        output += getStageMessages(messages['exchange']);
        output += '\n\n-- AGREEMENT STAGE --\n\n';
        output += getStageMessages(messages['agreement']);
        output += '\n\n-- REFLECTION STAGE --\n\n';
        output += getStageMessages(messages['reflection']);
        console.log(output);
        return output;

    }

    const sendEmail = async () => {
        let chat = formatData();
        const shareData = {
            text: chat
        }
        try { // TODO: check if canShare first? 
            await navigator.share(shareData);
            console.log('Chat shared succesfully');
        } catch (err) {
            console.log(err);
        }
    }

    const downloadChatPDF = () => {
        let chat = formatData();

        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;

        const wrappedText = doc.splitTextToSize(chat, 180);
        doc.setFontSize(12);
        let iterations = 1;
        const margin = 15; //top and botton margin in mm
        const defaultYJump = 5; // default space btw lines

        wrappedText.forEach((line) => {
            let posY = margin + defaultYJump * iterations++;
            if (posY > pageHeight - margin) {
                doc.addPage();
                iterations = 1;
                posY = margin + defaultYJump * iterations++;
            }
            doc.text(15, posY, line);
        });

        doc.save("chat.pdf");
    }

    const downloadChatTXT = () => {
        let chat = formatData();

        const link = document.createElement('a');
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(chat));
        link.setAttribute('download', `chat.txt`);
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const deleteChat = () => {
        setChatToDelete({ stage: startState.stage, time: time });
        if (time.getTime() == currChatHist.time.getTime()) {
            // TODO: if this chat is currently open, switch back to welcome page
            //navigate('/welcome');
        }
    }

    useEffect(() => {
        let dbReq = indexedDB.open("chathistory", 1);

        dbReq.onsuccess = function (evt) {
            let db = dbReq.result;
            if (!db.objectStoreNames.contains('chats')) {
                return;
            }
            const tx = db.transaction('chats', 'readwrite');
            const store = tx.objectStore('chats');
            store.add(startState);
        }

        setCurrChatHist(startState);
    }, []);


    return (
        <>
            <div className={`group hover:bg-[#1e1e1e] rounded-lg ${time.getTime() == currChatHist.time.getTime() ? 'bg-[#1e1e1e]' : ''}`}>
                <button onClick={() => setCurrChatHist(startState)} className='font-normal text-lg leading-5 text-white font-calibri py-2'>
                    <div className="flex">
                        <img className="px-1" src={startState.stage.name === 'complete' ? chatdone : chathist} alt="Chat History" />
                        <span className="px-1"> {getTime(time)} </span>
                    </div>
                </button>
                <button onClick={() => downloadChatPDF()}>
                    <img className={`group-hover:visible ${time.getTime() == currChatHist.time.getTime() ? 'visible' : 'invisible'}`} src={download} />
                </button>
                <button onClick={() => sendEmail()}>
                    <img className={`group-hover:visible ${time.getTime() == currChatHist.time.getTime() ? 'visible' : 'invisible'}`} src={email} />
                </button>
                <button onClick={() => deleteChat()}>
                    <img className={`group-hover:visible ${time.getTime() == currChatHist.time.getTime() ? 'visible' : 'invisible'}`} src={trash} />
                </button>
            </div>
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
