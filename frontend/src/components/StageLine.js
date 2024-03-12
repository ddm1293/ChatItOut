import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux'
import { setCurrPage } from '../slices/sideBarSlice'

export default function StageLine(props) {
    const dispatch = useDispatch();
    const [text, setText] = useState();
    const [guideText, setGuideText] = useState('');

    const stageGuide = {
        "invitation": `In the Invitation stage, try to firstly discuss with the chatbot about the conflict;
        focus on your and the other party’s awareness, readiness, and understanding of the conflict;
        eventially try to initiate contact, and set up an environment for a collaborative conversation.`,
        "connection":  `In the Connection stage, start with the other person’s state of mind, heart and then share yours; clarify what needs to be resolved or discussed in this conversation.`,
        "exchange": `In the Exchange stage, the priority is to prepare for the actual conversation with the other party on how to exchange relevant information and build shared meaning about the conflict;
        try your best to look for common ground, and explore what is important in terms of each other's perspective.`,
        "agreement": `In the Agreement stage, aim to co-create possible solutions with the other party;\
        More specifically, discuss with the chatbot about potential options based on what is important to both parites;\
        and then evaluate their options and check for fairness to ensure that the needs of both people are met.
        lasly, form an action plan: who, what, when, where, how, and work out the details.`,
        "reflection": `In the final Reflection stage, discuss with the chatbot how satisfied both parites about the outcomes;
        try to establish follow-up steps and future check-ins.`
    }

    // The text depends on the stage of the conversation
    useEffect(() => {
        if (props.text === "This is the end of this conversation.") {
            setText(<>This is the end of this coaching. Back to <button className="text-[#1993D6] hover:text-[#9ADBFF] underline" onClick={() => dispatch(setCurrPage('welcome'))}>Home</button> page</>);
        } else {
            setText(`Below is ${props.text.charAt(0).toUpperCase() + props.text.slice(1)} Stage`);
            setGuideText(stageGuide[props.text]);
        }
    }, [])

    // Stage line
    return (
        <div className="flex flex-col items-center py-5" id={`stageLine-${props.text}`}>
            <div className="w-full border-t border-[#494949]"></div>
            <span className="mx-4 my-2 text-[#a3a3a3]">{text}</span>
            <p className="text-[#a3a3a3] mt-0">{guideText}</p>
        </div>
    );
}
