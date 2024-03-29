import { useContext, useState, useEffect } from 'react';
import React from 'react';
import welcome1 from '../assets/icon_welcomepage.png';
import welcome2 from '../assets/icon_welcomepagemobile.png';
import { useDispatch } from 'react-redux'
import { setCurrPage } from '../slices/sideBarSlice'

export default function Welcome() {
    const dispatch = useDispatch();

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Resize when the window width changes
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
    });

    return (
        <>
                <div className= "bg-[#0E0E10] grid grid-rows-8 fixed h-screen w-full custom-width-lg top-0 right-0 justify-center">
                    {/* Welcome Text */}
                    <div className="mt-20 text-center text-3xl lg:text-4xl font-medium text-[#9adbff] font-calibri">
                            Welcome to Chat IT Out
                        <div className="mt-6 mx-16 text-center text-lg lg:text-xl font-normal text-white font-calibri">
                            Unlock Productive Conversations with Your Virtual Conflict Coach
                        </div>
                    </div>

                    {/* Spacing */}
                    <div className="grid row-span-1 hidden sm:block" />

                    {/* Welcome Image, load different image based on the screen size */}
                    <div className="row-span-3 sm:px-36 md:px-24 flex justify-center items-center">
                        <img className="w-4/5 h-4/5 sm:h-full" src={(window.innerWidth < 768? welcome2 : welcome1)} alt="Welcome page picture" />
                    </div>

                    {/* Spacing */}
                    <div className="grid row-span-1 hidden sm:block" />

                    {/* Button to start a new chat */}
                    <div id="startnewchat">
                    <div className="flex row-span-1 align-top justify-center">
                        <button onClick={() => dispatch(setCurrPage('newchat'))} className="text-center text-lg font-calibri font-medium text-white hover:text-black bg-[#1993D6] px-24 py-2 rounded-xl hover:bg-[#4EB7F0]">
                            Start New Chat
                        </button>
                    </div>
                    </div>
                </div>
        </>
    )
}

