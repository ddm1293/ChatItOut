import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import send from "../assets/icon_send.png";
import axios from 'axios';
import stagearrow from "../assets/icon_stagearrow.png";
import { ChatCompleteContext, HistoryContext, HistoryContextProvider } from '../ChatContexts';
import stagecomplete from "../assets/icon_stagecomplete.png";
import ailogo from "../assets/icon_ailogo.png";
import ChatStage from '../ChatStage';
import Loading from './Loading';

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

    const [chatbotLoading, setChatbotLoading] = useState(false);

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

    const generateResponse = async (msg) => {
        // let responses = ["Hello, how are you?", "That is a bad idea.", "You are very intelligent!"];
        // let i = Math.floor((Math.random() * 3));
        // if (i === 2) {
        //     advanceStage();
        // }
        // return responses[i];

        let context = getAllMessages();
        let input = { context: context, newMsg: msg };

        try {
            let resp = await axios.post(`${serverURL}/home/chat`, input, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return resp.data;
        } catch (err) {
            console.log(err);
            return "An error occured. Please try again later."
        }

        // axios.post(`${serverURL}/home/chat`, input)
        // .then(function (response) {
        //     console.log(response.data);
        //     return response.data;
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
    }

    useEffect(() => {
        setMessages(currChatHist.messages);
        setLocalStage(currChatHist.stage);
        setStageProgress(currChatHist.stage);
    }, [currChatHist])

    const handleUserInput = async (content) => {
        if (globalStage.name === "complete") {
            return;
        }

        let stageMessages = messages[globalStage.name];

        content.preventDefault();
        const userInput = content.target.userInput.value;
        content.target.userInput.value = "";
        setChatbotLoading(true);
        stageMessages.push({ type: 'user', message: userInput });
        setMessages({
            ...messages,
            [globalStage.name]: stageMessages
        });

        generateResponse(userInput).then((chatbotResp) => {
            setChatbotLoading(false);
            let msg = chatbotResp.ai;
            stageMessages.push({ type: 'chatbot', message: msg });
            setMessages({
                ...messages,
                [globalStage.name]: stageMessages
            });
            if (getStage(chatbotResp.stage) !== localStage.name) {
                advanceStage();
            }
        })
    }

    const getStage = (stage) => {
        switch (stage) {
            case 1:
                return "invitation";
            case 2:
                return "connection";
            case 3:
                return "exchange";
            case 4:
                return "agreement";
            case 5:
                return "reflection";
            default:
                return "";
        }
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

    const scrollToStage = () => {
        // TODO
    }

    useEffect(() => {
        if (isOnline) containerRef.current.scrollTop = containerRef.current.scrollHeight;

        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        let updatedContext = { messages: messages, time: currChatHist.time, stage: globalStage }
        dbReq.onsuccess = function (evt) {
            let db = dbReq.result;
            if (!db.objectStoreNames.contains('chats') || (messages === currChatHist.messages && localStage === currChatHist.stage)) {
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

    return (
        <>
            <div>
                {!isOnline ? (
                    /* TODO: Offline page goes here */
                    <p>You are offline *sadge*</p>
                ) : (
                    <div>

                        <div className="absolute top-28 w-2/3 right-24 vg-[#1e1e1e] rounded-lg">
                            <div className="mb-4 max-h-[600px] overflow-y-auto" ref={containerRef}>
                                {getAllMessages().map((message, index) => (
                                    <div className={`flex flex-col basis-3/5" ${message.type === 'user' ? "items-end" : "items-start"}`}>

                                        <div className='flex'>
                                            <img src={ailogo} alt="Chatbot Logo" className={`items-start w-12 h-12 mt-1" ${message.type === 'user' ? "hidden" : ""}`} />

                                            <span
                                                key={index}
                                                className={`ml-10 mb-4 p-4 font-calibri text-base whitespace-pre-wrap max-w-fit' ${message.type === 'user' ? 'bg-white text-black rounded-tl-xl rounded-tr-xl rounded-bl-xl' : 'bg-[#e1e1e1] bg-opacity-10 text-white rounded-tl-xl rounded-tr-xl rounded-br-xl'
                                                    }`}
                                                style={{ display: 'inline-block' }}>

                                                {message.message}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {chatbotLoading ? <Loading /> : <></>}
                            </div>
                            <div className="absolute top-96 w-3/4 left-28">
                                <form onSubmit={handleUserInput}>
                                    <input
                                        type="text"
                                        name="userInput"
                                        className="absolute font-calibri font-sm justify-center top-56 w-full px-4 py-2 rounded-xl border text-[#bbbbbb] border-[#bbbbbb] bg-[#1e1e1e] focus:outline-none focus:ring focus:border-blue-500"
                                        placeholder="Send your message here"
                                    />
                                    <span>
                                        <button
                                            type="submit"
                                            className="absolute top-60 right-2 transform -translate-y-1/2 rounded-full p-2">
                                            <img src={send} className="w-4 h-4" />
                                        </button>
                                    </span>
                                </form>
                            </div>
                        </div>

                        {/* Left Status Bar */}
                        <div className="absolute w-4/5 h-20 bg-[#242424] flex right-0 top-0">
                            <button onClick={() => scrollToStage()} className='group'>
                                <span className={`flex absolute top-8 left-0 w-64 h-12 ${invStage === "inProgress" ? "border-b-4 border-[#1993D6]" : ""} group-hover:border-b-4 group-hover:border-[#1993D6]`}></span>
                                <div className="flex absolute top-8 left-20">
                                    <span className={`w-4 h-4 rounded-full ${invStage === "notStarted" ? "opacity-50 bg-white" : "opacity-100 bg-[#1993D6]"}`}> </span>
                                    <span className={`absolute left-1 -top-1 font-calibri text-14 leading-17 ${invStage === "completed" ? "opacity-0" : "text-black"}`}> 1 </span>
                                    {invStage === "completed" ? <img src={stagecomplete} className="absolute left-0 top-0 rounded-full w-4 h-4" alt="Stage Complete" /> : null}
                                    <span className={`absolute left-8 -top-2 text-lg leading-22 font-calibri ${wordColor(invStage)}`}>
                                        Invitation
                                    </span>
                                    <img src={stagearrow} className="absolute left-40 top-1 rounded-full" alt="Stage Arrow" />
                                </div>
                            </button>

                            <button onClick={() => scrollToStage()} className='group' disabled={conStage === "notStarted"}>
                                <span className={`flex absolute top-8 left-64 w-64 h-12 ${conStage === "inProgress" ? "border-b-4 border-[#1993D6]" : ""} ${conStage !== "notStarted" ? "group-hover:border-b-4 group-hover:border-[#1993D6]" : ""}`}></span>
                                <div className="flex absolute top-8 left-80">
                                    <span className={`w-4 h-4 rounded-full ${conStage === "notStarted" ? "opacity-50 bg-white" : "opacity-100 bg-[#1993D6]"}`}> </span>
                                    <span className={`absolute left-1 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 ${conStage === "completed" ? "opacity-0" : "text-black"}`}>2</span>
                                    {conStage === "completed" ? <img src={stagecomplete} className="absolute left-0 top-0 rounded-full w-4 h-4" alt="Stage Complete" /> : null}
                                    <span className={`absolute left-8 -top-2 text-lg leading-22 font-calibri ${wordColor(conStage)}`}>
                                        Connection
                                    </span>
                                    <img src={stagearrow} className="absolute left-44 top-1 rounded-full" alt="Stage Arrow" />
                                </div>
                            </button>

                            <button onClick={() => scrollToStage()} className='group' disabled={excStage === "notStarted"}>
                                <span className={`flex absolute top-8 left-[500px] w-64 h-12 ${excStage === "inProgress" ? "border-b-4 border-[#1993D6]" : ""} ${excStage !== "notStarted" ? "group-hover:border-b-4 group-hover:border-[#1993D6]" : ""}`}></span>
                                <div className="flex absolute top-8" style={{ left: '560px' }}>
                                    <span className={`w-4 h-4 rounded-full ${excStage === "notStarted" ? "opacity-50 bg-white" : "opacity-100 bg-[#1993D6]"}`}> </span>
                                    <span className={`absolute left-1 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 ${excStage === "completed" ? "opacity-0" : "text-black"}`}>3</span>
                                    {excStage === "completed" ? <img src={stagecomplete} className="absolute left-0 top-0 rounded-full w-4 h-4" alt="Stage Complete" /> : null}
                                    <span className={`absolute left-8 -top-2 text-lg leading-22 font-calibri ${wordColor(excStage)}`}>
                                        Exchange
                                    </span>
                                    <img src={stagearrow} className="absolute left-44 top-1 rounded-full" alt="Stage Arrow" />
                                </div>
                            </button>

                            <button onClick={() => scrollToStage()} className='group' disabled={agrStage === "notStarted"}>
                                <div className={`flex absolute top-8 left-[750px] w-60 h-12 ${agrStage === "inProgress" ? "border-b-4 border-[#1993D6]" : ""} ${agrStage !== "notStarted" ? "group-hover:border-b-4 group-hover:border-[#1993D6]" : ""}`}></div>
                                <div className="flex absolute top-8" style={{ left: '800px' }}>
                                    <span className={`w-4 h-4 rounded-full ${agrStage === "notStarted" ? "opacity-50 bg-white" : "opacity-100 bg-[#1993D6]"}`}> </span>
                                    <span className={`absolute left-1 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 ${agrStage === "completed" ? "opacity-0" : "text-black"}`}>4</span>
                                    {agrStage === "completed" ? <img src={stagecomplete} className="absolute left-0 top-0 rounded-full w-4 h-4" alt="Stage Complete" /> : null}
                                    <span className={`absolute left-8 -top-2 text-lg leading-22 font-calibri ${wordColor(agrStage)}`}>
                                        Agreement
                                    </span>
                                    <img className="absolute left-44 top-1 rounded-full" src={stagearrow} alt="Stage Arrow" />
                                </div>
                            </button>

                            <button onClick={() => scrollToStage()} className='group' disabled={refStage === "notStarted"}>
                                <div className={`flex absolute top-8 left-[990px] w-64 h-12 ${refStage === "inProgress" ? "border-b-4 border-[#1993D6]" : ""} ${refStage !== "notStarted" ? "group-hover:border-b-4 group-hover:border-[#1993D6]" : ""}`}></div>
                                <div className="flex absolute top-8" style={{ left: '1040px' }}>
                                    <span className={`w-4 h-4 rounded-full ${refStage === "notStarted" ? "opacity-50 bg-white" : "opacity-100 bg-[#1993D6]"}`}> </span>
                                    <span className={`absolute left-1 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 ${refStage === "completed" ? "opacity-0" : "text-black"}`}>5</span>
                                    {refStage === "completed" ? <img src={stagecomplete} className="absolute left-0 top-0 rounded-full w-4 h-4" alt="Stage Complete" /> : null}
                                    <span className={`absolute left-8 -top-2 text-lg leading-22 font-calibri ${wordColor(refStage)}`}>
                                        Reflection
                                    </span>
                                </div>
                            </button>
                        </div>

                    </div>
                )}
            </div>

        </>
    )
}