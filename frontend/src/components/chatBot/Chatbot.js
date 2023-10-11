import React, { useState, useEffect, useRef, useContext } from 'react';
import send from "../../assets/icon_send.png";
import axios from 'axios';
import stagearrow from "../../assets/icon_stagearrow.png";
import { ChatCompleteContext, HistoryContext} from '../../ChatContexts';
import { SideBarContext } from '../PageRoute';
import stagecomplete from "../../assets/icon_stagecomplete.png";
import ailogo from "../../assets/icon_ailogo.png";
import pencil from "../../assets/icon_pencil.png";
import home from "../../assets/icon_home.png";
import offline from "../../assets/icon_nowifi.png";
import ChatStage from '../../ChatStage';
import Loading from '../Loading';
import StageLine from '../StageLine';
import StatusBar from '../../components/chatBot/StatusBar'

const serverURL = "http://127.0.0.1:5000";


export default function Chatbot() {
    const { currChatHist, setCurrChatHist } = useContext(HistoryContext);
    const { chatToComplete, setChatToComplete } = useContext(ChatCompleteContext);
    const { currentPage, setCurrentPage } = useContext(SideBarContext);
    const currentPageValue = {currentPage, setCurrentPage};

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

    const dbReq = indexedDB.open("chathistory", 2);

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [chatbotLoading, setChatbotLoading] = useState(false);
    const isInitialMount = useRef(true);
    const addRefLine = useRef(false);

    // Offline handling
    useEffect(() => {
        function onlineHandler() {
            console.log('onlineHandler: true')
            setIsOnline(true);
        }

        function offlineHandler() {
            console.log('offlineHandler: false')
            setIsOnline(false);
        }

        window.addEventListener("online", onlineHandler);
        window.addEventListener("offline", offlineHandler);


        return () => {
            window.removeEventListener("online", onlineHandler);
            window.removeEventListener("offline", offlineHandler);
        };
    }, []);

    // Update component when a new or different chat is opened
    useEffect(() => {
        setMessages(currChatHist.messages);
        setAtStartRef(currChatHist.atStartRef);
        setStageProgress(currChatHist.stage);
        setLocalStage(currChatHist.stage);
    }, [currChatHist])

    useEffect(() => {
        console.log('see current history context: ', currChatHist);
        console.log('see current localStage: ', localStage);
        console.log('see current messages: ', messages);
    }, [currChatHist, localStage, messages]);

    // Send user input to chatbot and receive response
    const generateResponse = async (msg) => {
        let context = getAllMessages();
        let input = { context: context, newMsg: msg, stage: getStageNum() };

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
    }

    // Messaging logic
    const handleUserInput = async (content) => {
        if (globalStage.name === "complete") {
            console.log("this stage is complete, conversation complete");
            return;
        }

        let stageMessages = messages[globalStage.name];

        // Get user input
        content.preventDefault();
        const userInput = content.target.userInput.value;
        content.target.userInput.value = "";
        setChatbotLoading(true);
        stageMessages.push({ type: 'user', message: userInput });
        setMessages({
            ...messages,
            [globalStage.name]: stageMessages
        });

        // Update chat history and UI depending on chatbot response
        generateResponse(userInput).then((chatbotResp) => {
            setChatbotLoading(false);
            if (chatbotResp.stage === undefined) {
                stageMessages.push({ type: 'chatbot', message: chatbotResp });
                setMessages({
                    ...messages,
                    [globalStage.name]: stageMessages
                });
                return;
            }
            let chatbotStage = getStage(chatbotResp.stage);
            let addLine = false;
            let addMsg = true;

            // Transition stage
            if (chatbotStage !== globalStage.name) {
                addLine = true;
                if (chatbotStage === 'reflection') {
                    setAtStartRef(true);
                    stageMessages.push({ type: 'newStage', message: 'The chat is over for now. Please come back and start reflection once you are ready!' });
                    addLine = false;
                    addMsg = false;
                }
                if (chatbotStage !== 'complete') {
                    stageMessages = messages[chatbotStage];
                    advanceStage();
                }
            }

            // Add stage line break
            let msg = chatbotResp.ai;
            if (addLine && chatbotStage === 'complete') { // add msg before line
                stageMessages.push({ type: 'chatbot', message: msg });
                stageMessages.push({ type: 'newStage', message: chatbotStage });
                advanceStage();
            } else if (addLine) { // add line before msg
                stageMessages.push({ type: 'newStage', message: chatbotStage });
                stageMessages.push({ type: 'chatbot', message: msg });
            } else if (addMsg) { // no line
                stageMessages.push({ type: 'chatbot', message: msg });
            }

            setMessages({
                ...messages,
                [globalStage.name === "complete" ? "reflection" : globalStage.name]: stageMessages
            });
        })
    }

    // Translate chatbot's reprsentation of stages to frontend's
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

    // Translate UI's reprsentation of stages to chatbot's
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

    // Updates the state of the variables used for stage UI
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

    // Set the state of the variables used for stage UI
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

    // Update the UI to show that reflection stage has started
    const startReflection = () => {
        let agrMsgs = messages.agreement.slice(0, -1);
        let newMsgs = {
            ...messages,
            agreement: agrMsgs,
      };

        setMessages(newMsgs);

        setRefStage("inProgress");
        setAtStartRef(false); 
        addRefLine.current = true;
    }

    // Save new messages and/or stage to IndexedDB
    useEffect(() => {
        if (isOnline) containerRef.current.scrollTop = containerRef.current.scrollHeight;

        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (addRefLine.current) {
            addRefLine.current = false;
            let refMsgs = [
                { type: 'newStage', message: globalStage.name }, 
                { type: 'chatbot', message: "How satisfied are you with the outcomes or agreements you made in this conversation?"}
            ];
            setMessages(prevMessages => {
            return {
              ...prevMessages,
              [globalStage.name]: refMsgs
            };
          });
        }

        let updatedContext = { messages: messages, time: currChatHist.time, stage: globalStage, atStartRef: atStartRef }
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

    // Returns all of the messages in the current chat as an array
    const getAllMessages = () => {
        let arr = [];
        let results = arr.concat(Object.values(messages));
        return results.flat();
    }

    return (
        <>
            <div>
                {!isOnline ? (
                    /* Offline page */
                    <div className="flex flex-col items-center justify-center absolute top-24 md:top-12 right-0 w-full sm:w-4/5 h-[90%]">
                        <img src={offline} className="w-32 h-32 mb-8" alt="Lost connection" />
                        <p className="text-white font-calibri font-medium text-3xl mb-4 "> Ooops... </p>
                        <p className="text-white font-calibri text-xl w-[40%] text-center mb-12"> 
                            There is a connection error. Please check your Internet and try again. 
                        </p>
                        <button className="bg-[#1993D6] hover:bg-[#4EB7F0] rounded-xl py-2 px-16 text-black font-medium text-xl">
                            Try again
                        </button>
                        </div>
                ) : (
                    <div>
                        
                        <div className="flex flex-col absolute top-24 md:top-12 right-0 w-full sm:w-4/5 px-8 py-12 h-screen">
                        {/* Chatbot container */}
                        <SideBarContext.Provider value={currentPageValue}>
                            <div className="w-full mb-4 h-[80%] sm:h-[85%] overflow-y-auto" ref={containerRef}>
                                {getAllMessages().map((message, index) => (
                                    <div>{message.type === 'newStage' ? <StageLine key={globalStage} text={message.message} /> :
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
                                {/* Message loading animation appears while waiting for chatbot response */}
                                {chatbotLoading ? <Loading /> : <></>}
                                {/* Start reflection and homepage options appear after completing Agreement stage */}
                                {atStartRef ? <div className='flex justify-center'>
                                    <button onClick={() => startReflection()} className="bg-transparent hover:bg-[#1993D6] text-white py-2 px-4 mx-3 border border-[#494949] hover:border-transparent rounded-full inline-flex items-center">
                                        <img className='w-4 h-4 mr-2' src={pencil} alt="Reflection pencil" />
                                        <span>Start Reflection Now</span>
                                    </button>
                                    <button onClick={() => setCurrentPage('welcome')} className="bg-transparent hover:bg-[#1993D6] text-white py-2 px-4 mx-3 border border-[#494949] hover:border-transparent rounded-full inline-flex items-center">
                                        <img className='w-4 h-4 mr-2' src={home} alt="Home icon" />
                                        <span>Back to Homepage</span>
                                    </button>
                                </div> : <></>}
                            </div>
                            </SideBarContext.Provider>
                            
                            {/* Chat input container */}
                            <div className={`absolute bottom-28 sm:bottom-20 w-full ${atStartRef || globalStage.name === "complete" ? 'hidden' : ''}`}>
                                <form onSubmit={handleUserInput}>
                                    <input
                                        type="text"
                                        name="userInput"
                                        className="w-4/5 mt-12 ml-2 sm:ml-8 md:ml-12 lg:ml-24 pl-2 py-2 font-calibri font-sm rounded-xl border text-[#bbbbbb] border-[#bbbbbb] bg-[#1e1e1e] focus:outline-none focus:ring focus:border-blue-500"
                                        placeholder="Send your message here"
                                    />
                                    <span>
                                        <button
                                            type="submit"
                                            className="mt-12 sm:ml-8 absolute right-[20%] md:right-[14%] rounded-full transform translate-y-1/2">
                                            <img src={send} className="w-6 h-6" />
                                        </button>
                                    </span>
                                </form>
                            </div>
                        </div>


                        {/* Top Status Bar */}
                        <StatusBar invStage={invStage} conStage={conStage} excStage={excStage} agrStage={agrStage} refStage={refStage} />
                    </div>
                )}
            </div>
        </>
    )
}