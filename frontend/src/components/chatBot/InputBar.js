import send from "../../assets/icon_send.png";

export default function InputBar({ atStartRef, globalStage, handleUserInput, handleInputFocus }) {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            event.target.form.requestSubmit();
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleUserInput(event); 
    };

    return (
        <div className={`absolute bottom-28 sm:bottom-20 w-full ${atStartRef || globalStage.name === "complete" ? 'hidden' : ''}`}>
            <form onSubmit={handleSubmit} >
                <textarea
                    name="userInput"
                    className="w-4/5 mt-12 ml-2 sm:ml-8 md:ml-12 lg:ml-24 pl-2 py-2 font-calibri font-sm rounded-xl border text-[#bbbbbb] border-[#bbbbbb] bg-[#1e1e1e] focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Send your message here"
                    onBlur={handleInputFocus}
                    rows="1"
                    onKeyDown={handleKeyDown}
                />
                <span>
                    <button
                        type="submit"
                        className="mt-12 sm:ml-8 absolute right-[20%] md:right-[14%] rounded-full transform translate-y-1/2">
                        <img src={send} alt="" className="w-6 h-6" />
                    </button>
                </span>
            </form>
        </div>
    )
}
