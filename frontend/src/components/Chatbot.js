import React, {useState, useEffect, useRef, useCallback} from 'react';
import send from "../assets/icon_send.png";
import axios from 'axios';
import stagearrow from "../assets/icon_stagearrow.png";
import stagecomplete from "../assets/icon_stagecomplete.png";

const serverURL = "http://localhost:5000";

class Stage{
    static Invitation = new Stage("invitation");
    static Connection = new Stage("connection");
    static Exchange = new Stage("exchange");
    static Agreement = new Stage("agreement");
    static Reflection = new Stage("reflection");
    static Complete = new Stage("complete");
  
    constructor(name) {
      this.name = name;
    }
  }

export default function Chatbot() {
    const id = 818230623; // create an id from the date and time that chat was initialized? this id can be used as the filename for chat history.

    // const [messages, setMessages] = useState([]);
    const [messages, setMessages] = useState({invitation: [], connection: [], exchange: [], agreement: [], reflection: []});
    const [stage, transitionStage] = useState(Stage.Invitation);
    const [invStage, setInvStage] = useState("inProgress");
    const [conStage, setConStage] = useState("notStarted");
    const [excStage, setExcStage] = useState("notStarted");
    const [agrStage, setAgrStage] = useState("notStarted");
    const [refStage, setRefStage] = useState("notStarted");

    const isInitialMount = useRef(true);

    const generateResponse = () => {
        let responses = ["Hello, how are you?", "That is a bad idea.", "You are very intelligent!"];
        let i = Math.floor((Math.random() * 3));
        if (i === 2) {
            advanceStage();
        }
        return responses[i];
    }

    // const handleUserInput = (content) => {
    //     content.preventDefault();
    //     const userInput = content.target.userInput.value;
    //     const chatbotMessage = generateResponse();

    //     setMessages((prevMessages) => [
    //         ...prevMessages,
    //         { type: 'user', stage: stage, message:userInput },
    //         { type: 'chatbot', stage: stage, message:chatbotMessage },
    //     ]);

    //     content.target.userInput.value="";

    // }

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
        let nextStage;
        switch(stage) {
            case Stage.Invitation:
                nextStage = Stage.Connection;
                // TODO: draw a line between chat messages that another stage is starting
                setInvStage("inProgress");
                break;
            case Stage.Connection:
                nextStage = Stage.Exchange;
                setInvStage("completed");
                setConStage("inProgress");
                break;
            case Stage.Exchange:
                nextStage = Stage.Agreement;
                setConStage("completed");
                setExcStage("inProgress");
                break;
            case Stage.Agreement:
                nextStage = Stage.Reflection;
                setExcStage("completed");
                setAgrStage("inProgress");
                break;
            case Stage.Reflection:
                nextStage = Stage.Complete;
                setAgrStage("completed");
                setRefStage("inProgress");
                break;  
            default:
                nextStage = Stage.Complete;
        }
        transitionStage(nextStage);
        if (stage === Stage.Complete) {
            // move this chat to complete panel;
            setRefStage("completed");
        }
    }

    const saveToDisk = useCallback(() => {
        let info = {id: id, messages: messages}; 
        axios.post(`${serverURL}/home/chat/${id}`, info, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .catch(function (error) {
            console.log(error);
        });
      }, [messages])

    useEffect(() => {
        if (isInitialMount.current) {
            // loadFromDisk(); --> read file here?
            isInitialMount.current = false;
         } else {
            saveToDisk();
         }
    }, [messages, saveToDisk]);

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
        <div className="absolute top-28 w-2/3 right-24 vg-[#1e1e1e] rounded-lg">
            <div className="mb-4 max-h-[600px] overflow-y-auto">
            { getAllMessages().map((message, index) =>  ( 
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
            <span className={`flex absolute top-8 left-0 w-64 h-12 border-b-4 ${invStage === "inProgress" ? "border-[#9adbff]" : "border-none"}`}></span>
            <div className="flex absolute top-8 left-20">
                <span className={`w-4 h-4 rounded-full ${invStage === "notStarted" ? "opacity-50 bg-white" : "opacity-100 bg-[#9adbff]"}`}> </span>
                <span className={`absolute left-1 -top-1 font-calibri text-14 leading-17 ${invStage === "completed" ? "opacity-0" : "text-black"}`}> 1 </span> 
                {invStage === "completed" ? <img src={stagecomplete} className="absolute left-0 top-0 rounded-full w-4 h-4" alt="Stage Complete" /> : null}
                <span className={`absolute left-8 -top-2 text-lg leading-22 font-calibri ${wordColor(invStage)}`}>
                    Invitation
                </span>
                <img src={stagearrow} className="absolute left-40 top-1 rounded-full" alt="Stage Arrow" />
            </div>

            <span className={`flex absolute top-8 left-64 w-64 h-12 border-b-4 ${conStage === "inProgress" ? "border-[#9adbff]" : "border-none"}`}></span>
            <div className="flex absolute top-8 left-80"> 
                <span className={`w-4 h-4 rounded-full ${conStage === "notStarted" ? "opacity-50 bg-white" : "opacity-100 bg-[#9adbff]"}`}> </span>
                <span className={`absolute left-1 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 ${conStage === "completed" ? "opacity-0" : "text-black"}`}>2</span>
                {conStage === "completed" ? <img src={stagecomplete} className="absolute left-0 top-0 rounded-full w-4 h-4" alt="Stage Complete" /> : null} 
                <span className={`absolute left-8 -top-2 text-lg leading-22 font-calibri ${wordColor(conStage)}`}>
                    Connection
                </span>
                <img src={stagearrow} className="absolute left-44 top-1 rounded-full" alt="Stage Arrow" />
            </div>

            <span className={`flex absolute top-8 left-[500px] w-64 h-12 border-b-4 ${excStage === "inProgress" ? "border-[#9adbff]" : "border-none"}`}></span>
            <div className="flex absolute top-8" style={{ left: '560px' }}>
                <span className={`w-4 h-4 rounded-full ${excStage === "notStarted" ? "opacity-50 bg-white" : "opacity-100 bg-[#9adbff]"}`}> </span>
                <span className={`absolute left-1 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 ${excStage === "completed" ? "opacity-0" : "text-black"}`}>3</span>
                {excStage === "completed" ? <img src={stagecomplete} className="absolute left-0 top-0 rounded-full w-4 h-4" alt="Stage Complete" /> : null}  
                <span className={`absolute left-8 -top-2 text-lg leading-22 font-calibri ${wordColor(excStage)}`}>
                    Exchange
                </span>
                <img src={stagearrow} className="absolute left-44 top-1 rounded-full" alt="Stage Arrow" />
            </div>

            <div className={`flex absolute top-8 left-[750px] w-60 h-12 border-b-4 ${agrStage === "inProgress" ? "border-[#9adbff]" : "border-none"}`}></div>
            <div className="flex absolute top-8" style={{ left: '800px' }}>
                    <span className={`w-4 h-4 rounded-full ${agrStage === "notStarted" ? "opacity-50 bg-white" : "opacity-100 bg-[#9adbff]"}`}> </span>
                    <span className={`absolute left-1 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 ${agrStage === "completed" ? "opacity-0" : "text-black"}`}>4</span> 
                    {agrStage === "completed" ? <img src={stagecomplete} className="absolute left-0 top-0 rounded-full w-4 h-4" alt="Stage Complete" /> : null} 
                    <span className={`absolute left-8 -top-2 text-lg leading-22 font-calibri ${wordColor(agrStage)}`}>
                        Agreement
                    </span>
                    <img className="absolute left-44 top-1 rounded-full" src={stagearrow} alt="Stage Arrow" />
            </div>

            <div className={`flex absolute top-8 left-[990px] w-64 h-12 border-b-4 ${refStage === "inProgress" ? "border-[#9adbff]" : "border-none"}`}></div>
            <div className="flex absolute top-8" style={{ left: '1040px' }}>
                    <span className={`w-4 h-4 rounded-full ${refStage === "notStarted" ? "opacity-50 bg-white" : "opacity-100 bg-[#9adbff]"}`}> </span>
                    <span className={`absolute left-1 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 ${refStage === "completed" ? "opacity-0" : "text-black"}`}>5</span>
                    {refStage === "completed" ? <img src={stagecomplete} className="absolute left-0 top-0 rounded-full w-4 h-4" alt="Stage Complete" /> : null}  
                    <span className= {`absolute left-8 -top-2 text-lg leading-22 font-calibri ${wordColor(refStage)}`}>
                        Reflection
                    </span>
            </div>
            </div>
        </>
    )
}