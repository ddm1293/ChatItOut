import React from 'react';
import { StageButton, StageSeparator } from './StageButton';
import { useSelector } from 'react-redux';
import { selectCurrChatStage } from '../../slices/currChatSlice'
import { chatStages as stages }  from '../../models/ChatStages';

export default function StatusBar() {
    const currChatStage = useSelector(selectCurrChatStage)

    // Scrolls to the stage line for the specified stage
    const scrollToStage = (stage) => {
        document.getElementById(`stageLine-${stage}`).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const computeStageStatus = (stageName) => {
        const stageIndex = stages.findIndex(stage => stage === stageName)
        const currStageIndex = stages.findIndex(stage => stage === currChatStage)
        if (stageIndex < currStageIndex) {
            return 'completed'
        } else if (stageIndex === currStageIndex) {
            return 'inProgress'
        } else {
            return 'notStarted'
        }
    }

    return (
        <div>
            <div className="flex flex-row w-full custom-width-lg mt-16 lg:mt-0 h-20 bg-[#242424] absolute right-0 md:top-0">
                
                {stages.map((stage, index) => {
                    const stageStatus = computeStageStatus(stage)
                    return (
                        <React.Fragment key={stage}>
                            <StageButton
                                stageStatus={stageStatus} 
                                stageName={capitalizeFirstLetter(stage)} 
                                stageNum={index + 1} 
                                onClick={(event) => {
                                    event.preventDefault();
                                    scrollToStage(stage);
                                }} 
                                isDisabled={stageStatus === "notStarted"} 
                            />

                            {index < stages.length - 1 && <StageSeparator />}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    )
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
