import React, { useContext, useEffect, useState } from 'react';
import chathist from "../assets/icon_chathist.png";
import email from "../assets/icon_sendemail.png";
import download from "../assets/icon_download.png";
import trash from "../assets/icon_trashchat.png";
import chatdone from "../assets/icon_chatdone.png";
import confirm from "../assets/icon_confirm.png";
import cancel from "../assets/icon_cancel.png";
import { ChatDeleteContext, HistoryContext } from '../ChatContexts';
import { SideBarContext } from '../components/PageRoute';
import { jsPDF } from 'jspdf';

export default function ChatHistory(props) {
    const [startState, setStartState] = useState(props.startState);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const time = props.startState.time;

    const { currChatHist, setCurrChatHist } = useContext(HistoryContext);
    const { chatToDelete, setChatToDelete } = useContext(ChatDeleteContext);
    const { currentPage, setCurrentPage } = useContext(SideBarContext);

    // Returns date as a formatted string (hh:mm am/pm M DD, YYYY)
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

    // Returns a formatted string of all the messages within a stage
    const getStageMessages = (stageMsgs) => {
        let output = '';
        if (stageMsgs.length === 0) {
            return '*not started*\n\n'
        }
        for (let msg of stageMsgs) {
            if (msg.type === 'newStage') {
                continue;
            }
            msg.type === 'user' ? output += 'You: ' : output += 'Coach: ';
            output += `${msg.message}\n\n`;
        }
        return output;
    }

    // Returns a formatted string of all of the messages in the conversation
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


    // Shares the conversation via email
    const sendEmail = () => {
        downloadChatPDF();
    
        // Create email subject and body
        const emailSubject = encodeURIComponent("My Chat History");
        const emailBody = encodeURIComponent("Hi, thanks for using Chat IT Out! \n\nPlease find attached my chat history.\n\nNote: Due to privacy limit, please manually attach the 'chat.pdf' file from your downloads.");
    
        // Create the mailto link
        const mailtoLink = `mailto:?subject=${emailSubject}&body=${emailBody}`;
    
        // Open the link in the current window
        window.location.href = mailtoLink;

        // Display alert
        alert("Your email client has been opened. Please attach the 'chat.pdf' file from your downloads.");

    }
    

    // Creates and saves a formatted PDF file of the conversation
    const downloadChatPDF = () => {
        let chat = formatData();

        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;

        const wrappedText = doc.splitTextToSize(chat, 235);
        doc.setFontSize(12);
        let iterations = 1;
        const margin = 15; //top and botton margin in mm
        const defaultYJump = 5; // default space btwn lines

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

     // Creates and saves a txt file of the conversation *unused*
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

    // Sets this chat to be deleted from SideBar.js
    const deleteChat = () => {
        setChatToDelete({ stage: startState.stage, time: time });
        if (time.getTime() == currChatHist.time.getTime()) {
            setCurrentPage('welcome');
        }
        setConfirmDelete(false);
    }

    // Determines if the chat icon should be the in progress icon or the completed icon
    const determineChatIcon = () => {
        if (startState.stage.name === 'complete') {
            return chatdone;
        } else if (confirmDelete.current) {
            return trash;
        } else {
            return chathist;
        }
    }

    // Changes homepage to display this chat
    const setChat = () => {
        setCurrChatHist(startState); 
        if (currentPage !== 'home') {
            setCurrentPage('home');
        }
    }

    // Determines if this chat is currently open
    const onChat = () => {
        return time.getTime() == currChatHist.time.getTime() && currentPage == 'home';
    }

    // Creates a new object in IndexedDB when a new chat is first created
    useEffect(() => {
        let dbReq = indexedDB.open("chathistory", 2);

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
            <div className={`group flex items-center hover:bg-[#1e1e1e] rounded-lg ${onChat() ? 'bg-[#1e1e1e]' : ''}`}>
                {/* Chat history widget */}
                <button onClick={() => setChat()} className='font-normal text-base leading-5 text-white font-calibri py-2'>
                    <div className="flex items-center z-10">
                        <img className="ml-6 w-4 h-4" src={determineChatIcon()} alt="Chat History" />
                        <span className="px-2 whitespace-nowrap"> {getTime(time)} </span>
                    </div>
                </button>
                
                {!confirmDelete ?
                    // Hide these buttons when delete button is clicked 
                    <div className='buttons flex h-11 z-40' style={{ background: 'linear-gradient(to right, rgba(51, 51, 51, 0) 0%, rgba(51, 51, 51, 0.97) 100%, rgba(51, 51, 51, 0.98) 100%, #333333 100%)' }}>
                        {/* Donwload button */}
                        <button onClick={() => downloadChatPDF()}>
                            <img className={`px-1 w-6 opacity-70 hover:opacity-100 group-hover:visible ${onChat() ? 'visible' : 'invisible'}`} src={download} />
                        </button>
                        {/* Share button */}
                        <button onClick={() => sendEmail()}>
                            <img className={`px-1 w-6 opacity-70 hover:opacity-100 group-hover:visible ${onChat() ? 'visible' : 'invisible'}`} src={email} />
                        </button>
                        {/* Delete button */}
                        <button onClick={() => { setConfirmDelete(true) }}>
                            <img className={`px-1 w-6 mr-9 opacity-70 hover:opacity-100 group-hover:visible ${onChat() ? 'visible' : 'invisible'}`} src={trash} />
                        </button>
                    </div>
                    :
                    // Delete twice confirmation buttons
                    <div className='buttons flex h-11 z-40' style={{ background: 'linear-gradient(to right, rgba(51, 51, 51, 0) 0%, rgba(51, 51, 51, 0.97) 100%, rgba(51, 51, 51, 0.98) 100%, #333333 100%)' }}>
                        <button onClick={() => deleteChat()}>
                            <img className={'ml-2 ml-9 px-1 w-6 opacity-70 hover:opacity-100'} src={confirm} />
                        </button>
                        <button onClick={() => { setConfirmDelete(false) }}>
                            <img className={'ml-1 mr-9 px-1 w-5 opacity-70 hover:opacity-100'} src={cancel} />
                        </button>
                    </div>
                }
            </div>
        </>
    )
}

