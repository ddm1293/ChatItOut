import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import send from "../assets/icon_send.png";
import axios from 'axios';
import stagearrow from "../assets/icon_stagearrow.png";
import { ChatCompleteContext, HistoryContext, HistoryContextProvider } from '../ChatContexts';
import stagecomplete from "../assets/icon_stagecomplete.png";
import ailogo from "../assets/icon_ailogo.png";
import ChatStage from '../ChatStage';

const serverURL = "http://localhost:5000";


export default function Chatbot() {
    const { currChatHist, setCurrChatHist } = useContext(HistoryContext);
    const { chatToComplete, setChatToComplete } = useContext(ChatCompleteContext);

    const [messages, setMessages] = useState(currChatHist.messages);
    const globalStage = currChatHist.stage;
    const [localStage, setLocalStage] = useState(globalStage);

    const [invStage, setInvStage] = useState("inProgress");
    const [conStage, setConStage] = useState("notStarted");
    const [excStage, setExcStage] = useState("notStarted");
    const [agrStage, setAgrStage] = useState("notStarted");
    const [refStage, setRefStage] = useState("notStarted");
    const containerRef = useRef(null);

    const isInitialMount = useRef(true);
    const dbReq = indexedDB.open("chathistory", 1);

    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Offline handling
    useEffect(() => {
        function onlineHandler() {
            setIsOnline(true);
        }

        function offlineHandler() {
            setIsOnline(false);
        }

        window.addEventListener("online", onlineHandler);
        window.addEventListener("offline", offlineHandler);


        return () => {
            window.removeEventListener("online", onlineHandler);
            window.removeEventListener("offline", offlineHandler);
        };
    }, []);

    const generateResponse = () => {
        let responses = ["Hello, how are you?", "That is a bad idea.", "You are very intelligent!"];
        let i = Math.floor((Math.random() * 3));
        if (i === 2) {
            advanceStage();
        }
        return responses[i];
    }

    useEffect(() => {
        setMessages(currChatHist.messages);
        setLocalStage(currChatHist.stage);
        setStageProgress(currChatHist.stage);
    }, [currChatHist])

    const handleUserInput = (content) => {
        content.preventDefault();
        const userInput = content.target.userInput.value;
        const chatbotMessage = generateResponse();

        if (globalStage.name !== "complete") {
            let stageMessages = messages[globalStage.name];
            stageMessages.push({ type: 'user', message: userInput });
            stageMessages.push({ type: 'chatbot', message: chatbotMessage });

            setMessages({
                ...messages,
                [globalStage.name]: stageMessages
            });
        }

        content.target.userInput.value = "";
    }

    const advanceStage = () => {
        switch (globalStage.name) {
            case "invitation":
                globalStage.setConnection();
                setInvStage("completed");
                setConStage("inProgress");
                break;
            case "connection":
                globalStage.setExchange();
                setConStage("completed");
                setExcStage("inProgress");
                break;
            case "exchange":
                globalStage.setAgreement();
                setExcStage("completed");
                setAgrStage("inProgress");
                break;
            case "agreement":
                globalStage.setReflection();
                setAgrStage("completed");
                setRefStage("inProgress");
                break;
            case "reflection":
                globalStage.setComplete();
                setRefStage("completed");
                // move this chat to doneChats in LeftSideBar
                setChatToComplete(currChatHist.time);
                break;
            default:
                console.log('something bad happened in advanceStage')
        }
        setLocalStage(new ChatStage(globalStage.name));
    }

    const setStageProgress = (stage) => {
        switch (stage.name) {
            case "invitation":
                setInvStage("inProgress");
                setConStage("notStarted");
                setExcStage("notStarted");
                setAgrStage("notStarted");
                setRefStage("notStarted");
                break;
            case "connection":
                setInvStage("completed");
                setConStage("inProgress");
                setExcStage("notStarted");
                setAgrStage("notStarted");
                setRefStage("notStarted");
                break;
            case "exchange":
                setInvStage("completed");
                setConStage("completed");
                setExcStage("inProgress");
                setAgrStage("notStarted");
                setRefStage("notStarted");
                break;
            case "agreement":
                setInvStage("completed");
                setConStage("completed");
                setExcStage("completed");
                setAgrStage("inProgress");
                setRefStage("notStarted");
                break;
            case "reflection":
                setInvStage("completed");
                setConStage("completed");
                setExcStage("completed");
                setAgrStage("completed");
                setRefStage("inProgress");
                break;
            case "complete":
                setInvStage("completed");
                setConStage("completed");
                setExcStage("completed");
                setAgrStage("completed");
                setRefStage("completed");
                break;
            default:
                console.log('something bad happened in setStageProgress');
        }
    }

    // Server solution
    // const saveToDisk = useCallback(() => {
    //     let info = {id: id, messages: messages}; 
    //     axios.post(`${serverURL}/home/chat/${id}`, info, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    //   }, [messages])

    useEffect(() => {
        if (isOnline) containerRef.current.scrollTop = containerRef.current.scrollHeight;

        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        let updatedContext = { messages: messages, time: currChatHist.time, stage: globalStage }
        dbReq.onsuccess = function (evt) {
            let db = dbReq.result;
            if (!db.objectStoreNames.contains('chats') || currChatHist.time === undefined) {
                return;
            }
            const tx = db.transaction('chats', 'readwrite');
            const store = tx.objectStore('chats');
            store.put(updatedContext);
        }
    }, [messages, localStage]);

    const getAllMessages = () => {
        let arr = [];
        let results = arr.concat(Object.values(messages));
        return results.flat();
    }

    const wordColor = (stage) => {
        if (stage === "notStarted") {
            return 'text-white opacity-50 font-normal';
        } else if (stage === "inProgress") {
            return 'text-white font-medium';
        } else {
            return 'text-white font-normal';
        }
    }

    const buttonColor = (stage) => {
        if (stage == "notStarted") {
            return 'opacity-50 bg-white';
        } else if (stage == "inProgress") {
            return 'opacity-100 bg-[#1993D6] text-black';
        } else {
            return 'opacity-100 bg-[#1993D6] text-opacity-0';
        }
    }

    return (
        <>
            <div>
                {!isOnline ? (
                    /* TODO: Offline page goes here */
                    <p>You are offline *sadge*</p>
                ) : (
                    <div>
                        
                        <div className="flex flex-col absolute top-24 md:top-12 right-0 w-full sm:w-4/5 px-8 py-12 h-screen">
                            <div className="w-full mb-4 h-[85%] overflow-y-auto" ref={containerRef}>
                                {getAllMessages().map((message, index) => (
                                    <div className={`flex flex-col basis-3/5 m-8" ${message.type === 'user' ? "items-end" : "items-start"}`}>

                                        <div className='flex'>
                                            <img src={ailogo} alt="Chatbot Logo" className={`items-start w-12 h-12 mt-1 ml-24" ${message.type === 'user' ? "hidden" : ""}`} />

                                            <span
                                                key={index}
                                                className={`ml-10 mb-4 p-4 font-calibri text-base text-center whitespace-pre-wrap max-w-fit' ${message.type === 'user' ? 'bg-white text-black rounded-tl-xl rounded-tr-xl rounded-bl-xl' : 'bg-[#e1e1e1] bg-opacity-10 text-white rounded-tl-xl rounded-tr-xl rounded-br-xl'
                                                    }`}
                                                style={{ display: 'inline-block' }}>

                                                {message.message}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex w-full items-center">
                                <form onSubmit={handleUserInput}>
                                    <input
                                        type="text"
                                        name="userInput"
                                        className="flex absolute w-11/12 px-4 py-2 font-calibri font-sm rounded-xl border text-[#bbbbbb] border-[#bbbbbb] bg-[#1e1e1e] focus:outline-none focus:ring focus:border-blue-500"
                                        placeholder="Send your message here"
                                    />
                                    <span>
                                        <button
                                            type="submit"
                                            className="absolute right-[8%] rounded-full transform translate-y-1/2">
                                            <img src={send} className="w-6 h-6" />
                                        </button>
                                    </span>
                                </form>
                            </div>
                        </div>

                        {/* Top Status Bar */}
                        <div className="flex flex-row w-full sm:w-4/5 h-20 bg-[#242424] absolute right-0 md:top-0 top-16">
                            <div className={`md:flex items-center max-w-[18%] md:min-w-[18%] h-20 border-b-4 ${invStage === "inProgress" ? "border-[#1993D6]" : "border-none"}`}>
                                <div className='p-4 place-content-center'>
                                <div className={`mx-5 md:mx-4 lg:mx-10 w-6 h-6 md:w-4 md:h-4 rounded-full inline-flex items-center justify-center font-calibri text-14 leading-17 ${buttonColor(invStage)}`}> 1 </div>
                                <p className={`text-base md:text-lg leading-22 font-calibri md: inline-flex ${wordColor(invStage)}`}>
                                    Invitation
                                </p>
                                </div>
                            </div>

                            <div className="flex max-w-xs items-center">
                                <img src={stagearrow} className="rounded-full" alt="Stage Arrow" />
                            </div>

                            <div className={`md:flex items-center max-w-[18%] md:min-w-[18%] h-20 border-b-4 ${conStage === "inProgress" ? "border-[#1993D6]" : "border-none"}`}>
                                <div className='p-4 place-content-center'>
                                <div className={`mx-5 md:mx-4 lg:mx-10 w-6 h-6 md:w-4 md:h-4 rounded-full inline-flex items-center justify-center font-calibri text-14 leading-17 ${buttonColor(conStage)}`}> 2 </div>
                                <p className={`text-base md:text-lg leading-22 font-calibri md: inline-flex ${wordColor(conStage)}`}>
                                    Connection
                                </p>
                                </div>
                            </div>

                            <div className="flex max-w-xs items-center">
                                <img src={stagearrow} className="rounded-full" alt="Stage Arrow" />
                            </div>

                            <div className={`md:flex items-center max-w-[18%] md:min-w-[18%] h-20 border-b-4 ${excStage === "inProgress" ? "border-[#1993D6]" : "border-none"}`}>
                                <div className='p-4 place-content-center'>
                                <div className={`mx-5 md:mx-4 lg:mx-10 w-6 h-6 md:w-4 md:h-4 rounded-full inline-flex items-center justify-center font-calibri text-14 leading-17 ${buttonColor(excStage)}`}> 3 </div>
                                <p className={`text-base md:text-lg leading-22 font-calibri md: inline-flex ${wordColor(excStage)}`}>
                                    Exchange
                                </p>
                                </div>
                            </div>

                            <div className="flex max-w-xs items-center">
                                <img src={stagearrow} className="rounded-full" alt="Stage Arrow" />
                            </div>

                            <div className={`md:flex items-center max-w-[18%] md:min-w-[18%] h-20 border-b-4 ${agrStage === "inProgress" ? "border-[#1993D6]" : "border-none"}`}>
                                <div className='p-4 place-content-center'>
                                <div className={`mx-5 md:mx-4 lg:mx-10 w-6 h-6 md:w-4 md:h-4 rounded-full inline-flex items-center justify-center font-calibri text-14 leading-17 ${buttonColor(agrStage)}`}> 4 </div>
                                <p className={`text-base md:text-lg leading-22 font-calibri md: inline-flex ${wordColor(agrStage)}`}>
                                    Agreement
                                </p>
                                </div>
                            </div>

                            <div className="flex max-w-xs items-center">
                                <img src={stagearrow} className="rounded-full" alt="Stage Arrow" />
                            </div>

                            <div className={`md:flex items-center max-w-[18%] md:min-w-[18%] h-20 border-b-4 ${refStage === "inProgress" ? "border-[#1993D6]" : "border-none"}`}>
                                <div className='p-4 place-content-center'>
                                <div className={`mx-5 md:mx-4 lg:mx-10 w-6 h-6 md:w-4 md:h-4 rounded-full inline-flex items-center justify-center font-calibri text-14 leading-17 ${buttonColor(refStage)}`}> 5 </div>
                                <p className={`text-base md:text-lg leading-22 font-calibri md: inline-flex ${wordColor(refStage)}`}>
                                    Reflection
                                </p>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </>
    )
}