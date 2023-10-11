import React from 'react'
import stagearrow from "../../assets/icon_stagearrow.png"
import stagecomplete from "../../assets/icon_stagecomplete.png"

export default function StatusBar({ invStage, conStage, excStage, agrStage, refStage }) {
    // Scrolls to the stage line for the specified stage
    const scrollToStage = (stage) => {
        document.getElementById(`stageLine-${stage}`).scrollIntoView({ behavior: 'smooth' });
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

    const buttonColor = (stage) => {
        if (stage == "notStarted") {
            return 'opacity-50 bg-white';
        } else if (stage == "inProgress") {
            return 'opacity-100 bg-[#1993D6] text-black';
        } else {
            return 'hidden';
        }
    };

    return (
        <div>
            {/* Top Status Bar */}
            <div className="flex flex-row w-full sm:w-4/5 h-20 bg-[#242424] absolute right-0 md:top-0 top-16">

                <button onClick={() => scrollToStage('invitation')} className='w-[18%] justify-center group'>
                    <div className={`flex flex-col justify-center items-center w-full h-20 ${invStage === "inProgress" ? "border-b-4 border-[#1993D6]" : ""} group-hover:border-b-4 group-hover:border-[#1993D6]`}>
                        <div className='p-4'>
                            <div className={`flex flex-col md:flex-row items-center md:inline-flex`}>
                                <div className={`w-6 h-6 md:w-5 md:h-5 rounded-full justify-center flex items-center ${buttonColor(invStage)}`}> 
                                    <p className="-top-1 font-calibri text-base text-center"> 1 </p>
                                </div>
                                <img className={`w-6 h-6 md:w-5 md:h-5 rounded-full bg-[#1993D6] ${invStage === "completed" ? "block" : "hidden"}`} src={stagecomplete} alt="Stage Complete" /> 
                                <p className={`md:ml-6 text-sm sm:text-base md:text-lg leading-22 font-calibri ${wordColor(invStage)}`}>
                                    Invitation
                                </p>
                            </div>
                        </div>
                    </div>
                </button>

                <div className="flex max-w-xs items-center">
                    <img src={stagearrow} className="w-4" alt="Stage Arrow" />
                </div>

                <button onClick={() => scrollToStage('connection')} className='w-[18%] group justify-center' disabled={conStage === "notStarted"}>
                    <div className={`flex flex-col justify-center items-center w-full h-20 ${conStage === "inProgress" ? "border-b-4 border-[#1993D6]" : ""} ${conStage !== "notStarted" ? "group-hover:border-b-4 group-hover:border-[#1993D6]" : ""}`}>
                        <div className='p-4'>
                            <div className={`flex flex-col md:flex-row items-center md:inline-flex`}>
                                <div className={`w-6 h-6 md:w-5 md:h-5 rounded-full justify-center flex items-center ${buttonColor(conStage)}`}> 
                                    <p className="-top-1 font-calibri text-base text-center"> 2 </p>
                                </div>
                                <img className={`w-6 h-6 md:w-5 md:h-5 rounded-full bg-[#1993D6] ${conStage === "completed" ? "block" : "hidden"}`} src={stagecomplete} alt="Stage Complete" /> 
                                <p className={`md:ml-6 text-sm sm:text-base md:text-lg leading-22 font-calibri ${wordColor(conStage)}`}>
                                    Connection
                                </p>
                            </div>
                        </div>
                    </div>
                </button>

                <div className="flex max-w-xs items-center">
                    <img src={stagearrow} className="w-4" alt="Stage Arrow" />
                </div>

                <button onClick={() => scrollToStage('exchange')} className='w-[18%] justify-center group' disabled={excStage === "notStarted"}>
                    <div className={`flex flex-col justify-center items-center w-full h-20 ${excStage === "inProgress" ? "border-b-4 border-[#1993D6]" : ""} ${excStage !== "notStarted" ? "group-hover:border-b-4 group-hover:border-[#1993D6]" : ""}`}>
                        <div className='p-4'>
                            <div className={`flex flex-col md:flex-row items-center md:inline-flex`}>
                                <div className={`w-6 h-6 md:w-5 md:h-5 rounded-full justify-center flex items-center ${buttonColor(excStage)}`}> 
                                    <p className="-top-1 font-calibri text-base text-center"> 3 </p>
                                </div>
                                <img className={`w-6 h-6 md:w-5 md:h-5 rounded-full bg-[#1993D6] ${excStage === "completed" ? "block" : "hidden"}`} src={stagecomplete} alt="Stage Complete" /> 
                                <p className={`md:ml-6 text-sm sm:text-base md:text-lg leading-22 font-calibri ${wordColor(excStage)}`}>
                                    Exchange
                                </p>
                            </div>
                        </div>
                    </div>
                </button>

                <div className="flex max-w-xs items-center">
                    <img src={stagearrow} className="w-4" alt="Stage Arrow" />
                </div>

                <button onClick={() => scrollToStage('agreement')} className='w-[18%] justify-center group' disabled={agrStage === "notStarted"}>
                    <div className={`flex flex-col justify-center items-center w-full h-20 ${agrStage === "inProgress" ? "border-b-4 border-[#1993D6]" : ""} ${agrStage !== "notStarted" ? "group-hover:border-b-4 group-hover:border-[#1993D6]" : ""}`}>
                        <div className='p-4'>
                            <div className={`flex flex-col md:flex-row items-center md:inline-flex`}>
                                <div className={`w-6 h-6 md:w-5 md:h-5 rounded-full justify-center flex items-center ${buttonColor(agrStage)}`}> 
                                    <p className="-top-1 font-calibri text-base text-center"> 4 </p>
                                </div>
                                <img className={`w-6 h-6 md:w-5 md:h-5 rounded-full bg-[#1993D6] ${agrStage === "completed" ? "block" : "hidden"}`} src={stagecomplete} alt="Stage Complete" /> 
                                <p className={`md:ml-6 text-sm sm:text-base md:text-lg leading-22 font-calibri ${wordColor(agrStage)}`}>
                                    Agreement
                                </p>
                            </div>
                        </div>
                    </div>
                </button>

                <div className="flex max-w-xs items-center">
                    <img src={stagearrow} className="w-4" alt="Stage Arrow" />
                </div>

                <button onClick={() => scrollToStage('reflection')} className='w-[18%] justify-center group' disabled={refStage === "notStarted"}>
                    <div className={`flex flex-col justify-center items-center w-full h-20 ${refStage === "inProgress" ? "border-b-4 border-[#1993D6]" : ""} ${refStage !== "notStarted" ? "group-hover:border-b-4 group-hover:border-[#1993D6]" : ""}`}>
                        <div className='p-4'>
                            <div className={`flex flex-col md:flex-row items-center md:inline-flex`}>
                                <div className={`w-6 h-6 md:w-5 md:h-5 rounded-full justify-center flex items-center ${buttonColor(refStage)}`}> 
                                    <p className="-top-1 font-calibri text-base text-center"> 5 </p>
                                </div>
                                <img className={`w-6 h-6 md:w-5 md:h-5 rounded-full bg-[#1993D6] ${refStage === "completed" ? "block" : "hidden"}`} src={stagecomplete} alt="Stage Complete" /> 
                                <p className={`md:ml-6 text-sm sm:text-base md:text-lg leading-22 font-calibri ${wordColor(refStage)}`}>
                                    Reflection
                                </p>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    )
}
