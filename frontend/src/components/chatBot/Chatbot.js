import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { ChatCompleteContext, HistoryContext} from '../../ChatContexts';
import { SideBarContext } from '../PageRoute';
import ChatStage from '../../ChatStage';
import Loading from '../Loading';
import StageLine from '../StageLine';
import StatusBar from '../../components/chatBot/StatusBar';
import MoveStagePopUp from './MoveStagePopUp';
import OfflinePage from './OfflinePage';
import StartReflectionLine from './StartReflectionLine';
import Message from './Message';
import InputBar from './InputBar';
import CompulsoryJumpPopUp from './CompulsoryJumpPopUp';

// export const serverURL = "https://chatitout-server-26d52a60d625.herokuapp.com";
export const serverURL = "http://127.0.0.1:5000";

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
    const [currMessageNum, setMessageNum] = useState(currChatHist.messageCapCount);
    const [refusalCount, setRefusalCount] = useState(currChatHist.refusalCapCount);
    const [showCompusoryJump, setShowCompulsoryJump] = useState(false);
    const messageCap = 1;
    const refusalCap = 1;

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
        setMessageNum(currChatHist.messageCapCount);
        setRefusalCount(currChatHist.refusalCapCount)
    }, [currChatHist])

    useEffect(() => {
        console.log('see current history context: ', currChatHist);
        console.log('see current currMessageNum: ', currMessageNum);
        console.log("see current refusalCapCount", refusalCount)
        // console.log('see current localStage: ', localStage);
        // console.log('see current messages: ', messages);
        // console.log('see current stages: ', stages);
    }, [currChatHist, localStage, messages, currMessageNum, refusalCount]);

    // Send user input to chatbot and receive response
    const generateResponse = async (msg) => {
        let context = getAllMessages();
        const sessionId = currChatHist.sessionId;
        console.log(`see sessionId now: ${sessionId}`);
        let input = { sessionId: sessionId, context: context, newMsg: msg, stage: getStageNum() };

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

        await getAIResponse(userInput);
    }

    const getAIResponse = async (userInput) => {
        let stageMessages = messages[globalStage.name];

        // Send the user input to backend
        const chatbotResp = await generateResponse(userInput);

        // Add chatGPT response to chat messages
        setChatbotLoading(false);
        const chatbotMessage = chatbotResp.ai;
        stageMessages.push({ type: 'chatbot', message: chatbotMessage });
        console.log("see stageMessages in getAIResponse: ", stageMessages)
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
    
        if (currentStageIndex === -1) {
            console.error('Invalid current stage');
            return;
        }

        stages[currentStageIndex].status = 'completed';
        if (stages[currentStageIndex].name === 'reflection') { 
            setChatToComplete(currChatHist.time);
            messages.reflection.push({ type: 'newStage', message: "This is the end of this conversation."})
            return;
        } else if (stages[currentStageIndex].name === 'agreement') {
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
            console.log('see here')
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

        let updatedContext = { 
            sessionId: currChatHist.sessionId,
            messages: messages,
            time: currChatHist.time,
            stage: globalStage, 
            atStartRef: atStartRef,
            messageCapCount: currMessageNum,
            refusalCapCount: refusalCount
        }
        console.log("see updatedContext:", updatedContext);
        
        dbReq.onsuccess = function (evt) {
            let db = dbReq.result;
            if (!db.objectStoreNames.contains('chats') || (messages === currChatHist.messages && localStage === currChatHist.stage)) {
                return;
            }
            const tx = db.transaction('chats', 'readwrite');
            const store = tx.objectStore('chats');
            store.put(updatedContext);
        }
    }, [messages]);

    // Returns all of the messages in the current chat as an array
    const getAllMessages = () => {
        let arr = [];
        let results = arr.concat(Object.values(messages));
        return results.flat();
    }

    // pop up a window if the current message number exceeds the cap
    useEffect(() => {
        if (messages[globalStage.name]) {
            if (globalStage.name !== 'complete' && currMessageNum > messageCap) {
                setReadyToShowPopup(true);
            } else {
                setReadyToShowPopup(false);
            }
        }
    }, [messages, globalStage]);
    
    const handleInputFocus = () => {
        if (readyToShowPopup) {
            setShowPopup(true);
            setReadyToShowPopup(false);
        }
    };

    useEffect(() => {
        if (refusalCount > refusalCap) {
            setShowCompulsoryJump(true);
        }
    }, [refusalCount])
    
    return (
        <>
            <div>
                {!isOnline ? (
                    <OfflinePage />
                ) : (
                    <div>
                        
                        <div className="flex flex-col absolute top-24 md:top-12 right-0 w-full sm:w-4/5 px-8 py-12 h-screen">
                        {/* Chatbot container */}
                        <SideBarContext.Provider value={currentPageValue}>
                            <div className="w-full mb-4 h-[80%] sm:h-[85%] overflow-y-auto" ref={containerRef}>
                                {getAllMessages().map((message, index) => (
                                    <div>
                                        {
                                            message.type === 'newStage' ? <StageLine key={globalStage} text={message.message} /> : <Message message={message} index={index} />
                                        }
                                    </div>
                                ))}
                                {/* Message loading animation appears while waiting for chatbot response */}
                                {chatbotLoading ? <Loading /> : <></>}

                                {showMoveStagePopUp ? <MoveStagePopUp globalStage={globalStage} advanceStage={advanceStage} setShowPopup={setShowPopup} setMessageNum={setMessageNum} setrefusalCount={setRefusalCount} /> : <></>}
                                {showCompusoryJump ? <CompulsoryJumpPopUp setShowCompulsoryJump={setShowCompulsoryJump} setrefusalCount={setRefusalCount} advanceStage={advanceStage} /> : <></>}

                                {/* Start reflection and homepage options appear after completing Agreement stage */}
                                {atStartRef ? <StartReflectionLine startReflection={startReflection} setCurrentPage={setCurrentPage} /> : <></>}
                            </div>
                            </SideBarContext.Provider>
                            
                            {/* Chat input container */}
                            <InputBar atStartRef={atStartRef} globalStage={globalStage} handleUserInput={handleUserInput} handleInputFocus={handleInputFocus}/>
                        </div>


                        {/* Top Status Bar */}
                        <StatusBar stages={stages} />
                    </div>
                )}
            </div>
        </>
    )
}