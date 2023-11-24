import ailogo from "../../assets/icon_ailogo.png";

export default function Message({ message, index }) {
  return (
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
  )
}
