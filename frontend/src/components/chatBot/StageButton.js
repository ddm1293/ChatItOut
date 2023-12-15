import React from 'react'
import stagearrow from "../../assets/icon_stagearrow.png"
import stagecomplete from "../../assets/icon_stagecomplete.png"

export function StageButton({ stage, stageName, stageNum, onClick, isDisabled }) {
    if (stageName.toLowerCase() === "complete") {
        return <></>
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
        if (stage === "notStarted") {
            return 'opacity-50 bg-white';
        } else if (stage === "inProgress") {
            return 'opacity-100 bg-[#1993D6] text-black';
        } else {
            return 'hidden';
        }
    };

    return (
        <button onClick={onClick} className='w-[18%] justify-center group' disabled={isDisabled}>
            <div className={`flex flex-col justify-center items-center w-full h-20 ${stage === "inProgress" ? "border-b-4 border-[#1993D6]" : ""} ${stage !== "notStarted" ? "group-hover:border-b-4 group-hover:border-[#1993D6]" : ""}`}>
                <div className='p-4'>
                    <div className={`flex flex-col md:flex-row items-center md:inline-flex pl-3`}>
                        <div className={`w-6 h-6 md:w-5 md:h-5 rounded-full justify-center flex items-center ${buttonColor(stage)}`}> 
                            <p className="-top-1 font-calibri text-base text-center"> {stageNum} </p>
                        </div>
                        <img className={`w-6 h-6 md:w-5 md:h-5 rounded-full bg-[#1993D6] ${stage === "completed" ? "block" : "hidden"}`} src={stagecomplete} alt="Stage Complete" /> 
                        <p className={`md:ml-2 text-sm sm:text-base md:text-lg leading-22 font-calibri ${wordColor(stage)}`}>
                            {stageName}
                        </p>
                    </div>
                </div>
            </div>
        </button>
    );
}

export function StageSeparator() {
    return (
        <div className="flex max-w-xs items-center">
                    <img src={stagearrow} className="w-4" alt="Stage Arrow" />
        </div>
    )
}
