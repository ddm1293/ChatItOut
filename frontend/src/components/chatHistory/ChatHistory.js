import React, { useEffect, useState } from 'react';
import chathist from "../../assets/icon_chathist.png";
import chathistDark from "../../assets/icon_chathist_dark.png";
import email from "../../assets/icon_sendemail.png";
import emailDark from "../../assets/icon_sendemail_dark.png";
import download from "../../assets/icon_download.png";
import downloadDark from "../../assets/icon_download_dark.png";
import trash from "../../assets/icon_trashchat.png";
import trashDark from "../../assets/icon_trashchat_dark.png";
import chatdone from "../../assets/icon_chatdone.png";
import confirm from "../../assets/icon_confirm.png";
import confirmDark from "../../assets/icon_confirm_dark.png";
import cancel from "../../assets/icon_cancel.png";
import cancelDark from "../../assets/icon_cancel_dark.png";
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentPage, setCurrPage } from '../../slices/sideBarSlice'
import { selectCurrChat, setCurrChat } from '../../slices/currChatSlice';
import { removeChat } from '../../slices/chatSlice'
import { deteleChatInDB } from '../../slices/chatThunk'
import { selectChatWithSessionId } from '../../slices/chatSlice'
import { downloadChatPDF, sendEmail, timeString } from './chatHistoryUtils';

export default function ChatHistory({ sessionId }) {
    const dispatch = useDispatch();

    const currChat = useSelector(selectCurrChat);
    const currPage = useSelector(selectCurrentPage);
    const chat = useSelector(selectChatWithSessionId(sessionId))

    const [confirmDelete, setConfirmDelete] = useState(false);

    //check if the screen width is larger than 1024px
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        function handleResize() {
            setIsLargeScreen(window.innerWidth >= 1024);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // const deleteSession = async (session_id) => {
    //     try {
    //         let resp = await axios.delete(`${serverURL}/chat/${session_id}`);
    //         console.log("see response data: ", resp.data)
    //     } catch (err) {
    //         console.log(err);
    //         return "An error occured. Please try again later."
    //     }
    // }

    // Sets this chat to be deleted from SideBar.js
    const deleteChat = () => {
        // update UI
        dispatch(removeChat(sessionId))
        if (sessionId === currChat.sessionId) {
            dispatch(setCurrPage('welcome'));
        }
        setConfirmDelete(false);

        // update DB
        dispatch(deteleChatInDB(sessionId))
        // await deleteSession(sessionId)
    }

    // Determines if the chat icon should be the in progress icon or the completed icon
    const determineChatIcon = () => {
        if (chat.stage === 'complete') {
            return chatdone;
        } else if (confirmDelete.current) {
            return trash;
        } else {
            return chathist;
        }
    }
    const determineChatIconDark = () => {
        if (chat.stage === 'complete') {
            return chatdone;
        } else if (confirmDelete.current) {
            return trashDark;
        } else {
            return chathistDark;
        }
    }

    // Changes homepage to display this chat
    const setChat = async () => {
        dispatch(setCurrChat(chat))
        if (currPage !== 'home') {
            dispatch(setCurrPage('home'));
        }
    }

    // Determines if this chat is currently open
    const onChat = sessionId === currChat.sessionId && currPage === 'home';

    return (
        <>
            <div className={`group grid grid-cols-10 items-center justify-end hover:bg-[#D9D9D9] lg:hover:bg-[#1e1e1e] rounded-lg ${onChat ? 'bg-[#D9D9D9] lg:bg-[#1e1e1e]' : ''}`}>
             {/* Chat history widget */}
                <button onClick={() => setChat()} className='font-normal text-base leading-5 text-black lg:text-white font-calibri py-2 col-span-2'>
                    <div className="flex items-center z-10">
                        <img className={`ml-7 w-4 h-4 ${isLargeScreen ? 'visible' : 'hidden'}`} src={determineChatIcon()} alt="Chat Icon" />
                        <img className={`ml-7 w-4 h-4 ${isLargeScreen ? 'hidden' : 'visible'}`} src={determineChatIconDark()} alt="Chat Icon" />
                        <div className="flex flex-col items-start pl-2">
                            <span className="whitespace-nowrap">{chat.sessionName}</span>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{timeString(chat.time)}</span>
                        </div>
                    </div>
                </button>


        
                {!confirmDelete ?
                // Hide these buttons when delete button is clicked 
                <div className='buttons grid grid-cols-3 col-span-3 col-start-8 h-11 z-40 mr-0 bg-gradient-lg'>
                    {/* Download button */}
                        <button onClick={() => downloadChatPDF(chat.messages)} className='justify-self-center'>
                            <img className={`ml-0 w-4 opacity-70 hover:opacity-100 group-hover:visible ${onChat ? 'visible' : 'invisible'} ${isLargeScreen ? 'visible' : 'hidden'}`} src={download} />
                            <img className={`ml-0 w-4 opacity-70 hover:opacity-100 group-hover:visible ${onChat ? 'visible' : 'invisible'} ${isLargeScreen ? 'hidden' : 'visible'}`} src={downloadDark} />
                        </button>
                        {/* Share button */}
                        <button onClick={() => sendEmail(chat.messages)} className='justify-self-center'>
                        <img className={`ml-0 w-4 opacity-70 hover:opacity-100 group-hover:visible ${onChat ? 'visible' : 'invisible'} ${isLargeScreen ? 'visible' : 'hidden'}`} src={email} />
                        <img className={`ml-0 w-4 opacity-70 hover:opacity-100 group-hover:visible ${onChat ? 'visible' : 'invisible'} ${isLargeScreen ? 'hidden' : 'visible'}`} src={emailDark} />
                        </button>
                        {/* Delete button */}
                    <button onClick={() => { setConfirmDelete(true) }} className='justify-self-center'>
                        <img className={`mr-0 w-4 opacity-70 hover:opacity-100 group-hover:visible ${onChat ? 'visible' : 'invisible'} ${isLargeScreen ? 'visible' : 'hidden'}`} src={trash} />
                        <img className={`mr-0 w-4 opacity-70 hover:opacity-100 group-hover:visible ${onChat ? 'visible' : 'invisible'} ${isLargeScreen ? 'hidden' : 'visible'}`} src={trashDark} />
                    </button>

                </div>
                 :
                    // Delete twice confirmation buttons
                    <div className='buttons grid grid-cols-2 col-start-9 col-span-2 h-11 z-40 bg-gradient-lg'>
                        <button onClick={() => deleteChat()} className='justify-self-center'>
                            <img className={`ml-0  px-1 w-6 opacity-70 hover:opacity-100 ${isLargeScreen ? 'visible' : 'hidden'}`} src={confirm} />
                            <img className={`ml-0  px-1 w-6 opacity-70 hover:opacity-100 ${isLargeScreen ? 'hidden' : 'visible'}`} src={confirmDark} />
                        </button>

                        <button onClick={() => { setConfirmDelete(false) }} className='justify-self-center'>
                            <img className={`mr-0 px-1 w-5 opacity-70 hover:opacity-100 ${isLargeScreen ? 'visible' : 'hidden'}`} src={cancel} />
                            <img className={`mr-0 px-1 w-5 opacity-70 hover:opacity-100 ${isLargeScreen ? 'hidden' : 'visible'}`} src={cancelDark} />
                        </button>
                     </div>
                 }
            </div>

        </>
    )
}

