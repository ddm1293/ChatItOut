import { useContext, useState, useEffect } from 'react';
import React from 'react';
import welcome1 from '../assets/icon_welcomepage.png';
import welcome2 from '../assets/icon_welcomepagemobile.png';
import { SideBarContext } from '../components/PageRoute';

export default function Welcome() {
    const { currentPage, setCurrentPage } = useContext(SideBarContext);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
    });

    return (
        <>
<<<<<<< HEAD
            <SideBarContext.Provider>
=======
        <SideBarContext.Provider>
>>>>>>> a95eade76d20cfff2d76ec312ebbe1d08e22a134
                <div className= "bg-[#0E0E10] grid grid-rows-8 fixed h-screen lg:w-4/5 sm:w-full top-0 right-0 justify-center">
                    <div className="mt-20 text-center text-3xl lg:text-4xl font-medium text-[#9adbff] font-calibri">
                            Welcome to Chat IT Out
                        <div className="mt-6 mx-16 text-center text-lg lg:text-xl font-normal text-white font-calibri">
                            Unlock Productive Conversations with Your Virtual Conflict Coach
                        </div>
                    </div>

                    <div className="row-span-2 sm:px-36 md:px-24 flex justify-center">
                        <img className="w-4/5 h-full" src={(window.innerWidth < 768? welcome2 : welcome1)} alt="Welcome page picture" />
                    </div>

                    <div className="row-span-1" />

                    <div id="startnewchat">
                    <div className="flex row-span-1 align-top justify-center">
<<<<<<< HEAD
                        <button onClick={() => setCurrentPage('home')} className="text-center text-lg font-calibri font-medium text-white bg-[#1993D6] px-24 py-2 rounded-xl hover:bg-[#4EB7F0]">
=======
                        <button onClick={() => setCurrentPage('newchat')} className="text-center text-lg font-calibri font-medium text-white bg-[#1993D6] px-24 py-2 rounded-xl hover:bg-[#4EB7F0]">
>>>>>>> a95eade76d20cfff2d76ec312ebbe1d08e22a134
                            Start New Chat
                        </button>
                    </div>
                    </div>
                </div>
            </SideBarContext.Provider>
        </>
    )
}

