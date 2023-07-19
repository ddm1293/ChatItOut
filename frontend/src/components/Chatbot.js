import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import send from "../assets/icon_send.png";
import axios from 'axios';
import stagearrow from "../assets/icon_stagearrow.png";
import { ChatCompleteContext, HistoryContext, HistoryContextProvider } from '../ChatContexts';
import stagecomplete from "../assets/icon_stagecomplete.png";
import ailogo from "../assets/icon_ailogo.png";
import ChatStage from '../ChatStage';
import Loading from './Loading';
import StageLine from './StageLine';

const serverURL = "http://localhost:5000";


export default function Chatbot() {
    const { currChatHist, setCurrChatHist } = useContext(HistoryContext);
    const { chatToComplete, setChatToComplete } = useContext(ChatCompleteContext);

    const [messages, setMessages] = useState(currChatHist.messages);
    const globalStage = currChatHist.stage;
    const [localStage, setLocalStage] = useState(globalStage);
    const [atStartRef, setAtStartRef] = useState(currChatHist.atStartRef);

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

    const generateResponse = async (msg) => {
        // let responses = ["Hello, how are you?", "That is a bad idea.", "You are very intelligent!"];
        // let i = Math.floor((Math.random() * 3));
        // if (i === 2) {
        //     advanceStage();
        // }
        // return responses[i];

        let context = getAllMessages();
        let input = { context: context, newMsg: msg, stage: getStageNum()};

        try {
            let resp = await axios.post(`${serverURL}/home/chat`, input, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(resp.data);
            return resp.data;
        } catch (err) {
            console.log(err);
            return "An error occured. Please try again later."
        }
    }

    useEffect(() => {
        setMessages(currChatHist.messages);
        setAtStartRef(currChatHist.atStartRef);
        setStageProgress(currChatHist.stage)
        setLocalStage(currChatHist.stage);
    }, [currChatHist])

    const handleUserInput = (content) => {
        content.preventDefault();
        const userInput = content.target.userInput.value;
        const chatbotMessage = generateResponse();

        if (globalStage.name !== "complete") {
            let stageMessages = messages[globalStage.name];
            stageMessages.push({ type: 'user', message: userInput });
            stageMessages.push({ type: 'chatbot', message: chatbotMessage });

        content.target.userInput.value = "";
        setChatbotLoading(true);
        stageMessages.push({ type: 'user', message: userInput });
        setMessages({
            ...messages,
            [globalStage.name]: stageMessages
        });

        generateResponse(userInput).then((chatbotResp) => {
            console.log(globalStage);
            console.log(stageMessages);
            setChatbotLoading(false);
            let chatbotStage = getStage(chatbotResp.stage);
            let addLine = false;

            // Transition stage
            if (chatbotStage !== localStage.name) {
                console.log(chatbotStage);
                addLine = true;
                if (chatbotStage === 'reflection') {
                    setAtStartRef(true);
                    stageMessages.push({ type: 'newStage', message: 'The chat is over for now. Please come back and start reflection once you are ready!' });
                    addLine = false;
                }
                if (chatbotStage !== 'complete') {
                    stageMessages = messages[chatbotStage];
                    advanceStage();
                }
            }

            // Add stage line break
            let msg = chatbotResp.ai;
            console.log(stageMessages);
            if (addLine && chatbotStage === 'complete') { // add msg before line
                stageMessages.push({ type: 'chatbot', message: msg });
                stageMessages.push({ type: 'newStage', message: chatbotStage });
                advanceStage();
            } else if (addLine) { // add line before msg
                stageMessages.push({ type: 'newStage', message: chatbotStage });
                stageMessages.push({ type: 'chatbot', message: msg });
            } else { // no line
                stageMessages.push({ type: 'chatbot', message: msg });
            }
    
            setMessages({
                ...messages,
                [globalStage.name === "complete" ? "reflection" : globalStage.name]: stageMessages
            });
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
            case 6:
                return "complete";
            default:
                return "";
        }
    }

    const getStageNum = () => {
        switch (globalStage.name) {
            case "invitation":
                return 1;
            case "connection":
                return 2;
            case "exchange":
                return 3;
            case "agreement":
                return 4;
            case "reflection":
                return 5;
            case "complete":
                return 6;
            default:
                return -1;
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
                //setRefStage("inProgress");
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
                currChatHist.atStartRef ? setRefStage("notStarted") : setRefStage("inProgress");
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
    const scrollToStage = (stage) => {
        // just scroll to top for Invitation stage?
        // unless we have a not started and then the chatbot transitions into the invitation stage...
        if (stage === "invitation") {
            containerRef.current.scrollTop = 0;
            return;
        }
        document.getElementById(`stageLine-${stage}`).scrollIntoView({behavior: 'smooth'});
    }

    useEffect(() => {
        console.log(messages);
        if (isOnline) containerRef.current.scrollTop = containerRef.current.scrollHeight;

        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        let updatedContext = { messages: messages, time: currChatHist.time, stage: globalStage, atStartRef: atStartRef }
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
                                    <div>{message.type === 'newStage' ? <StageLine key={globalStage} text={message.message}/> :
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
                                    }
                                    </div>
                                ))}
                            </div>
                            <div className={`flex w-full items-center ${ globalStage.name === "complete" ? 'hidden' : ''}`}>
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

                        {/* Left Status Bar */}
                        <div className="absolute w-4/5 h-20 bg-[#242424] flex right-0 top-0">
                            <button onClick={() => scrollToStage('invitation')} className='group'>
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

                            <button onClick={() => scrollToStage('connection')} className='group' disabled={conStage === "notStarted"}>
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

                            <button onClick={() => scrollToStage('exchange')} className='group' disabled={excStage === "notStarted"}>
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

                            <button onClick={() => scrollToStage('agreement')} className='group' disabled={agrStage === "notStarted"}>
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

                            <button onClick={() => scrollToStage('reflection')} className='group' disabled={refStage === "notStarted"}>
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