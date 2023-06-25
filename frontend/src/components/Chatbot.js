import React, {useState, useEffect, useRef, useCallback} from 'react';
import send from "../assets/icon_send.png";
import axios from 'axios';

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
    const isInitialMount = useRef(true);

    const generateResponse = () => {
        let responses = ["Hello, how are you?", "That is a bad idea.", "You are very intelligent!", "I'm sorry to hear that.", "Do you feel like a human being today?"];
        let i = Math.floor((Math.random() * 5));
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

        let stageMessages = messages[stage.name];
        stageMessages.push({ type: 'user', message:userInput });
        stageMessages.push({ type: 'chatbot', message:chatbotMessage });

        setMessages({
            ...messages,
            [stage.name]: stageMessages
        });
        
        content.target.userInput.value="";

    }

    const advanceStage = () => {
        let nextStage;
        switch(stage) {
            case Stage.Invitation:
                nextStage = Stage.Connection;
                // create the line that separates stages
                // update the stage bar
                break;
            case Stage.Connection:
                nextStage = Stage.Exchange;
                break;
            case Stage.Exchange:
                nextStage = Stage.Agreement;
                break;
            case Stage.Agreement:
                nextStage = Stage.Reflection;
                break;
            default:
                nextStage = Stage.Complete;
        }
        transitionStage(nextStage);
        if (stage === Stage.Complete) {
            // move this chat to complete panel;
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
    

    return (
        <>
        <div className="absolute top-28 w-2/3 right-24 vg-[#1e1e1e] rounded-lg">
            <div className="mb-4 max-h-[600px] overflow-y-auto">
            {messages[stage.name].map((message, index) => ( // TODO: it currently erases previous stages msgs
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
        </>
    )
}