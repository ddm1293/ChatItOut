import { Link , useLocation } from "react-router-dom";
import { useState } from "react";
import React, { Component } from 'react';
import newchat from "../assets/icon_newchat.png";
import stageexp from "../assets/icon_stageexp.png";
import chathist from "../assets/icon_chathist.png";
import chatcurr from "../assets/icon_chatcurr.png";

export default function LeftSideBar() {
    const [clickedButton, setClickedButton] = useState(false);

    const handleButtonClick = () => {
        setClickedButton(true);
    };

    return (
        <>
            <div className="fixed flex h-screen bg-[#333333] inset-y-0 left-0 w-1/5">
                    {/* Title */}
                    <Link to={"/home"}>
                    <button className="absolute inset-x-0 top-6 h-29 left-6 font-bold text-2xl text-white font-calibri">
                    CONFLICT RESOLVER
                    </button>
                    </Link>

                    {/* Divider */}
                    <div className="absolute top-20 left-0 h-px bg-[#eeeeee] opacity-20 w-full"></div>

                    {/* New Chat Icon */}
                    <img src={newchat} className="absolute left-7 top-28 rounded-full" />

                    {/* New Chat */} {/* When the user clicks, a new instance of the chatnot component should be created*/}
                    <div className="absolute left-14 top-28 font-normal text-lg leading-5 text-white font-calibri">
                        New Chat 
                    </div>

                    {/* Stage Explanation Icon
                    <img src={stageexp} className="absolute left-10 top-40 square-full" /> */}

                    {/* What are 5 stages? */}
                    <Link to= {"/stageexp"}>
                    <div
                        className={`flex absolute left-1 top-40 w-80 h-10 ${
                        (useLocation().pathname === "/stageexp") ? 'bg-[#1e1e1e] rounded-lg pr-28 p1-6 pt-1' : ''
                        }`}
                    >
                        <button className="flex items-center absolute left-4 font-normal text-lg text-white font-calibri">
                        <img src={stageexp} className="left-2 top-2 square-full mx-3" alt="Stage Icon" />
                        <span>What are 5 stages?</span>
                        </button>
                    </div>
                    </Link>

                    {/* In Progress */}
                    <div className="absolute left-10 top-56 font-normal text-base leading-5 text-[#ababad] text-opacity-80 font-calibri">
                        In Progress
                    </div>

                    {/* Completed */}
                    <div className="absolute left-10 top-1/2 font-normal text-base leading-5 text-[#ababad] text-opacity-80 font-calibri">
                        Completed
                    </div>

                    {/* Divider */}
                    <div className="absolute bottom-28 left-0 h-px bg-[#eeeeee] opacity-20 w-full"></div>

                    {/* Menu items */}
                    <Link to={'/useragreement'}>
                    <div
                        className={`flex absolute left-1 bottom-12 w-80 h-10 ${
                        (useLocation().pathname === "/useragreement") ? 'bg-[#1e1e1e] rounded-lg pr-28 p1-6 pt-1' : ''
                        }`}
                    >
                    <button className="absolute left-6 font-normal text-lg leading-5 text-white font-calibri">
                        Terms of use
                    </button>
                    </div>
                    </Link>

            </div>
        </>
    )
}