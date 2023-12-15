import React, { useState, useEffect, useRef, useContext } from 'react';
import send from "../../assets/icon_send.png";
import axios from 'axios';
import { ChatCompleteContext, HistoryContext} from '../../ChatContexts';
import { SideBarContext } from '../PageRoute';
import ailogo from "../../assets/icon_ailogo.png";
import pencil from "../../assets/icon_pencil.png";
import home from "../../assets/icon_home.png";
import offline from "../../assets/icon_nowifi.png";
import ChatStage from '../../ChatStage';
import Loading from '../Loading';
import StageLine from '../StageLine';
import StatusBar from '../../components/chatBot/StatusBar'
import MoveStagePopUp from './MoveStagePopUp';

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

    const [stages, setStages] = useState([
        { key: 1, name: "invitation", status: "inProgress" },
        { key: 2, name: "connection", status: "notStarted" },
        { key: 3, name: "exchange", status: "notStarted" },
        { key: 4, name: "agreement", status: "notStarted" },
        { key: 5, name: "reflection", status: "notStarted" },
        { key: 6, name: "complete", status: "notStarted" }
    ]);
    const containerRef = useRef(null);

    const dbReq = indexedDB.open("chathistory", 2);

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [chatbotLoading, setChatbotLoading] = useState(false);
    const isInitialMount = useRef(true);
    const addRefLine = useRef(false);

    const [readyToShowPopup, setReadyToShowPopup] = useState(false);
    const [showMoveStagePopUp, setShowPopup] = useState(false);
    const [currMessageNum, setMessageNum] = useState(0);
    const messageCap = 1;

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

    // useEffect(() => {
    //     console.log('see current history context: ', currChatHist);
    //     console.log('see current localStage: ', localStage);
    //     console.log('see current messages: ', messages);
    //     console.log('see current stages: ', stages);
    // }, [currChatHist, localStage, messages]);

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
            console.log("see response data: ", resp.data)
            return resp.data;
        } catch (err) {
            console.log(err);
            return "An error occured. Please try again later."
        }
    }

    const handleUserInput = async (content) => {
        if (globalStage.name === "complete") {
            return;
        }

        let stageMessages = messages[globalStage.name];

        // Deal with user input
        content.preventDefault();
        const userInput = content.target.userInput.value;
        content.target.userInput.value = "";

        // Add user input into chat messages
        setChatbotLoading(true);
        stageMessages.push({ type: 'user', message: userInput });
        setMessageNum(prev => prev + 1);
        setMessages({
            ...messages,
            [globalStage.name]: stageMessages
        });

        // Send the user input to backend
        const chatbotResp = await generateResponse(userInput);

        // Add chatGPT response to chat messages
        setChatbotLoading(false);
        const chatbotMessage = chatbotResp.ai;
        stageMessages.push({ type: 'chatbot', message: chatbotMessage });
        // console.log("see handleUserInput globalStage: ", globalStage.name);
        setMessages({
            ...messages,
            [globalStage.name]: stageMessages
        });
    }

    // Translate UI's reprsentation of stages to chatbot's
    const getStageNum = () => {
        const stage = stages.find(stage => stage.name === globalStage.name);
        if (!stage) {
            console.error("something wrong with the getStageNum");
        }
        return stage ? stage.key : -1;
    }

    const advanceStage = () => {
        const currentStageIndex = stages.findIndex(stage => stage.name === globalStage.name);
    
        // console.log("triggering advanceStage, see global stage: ", globalStage.name);
        // console.log("see currentStage name: ", stages[currentStageIndex].name);
        if (currentStageIndex === -1) {
            console.error('Invalid current stage');
            return;
        }
    
        // Setting the status of the current stage to "completed"
        stages[currentStageIndex].status = 'completed';
        if (stages[currentStageIndex].name === 'reflection') { 
            // console.log('The chat is already at the last stage', stages[currentStageIndex].name);
            setChatToComplete(currChatHist.time);
            messages.reflection.push({ type: 'newStage', message: "This is the end of this conversation."})
            return;
        } else if (stages[currentStageIndex].name === 'agreement') {
            // console.log("ready to go to reflection") 
            setAtStartRef(true);
        }

        // setting the next stage messages;
        const nextStage = stages[currentStageIndex + 1];
        nextStage.status = 'inProgress';
        let nextStageMessages = messages[nextStage.name];
        nextStageMessages.push({ type: 'newStage', message: `Starting the new stage: ${nextStage.name} now` });
              
        globalStage.setNextStage();
    
        setStages([...stages]);
    
        setLocalStage(new ChatStage(globalStage.name));

        setMessageNum(0);

    }


    const setStageProgress = (stage) => {
        const currentStageIndex = stages.findIndex(s => s.name === stage.name);
    
        if (currentStageIndex === -1) {
            console.error('Invalid current stage');
            return;
        }

        const updatedStages = stages.map((s, index) => {
            if (index < currentStageIndex) {
                return { ...s, status: 'completed' };
            } else if (index === currentStageIndex) {
                return { ...s, status: 'inProgress' };
            } else {
                return { ...s, status: 'notStarted' };
            }
        });
    
        if (stage.name === 'reflection' && currChatHist.atStartRef) {
            updatedStages[currentStageIndex].status = 'notStarted';
        }
    
        setStages(updatedStages);
    };
    

    // Update the UI to show that reflection stage has started
    const startReflection = () => {
        // console.log("triggering startReflection()");
        let agrMsgs = messages.agreement.slice(0, -1);
        let newMsgs = {
            ...messages,
            agreement: agrMsgs,
      };

        setMessages(newMsgs);

        const updatedStages = stages.map(stage => {
            if (stage.name === 'reflection') {
                return {
                    ...stage,
                    status: 'inProgress',
                };
            }
            return stage;
        });
        setStages(updatedStages);

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

    // pop up a window if the current message number exceeds the cap
    useEffect(() => {
        if (messages[globalStage.name]) {
            // console.log(`see currMessageNum: ${currMessageNum}`);
            if (globalStage.name !== 'complete' && currMessageNum > messageCap) {
                setReadyToShowPopup(true);
                // console.log("setReadyToShowPopup is true");
            } else {
                setReadyToShowPopup(false);
            }
        }
    }, [messages, globalStage]);
    
    const handleInputFocus = () => {
        if (readyToShowPopup) {
            // console.log("pop up")
            setShowPopup(true);
            setReadyToShowPopup(false);
        }
    };
    
    return (
        <>
            <div>
                {!isOnline ? (
                    /* Offline page */
                    <div className="flex flex-col items-center justify-center absolute top-24 md:top-12 right-0 w-full custom-width lg:w-full h-[90%]">
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
                        
                        <div className="flex flex-col absolute top-24 lg:top-12 right-0 w-full custom-width-lg px-8 py-12 h-screen">
                        {/* Chatbot container */}
                        <SideBarContext.Provider value={currentPageValue}>
                            <div className="w-full mb-4 h-[80%] lg:h-[85%] overflow-y-auto" ref={containerRef}>
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

                                {showMoveStagePopUp ? <MoveStagePopUp globalStage={globalStage} advanceStage={advanceStage} setShowPopup={setShowPopup} setMessageNum={setMessageNum} /> : <></>}

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
                            <div className={`absolute bottom-20 w-full ${atStartRef || globalStage.name === "complete" ? 'hidden' : ''}`}>
                                <form onSubmit={handleUserInput} >
                                    <input
                                        type="text"
                                        name="userInput"
                                        className="w-4/5 ml-8 md:w-4/5 mt-12 md:ml-20 mb-10 lg:ml-24 lg:mb-0 pl-2 py-2 font-calibri font-sm rounded-xl border text-[#bbbbbb] border-[#bbbbbb] bg-[#1e1e1e] focus:outline-none focus:ring focus:border-blue-500"
                                        placeholder="Send your message here"
                                        onFocus={handleInputFocus}
                                    />
                                    <span>
                                        <button
                                            type="submit"
                                            className="mt-11 md:ml-6 absolute right-[20%] md:right-[14%] rounded-full transform translate-y-1/2">
                                            <img src={send} className="w-6 h-6" />
                                        </button>
                                    </span>
                                </form>
                            </div>
                        </div>


                        {/* Top Status Bar */}
                        <StatusBar stages={stages} />
                    </div>
                )}
            </div>
        </>
    )
}