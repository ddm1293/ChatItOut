import { Link } from "react-router-dom";
import { useState } from "react";
import React, { Component } from 'react';
import newchat from "../assets/icon_newchat.png";
import stageexp from "../assets/icon_stageexp.png";
import chathist from "../assets/icon_chathist.png";
import chatcurr from "../assets/icon_chatcurr.png";

export default function LeftSideBar() {
    const [activeMenu, setActiveMenu] = useState(null);
    
    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
    };

    const closeMenu = () => {
        setActiveMenu(null);
    };

    return (
        <>
            <div className="fixed flex h-screen bg-[#333333] inset-y-0 left-0 w-1/5">
                    {/* Title */}
                    <div className="absolute inset-x-0 top-6 h-29 left-6 font-bold text-2xl text-white font-calibri">
                    CONFLICT RESOLVER
                    </div>

                    {/* Divider */}
                    <div className="absolute top-20 left-0 h-px bg-[#eeeeee] opacity-20 w-full"></div>

                    {/* New Chat Icon */}
                    <img src={newchat} className="absolute left-10 top-28 rounded-full" />

                    {/* New Chat */}
                    <div className="absolute left-16 top-28 font-normal text-lg leading-5 text-white font-calibri">
                        New Chat
                    </div>

                    {/* Stage Explanation Icon */}
                    <img src={stageexp} className="absolute left-10 top-40 rounded-full" />

                    {/* What are 5 stages? */}
                    <div className="absolute left-16 top-40 font-normal text-lg leading-5 text-white font-calibri">
                        What are 5 stages?
                    </div>

                    {/* In Progress */}
                    <div className="absolute left-10 top-56 font-normal text-base leading-5 text-[#ababad] text-opacity-80 font-calibri">
                        In Progress
                    </div>

                    {/* Completed */}
                    <div className="absolute left-10 top-1/2 font-normal text-base leading-5 text-[#ababad] text-opacity-80 font-calibri">
                        Completed
                    </div>

                    {/* Divider */}
                    <div className="absolute bottom-40 left-0 h-px bg-[#eeeeee] opacity-20 w-full"></div>

                    {/* Menu items */}
                    <div className="absolute left-10 bottom-28 font-normal text-lg leading-5 text-white font-calibri">
                        Terms of use
                    </div>

                    <div className="absolute left-10 bottom-16 font-normal text-lg leading-5 text-white font-calibri">
                        Privacy policy
                    </div>

            </div>
        </>
    )
}