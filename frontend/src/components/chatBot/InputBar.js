import React, { useEffect, useRef } from 'react';
import send from "../../assets/icon_send.png";
import autosize from 'autosize';

export default function InputBar({ atStartRef, globalStage, handleUserInput, chatbotLoading }) {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            autosize(textareaRef.current);
        }

        return () => {
            if (textareaRef.current) {
                autosize.destroy(textareaRef.current);
            }
        };
    }, []);

    const handleKeyDown = (event) => {
        if (chatbotLoading) {
            event.preventDefault();
            return;
        }
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (textareaRef.current.value.trim() !== '') {
                event.target.form.requestSubmit();
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const userInput = textareaRef.current.value;
        if (!userInput.trim() || chatbotLoading) {
            return;
        }
        handleUserInput(userInput);
        textareaRef.current.value = '';
        autosize.update(textareaRef.current);
    };

    return (
        <div className={`absolute bottom-28 sm:bottom-20 w-full ${atStartRef || globalStage.name === "complete" ? 'hidden' : ''}`}>
            <form onSubmit={handleSubmit} className="flex items-end w-4/5 ml-2 sm:ml-8 md:ml-12 lg:ml-24">
                <textarea
                    ref={textareaRef}
                    name="userInput"
                    className="flex-grow pl-2 py-2 font-calibri font-sm rounded-xl border text-[#bbbbbb] border-[#bbbbbb] bg-[#1e1e1e] focus:outline-none focus:ring focus:border-blue-500 resize-none overflow-hidden"
                    placeholder="Send your message here"
                    onKeyDown={handleKeyDown}
                    rows={1}
                />
                <button
                    type="submit"
                    className="ml-4 p-2 rounded-full align-self: flex-end"
                    disabled={chatbotLoading}>
                    <img src={send} alt="" className="w-6 h-6" />
                </button>
            </form>
        </div>
    )
}
