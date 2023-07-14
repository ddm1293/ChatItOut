import React from 'react';
import LeftSideBar from '../components/LeftSideBar';
import { Link } from "react-router-dom";
import pic from '../assets/icon_welcomepage.png';
import newChat from '../components/LeftSideBar';

export default function WelcomePage() {

    return (
        <>

            <div class="bg-[#1e1e1e] flex h-screen">
                <LeftSideBar />

                <div className= "grid grid-rows-8 fixed h-screen top-0 right-0 w-4/5 bg-[#0E0E10] justify-center">
                    <div className="row-start-1 mt-28 text-center text-4xl font-medium text-[#9adbff] font-calibri">
                        Welcome to Chat IT Out
                        <div className="mt-6 text-center text-xl font-normal text-white font-calibri">
                            Unlock Productive Conversations with Your Virtual Conflict Coach
                        </div>
                    </div>

                    <img className="row-span-2" src={pic} alt="Welcome page picture" />

                    <Link to={"/home"}>
                    <div className="flex row-span-1 align-top justify-center">
                        <button className="text-center text-lg font-calibri font-medium text-white bg-[#1993D6] px-24 py-2 rounded-xl hover:bg-[#4EB7F0]">
                            Start New Chat
                        </button>
                    </div>
                    </Link>
                </div>
            </div>

        </>
    )
}
