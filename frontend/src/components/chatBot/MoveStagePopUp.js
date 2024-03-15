import React from 'react';
import { useDispatch } from 'react-redux';
import { setZeroMessageCountSync, incrementRefusalCountSync } from '../../slices/chatThunk'

export default function MoveStagePopUp({ globalStage, advanceStage, setShowPopup }) {
    const dispatch = useDispatch()
    const text = globalStage.name === "reflection" ? "We've had a substantial conversation in the Reflecion stage. Would you want to end this conversation?" 
    : "We've had a substantial conversation in this stage. Would you like to proceed to the next stage to continue the discussion?"
    return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black opacity-60"></div>

        <div className="relative bg-[#333333] p-6 rounded-lg shadow-lg max-w-md w-full text-white">
        <p className="mb-4 text-center font-calibri text-lg"> {text} </p>
        <div className="flex justify-between">
            <button 
            onClick={() => {
                dispatch(setZeroMessageCountSync())
                advanceStage();
                setShowPopup(false);
            }}
            className="px-6 py-2 bg-[#1e1e1e] text-white border border-white rounded-lg hover:bg-[#444] focus:outline-none focus:border-[#555]"
            >
            Yes
            </button>
            <button 
            onClick={() => {
                console.log("see movestage pop up here")
                dispatch(incrementRefusalCountSync())
                dispatch(setZeroMessageCountSync())
                setShowPopup(false);
            }}
            className="px-6 py-2 bg-[#1e1e1e] text-white border border-white rounded-lg hover:bg-[#444] focus:outline-none focus:border-[#555]"
            >
            No
            </button>
        </div>
        </div>
    </div>
    );
}
