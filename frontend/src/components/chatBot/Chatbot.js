import React, { useState, useEffect, useRef } from 'react';
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
    selectCurrChatSessionId,
    selectCurrChatMessages, 
    selectCurrChatStage,
    selectCurrChatAtStartRef,
    selectCurrChatMessageCap,
    selectCurrChatRefusalCap,
    selectCurrChatRefusalCount,
 } from '../../slices/currChatSlice';
 import { 
    getAIResponse, 
    pushMessagesSync,
    incrementMessageCountSync,
    advanceStageSync,
    setAtStartRefSync,
 } from '../../slices/chatThunk'

export default function Chatbot() {
    const dispatch = useDispatch()
    
    const currChatSessionId = useSelector(selectCurrChatSessionId)
    const currChatMessages = useSelector(selectCurrChatMessages)
    const currChatStage = useSelector(selectCurrChatStage)
    const currChatAtStartRef = useSelector(selectCurrChatAtStartRef)
    const currChatMessageCap = useSelector(selectCurrChatMessageCap)
    const currChatRefusalCapCount = useSelector(selectCurrChatRefusalCount)
    const currChatRefusalCap = useSelector(selectCurrChatRefusalCap)

    const containerRef = useRef(null);

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [chatbotLoading, setChatbotLoading] = useState(false);

    const [readyToShowPopup, setReadyToShowPopup] = useState(false);
    const [showMoveStagePopUp, setShowPopup] = useState(false);
    const [showCompusoryJump, setShowCompulsoryJump] = useState(false);

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
  
    const handleUserInput = async (userInput) => {
        if (currChatStage === "complete" || !userInput.trim()) {
            return;
        }

        setChatbotLoading(true);
        dispatch(pushMessagesSync({ type: 'user', message: userInput }))
        
        const aiResp = (await dispatch(getAIResponse(userInput))).payload.ai
        dispatch(pushMessagesSync({ type: 'chatbot', message: aiResp }))

        dispatch(incrementMessageCountSync())

        setChatbotLoading(false);
    }

    const advanceStage = async () => {
        dispatch(advanceStageSync())
        
    }

    // handle complete and start reflection logic
    useEffect(() => {
        console.log("see currChatStage: ", currChatStage)
        if (currChatStage === 'complete') { 
            dispatch(setChatComplete(currChatSessionId))
            return;
        } else if (currChatStage === 'reflection') {
            dispatch(setAtStartRefSync(true))
        }
    }, [currChatStage])

    // Update the UI to show that reflection stage has started
    const startReflection = () => {}
/*     const startReflection = () => {
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
    } */

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
        if (currChatRefusalCapCount > currChatRefusalCap) {
            setShowCompulsoryJump(true);
        }
    }, [currChatRefusalCapCount])
    
    return (
        <>
            <div>
                {!isOnline ? (
                    <OfflinePage />
                ) : (
                    <div>
                        {/* Top Status Bar */}
                        <StatusBar />

                        <div className="flex flex-col absolute top-24 lg:top-12 right-0 w-full custom-width-lg px-8 py-12 h-screen">
                        {/* Chatbot container */}
                        
                            <div className="custom-scrollbar w-full mb-4 h-[80%] lg:h-[85%] overflow-y-auto" ref={containerRef}>
                                {Object.values(currChatMessages).flat().map((message, index) => {
                                    return (
                                        <div>
                                            {
                                                message.type === 'newStage' ? <StageLine key={currChatStage} text={message.message} /> : <Message message={message} index={index} />
                                            }
                                        </div>
                                    )
                                }
                                
                                )}
                                {/* Message loading animation appears while waiting for chatbot response */}
                                {chatbotLoading ? <Loading /> : <></>}

                                {showMoveStagePopUp ? <MoveStagePopUp globalStage={currChatStage} advanceStage={advanceStage} setShowPopup={setShowPopup} /> : <></>}
                                {showCompusoryJump ? <CompulsoryJumpPopUp setShowCompulsoryJump={setShowCompulsoryJump} advanceStage={advanceStage} /> : <></>}

                                {/* Start reflection and homepage options appear after completing Agreement stage */}
                                {currChatAtStartRef ? <StartReflectionLine startReflection={startReflection} /> : <></>}
                            </div>
                           
                            
                            {/* Chat input container */}
                            <InputBar atStartRef={currChatAtStartRef} globalStage={currChatStage} handleUserInput={handleUserInput} chatbotLoading={chatbotLoading} />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}