import ailogo from "../assets/icon_ailogo.png";

// Message loading animation

export default function Loading() {
    return (
        <div className="flex">
             <img src={ailogo} alt="Chatbot Logo" className={'items-start w-12 h-12 mt-1'} />
            <span
                className={'ml-10 mb-4 p-4 font-calibri text-base whitespace-pre-wrap max-w-fit bg-[#e1e1e1] bg-opacity-10 text-white rounded-tl-xl rounded-tr-xl rounded-br-xl'}
                style={{ display: 'inline-block' }}>
                <div className="grid gap-2">
                    <div className="flex items-center justify-center space-x-2 animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                </div>
            </span>
    
        </div>
    );
}
