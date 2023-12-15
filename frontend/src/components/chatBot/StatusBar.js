import React from 'react';
import { StageButton, StageSeparator } from './StageButton';

export default function StatusBar({ stages }) {
    // Scrolls to the stage line for the specified stage
    const scrollToStage = (stage) => {
        document.getElementById(`stageLine-${stage.name}`).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    return (
        <div>
            <div className="flex flex-row w-full custom-width-lg mt-16 lg:mt-0 h-20 bg-[#242424] absolute right-0 md:top-0">
                
                {stages.map((stage, index) => {
                    return (
                        <React.Fragment key={stage.name}>
                            <StageButton
                                stage={stage.status} 
                                stageName={capitalizeFirstLetter(stage.name)} 
                                stageNum={index + 1} 
                                onClick={(event) => {
                                    event.preventDefault();
                                    scrollToStage(stage);
                                }} 
                                isDisabled={stage.status === "notStarted"} 
                            />

                            {index < stages.length - 2 && <StageSeparator />}
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
