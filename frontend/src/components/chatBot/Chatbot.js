import React, { useState, useEffect, useRef, useContext } from 'react';
import { HistoryContext} from '../../ChatContexts';
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
import { useSelector, useDispatch } from 'react-redux';
import { setChatComplete } from '../../slices/chatCompleteSlice'
import { 
    selectCurrChat,
    selectCurrChatMessages, 
    selectCurrChatStage,
    selectCurrChatAtStartRef,
    selectCurrChatMessageCap,
    selectCurrChatRefusalCap,
 } from '../../slices/currChatSlice';
 import { 
    getAIResponse, 
    pushMessagesSync,
    incrementMessageCountSync,
    saveCurrChatToDB,
 } from '../../slices/chatThunk'

export default function Chatbot() {
    const dispatch = useDispatch()
    
    const { currChatHist, setCurrChatHist } = useContext(HistoryContext);
    const currChatMessages = useSelector(selectCurrChatMessages)
    const currChatStage = useSelector(selectCurrChatStage)
    const currChatAtStartRef = useSelector(selectCurrChatAtStartRef)
    const currChatMessageCap = useSelector(selectCurrChatMessageCap)
    const currChatRefusalCap = useSelector(selectCurrChatRefusalCap)


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

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [chatbotLoading, setChatbotLoading] = useState(false);

    const [readyToShowPopup, setReadyToShowPopup] = useState(false);
    const [showMoveStagePopUp, setShowPopup] = useState(false);
    const [currMessageNum, setMessageNum] = useState(currChatHist.messageCapCount);
    const [refusalCount, setRefusalCount] = useState(currChatHist.refusalCapCount);
    const [showCompusoryJump, setShowCompulsoryJump] = useState(false);
    const messageCap = 0;
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

    useEffect(() => {
        console.log("see currChatMessages: ", currChatMessages)
    }, [currChatMessages])
  
    const handleUserInput = async (userInput) => {
        if (currChatStage === "complete" || !userInput.trim()) {
            return;
        }

        setChatbotLoading(true);
        dispatch(pushMessagesSync({ type: 'user', message: userInput }))
        
        const aiResp = (await dispatch(getAIResponse(userInput))).payload.ai
        dispatch(pushMessagesSync({ type: 'chatbot', message: aiResp }))

        dispatch(incrementMessageCountSync())

        dispatch(saveCurrChatToDB())

        setChatbotLoading(false);
    }

    const advanceStage = () => {
        const currentStageIndex = stages.findIndex(stage => stage.name === globalStage.name);
    
        if (currentStageIndex === -1) {
            console.error('Invalid current stage');
            return;
        }

        stages[currentStageIndex].status = 'completed';
        if (stages[currentStageIndex].name === 'reflection') { 
            dispatch(setChatComplete(currChatHist.sessionId))
            messages.reflection.push({ type: 'newStage', message: "This is the end of this conversation."})
            return;
        } else if (stages[currentStageIndex].name === 'agreement') {
            setAtStartRef(true);
        }

        // setting the next stage messages;
        const nextStage = stages[currentStageIndex + 1];
        nextStage.status = 'inProgress';
        let nextStageMessages = messages[nextStage.name];
        console.log("advance stage here, next stage: ", nextStage.name);
        nextStageMessages.push({ type: 'newStage', message: nextStage.name });
              
        globalStage.setNextStage();
    
        setStages([...stages]);
    
        setLocalStage(new ChatStage(globalStage.name));

        setMessageNum(0);
    }


    // const setStageProgress = (stage) => {
    //     const currentStageIndex = stages.findIndex(s => s.name === stage.name);
    
    //     if (currentStageIndex === -1) {
    //         console.error('Invalid current stage');
    //         return;
    //     }

    //     const updatedStages = stages.map((s, index) => {
    //         if (index < currentStageIndex) {
    //             return { ...s, status: 'completed' };
    //         } else if (index === currentStageIndex) {
    //             return { ...s, status: 'inProgress' };
    //         } else {
    //             return { ...s, status: 'notStarted' };
    //         }
    //     });
    
    //     if (stage.name === 'reflection' && currChatHist.atStartRef) {
    //         updatedStages[currentStageIndex].status = 'notStarted';
    //     }
    
    //     setStages(updatedStages);
    // };
    

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
        console.log("see updatedStages: ", updatedStages)
        setStages(updatedStages);

        setAtStartRef(false); 

        // let refMsgs = [
        //     { type: 'newStage', message: "reflection" }, 
        //     { type: 'chatbot', message: "How satisfied are you with the outcomes or agreements you made in this conversation?"}
        // ];
        // setMessages(prevMessages => {
        //     return {
        //     ...prevMessages,
        //     reflection: refMsgs
        //     };
        // })
    }

    // pop up a window if the current message number exceeds the cap
    useEffect(() => {
        if (currChatStage !== 'complete' && 
            !chatbotLoading &&
            currChatMessageCap[currChatStage].msgCount > currChatMessageCap[currChatStage].msgCap) {
                setReadyToShowPopup(true);
            } else {
                setReadyToShowPopup(false);
            }
    }, [chatbotLoading, currChatMessageCap]);

    useEffect(() => {
        if (readyToShowPopup) {
            setShowPopup(true);
            setReadyToShowPopup(false);
        }
    }, [readyToShowPopup])

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
                        
                        <div className="flex flex-col absolute top-24 lg:top-12 right-0 w-full custom-width-lg px-8 py-12 h-screen">
                        {/* Chatbot container */}
                        
                            <div className="custom-scrollbar w-full mb-4 h-[80%] lg:h-[85%] overflow-y-auto" ref={containerRef}>
                                {Object.values(currChatMessages).flat().map((message, index) => (
                                    <div>
                                        {
                                            message.type === 'newStage' ? <StageLine key={currChatStage} text={message.message} /> : <Message message={message} index={index} />
                                        }
                                    </div>
                                ))}
                                {/* Message loading animation appears while waiting for chatbot response */}
                                {chatbotLoading ? <Loading /> : <></>}

                                {showMoveStagePopUp ? <MoveStagePopUp globalStage={currChatStage} advanceStage={advanceStage} setShowPopup={setShowPopup} setMessageNum={setMessageNum} setrefusalCount={setRefusalCount} /> : <></>}
                                {showCompusoryJump ? <CompulsoryJumpPopUp setShowCompulsoryJump={setShowCompulsoryJump} setrefusalCount={setRefusalCount} advanceStage={advanceStage} /> : <></>}

                                {/* Start reflection and homepage options appear after completing Agreement stage */}
                                {currChatAtStartRef ? <StartReflectionLine startReflection={startReflection} /> : <></>}
                            </div>
                           
                            
                            {/* Chat input container */}
                            <InputBar atStartRef={currChatAtStartRef} globalStage={currChatStage} handleUserInput={handleUserInput} chatbotLoading={chatbotLoading} />
                        </div>


                        {/* Top Status Bar */}
                        <StatusBar stages={stages} />
                    </div>
                )}
            </div>
        </>
    )
}