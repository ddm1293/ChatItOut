import React, {useState, useEffect, useRef, useCallback, useContext} from 'react';
import send from "../assets/icon_send.png";
import axios from 'axios';
import stagearrow from "../assets/icon_stagearrow.png";
import { HistoryContext, HistoryContextProvider } from '../HistoryContext';

const serverURL = "http://localhost:5000";


export default function Chatbot() {
    const {currChatHist, setCurrChatHist} = useContext(HistoryContext);

    const [messages, setMessages] = useState(currChatHist.messages);
    const [stage, setStage] = useState(currChatHist.stage);
    const [invStage, setInvStage] = useState("inProgress");
    const [conStage, setConStage] = useState("notStarted", "inProgress", "completed");
    const [excStage, setExcStage] = useState("notStarted", "inProgress", "completed");
    const [agrStage, setAgrStage] = useState("notStarted", "inProgress", "completed");
    const [refStage, setRefStage] = useState("notStarted", "inProgress", "completed");

    const isInitialMount = useRef(true);
    const dbReq = indexedDB.open("chathistory", 1);

    const generateResponse = () => {
        let responses = ["Hello, how are you?", "That is a bad idea.", "You are very intelligent!", "I'm sorry to hear that.", "Do you feel like a human being today?"];
        let i = Math.floor((Math.random() * 5));
        if (i === 2) {
            advanceStage();
        }
        return responses[i];
    }

    useEffect(() => {
        setMessages(currChatHist.messages);
        setStage(currChatHist.stage);
        setStageProgress(currChatHist.stage);
    }, [currChatHist])

    const handleUserInput = (content) => {
        content.preventDefault();
        const userInput = content.target.userInput.value;
        const chatbotMessage = generateResponse();

        if (stage.name !== "complete") {
            let stageMessages = messages[stage.name];
            stageMessages.push({ type: 'user', message:userInput });
            stageMessages.push({ type: 'chatbot', message:chatbotMessage });

            setMessages({
                ...messages,
                [stage.name]: stageMessages
            });
        }         
        
        content.target.userInput.value="";

    }

    const advanceStage = () => {
        switch(stage.name) {
            case "invitation":
                stage.setConnection();
                setInvStage("completed");
                setConStage("inProgress");
                break;
            case "connection":
                stage.setExchange();
                setConStage("completed");
                setExcStage("inProgress");
                break;
            case "exchange":
                stage.setAgreement();
                setExcStage("completed");
                setAgrStage("inProgress");
                break;
            case "agreement":
                stage.setReflection();
                setAgrStage("completed");
                setRefStage("inProgress");
                break;
            case "reflection":
                stage.setComplete();
                setRefStage("completed");
                // move this chat to doneChats in LeftSideBar (via useContext to alert it?);
                break;
            default:
                console.log('something bad happened advanceStage')
        }
        setStage(stage);
    }

    const setStageProgress = (stage) => {
        switch(stage.name) {
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

    // Allows user to download file to personal device
    // const download = (data, filename) => {
    //     const json = JSON.stringify(data, null, 2);
    //     const link = document.createElement('a');
    
    //     link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(json));
    //     link.setAttribute('download', filename || `${id}.json`);
    //     link.style.display = 'none';
    
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // }  

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        let updatedContext = {messages: messages, time: currChatHist.time, stage: stage}
        dbReq.onsuccess = function(evt) {
            let db = dbReq.result;
            if (!db.objectStoreNames.contains('current') || currChatHist.time === undefined) {
                return;
            }
            const tx = db.transaction('current', 'readwrite');
            const store = tx.objectStore('current');
            store.put(updatedContext);
            //tx.complete;
            // tx.done.then((e) => {
            //     console.log(e);
            // });
        }
    }, [messages]);

    const getAllMessages = () => {
        let arr = [];
        let results = arr.concat(Object.values(messages));
        return results.flat();
    }

    return (
        <>
        <div className="absolute top-28 w-2/3 right-24 vg-[#1e1e1e] rounded-lg">
            <div className="mb-4 max-h-[600px] overflow-y-auto">
            {getAllMessages().map((message, index) => (
                <div
                    key={index}
                    className={`mb-4 p-4 ${
                        message.type === 'user' ? 'bg-white text-black' : 'bg-[#e1e1e1] bg-opacity-10 text-white'
                    } rounded-lg`}
                >
                {message.message}
                </div>
            ))}
            </div>
            <div className="absolute top-96 w-2/3 left-80">
                <form onSubmit={handleUserInput}>
            <input
                type="text"
                name="userInput"
                className="absolute top-56 w-4/5 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Type your message..."
            />
            <button
                type="button"
                onClick={handleUserInput}
                className="absolute top-56 right-2 transform -translate-y-1/2 rounded-full p-2">
                <img src={send} className="w-4 h-4"/>
            </button>
                </form>
            </div>
        </div>

        {/* Left Status Bar */}
        <div className="absolute w-4/5 h-20 bg-[#242424] flex right-0 top-0">
            <div className={`flex absolute top-8 left-0 w-64 h-12 border-b-4 ${invStage === "inProgress" ? "border-[#9adbff]" : "border-none"}`}></div>
            <div className="flex absolute top-8 left-20">
                <span className="w-4 h-4 bg-white opacity-50 rounded-full"></span>
                <span className="absolute left-1 -top-1 font-calibri font-normal text-14 leading-17 text-black">
                    1
                </span>
                <span className="absolute left-8 -top-2 font-normal text-lg leading-22 text-white opacity-50 font-calibri">
                    Invitation
                </span>
                <img src={stagearrow} className="absolute left-40 top-1 rounded-full" />
            </div>

            <div className={`flex absolute top-8 left-64 w-64 h-12 border-b-4 ${conStage === "inProgress" ? "border-[#9adbff]" : "border-none"}`}></div>
            <div className="absolute w-4 h-4 top-8 left-80 bg-white opacity-50 rounded-full"> 
                <span className="absolute inset-x-0 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 text-black">
                    2
                </span>
                <span className="absolute left-8 -top-2 font-normal text-lg leading-22 text-white font-calibri">
                    Connection
                </span>
                <img src={stagearrow} className="absolute left-44 top-1 rounded-full" />
            </div>

            <div className={`flex absolute top-8 left-[500px] w-64 h-12 border-b-4 ${excStage === "inProgress" ? "border-[#9adbff]" : "border-none"}`}></div>
            <span style={{ left: '560px' }}
                  className="absolute w-4 h-4 top-8 bg-white opacity-50 rounded-full">
                  <span className="absolute inset-x-0 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 text-black">
                    3
                    </span>
                    <span className="absolute left-8 -top-2 font-normal text-lg leading-22 text-white font-calibri">
                        Exchange
                    </span>
                    <img src={stagearrow} className="absolute left-44 top-1 rounded-full" />
            </span>

            <div className={`flex absolute top-8 left-[750px] w-60 h-12 border-b-4 ${agrStage === "inProgress" ? "border-[#9adbff]" : "border-none"}`}></div>
            <span style={{ left: '800px' }}
                  className="absolute w-4 h-4 top-8 bg-white opacity-50 rounded-full">
                  <span className="absolute inset-x-0 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 text-black">
                    4
                    </span>
                    <span className="absolute left-8 -top-2 font-normal text-lg leading-22 text-white font-calibri">
                        Agreement
                    </span>
                    <img src={stagearrow} className="absolute left-44 top-1 rounded-full" />
            </span>

            <div className={`flex absolute top-8 left-[990px] w-64 h-12 border-b-4 ${refStage === "inProgress" ? "border-[#9adbff]" : "border-none"}`}></div>
            <span style={{ left: '1040px' }}
                  className="absolute w-4 h-4 top-8 bg-white opacity-50 rounded-full">
                  <span className="absolute inset-x-0 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 text-black">
                    5
                    </span>
                    <span className="absolute left-8 -top-2 font-normal text-lg leading-22 text-white font-calibri">
                        Reflection
                    </span>
            </span>
            </div>
        </>
    )
}