import React from 'react';
import LeftSideBar from '../components/LeftSideBar';
import { Link } from "react-router-dom";
import pic from '../assets/welcomepageplaceholder.png';

export default function WelcomePage() {

    return (
        <>

            <div class="bg-[#1e1e1e] flex h-screen">
                <LeftSideBar />

                <div className= "grid grid-rows-6 fixed h-screen top-0 right-0 w-4/5 bg-[#0E0E10] justify-center">
                    <div className="row-span-1 mt-28 text-center text-4xl font-medium text-[#9adbff] font-calibri">
                        Welcome to Chat IT Out
                        <div className="mt-6 text-center text-xl font-normal text-white font-calibri">
                            Unlock Productive Conversations with <br />
                            Your Virtual Conflict Coach
                        </div>
                    </div>

                    <div class="row-span-1" />

                    <img className="row-span-3" src={pic} alt="Welcome page picture" />

                    <Link to={"/home"}>
                    <div className="flex row-span-1 justify-center">
                        <button className="text-center text-lg font-calibri font-medium text-black bg-[#9adbff] px-8 py-2 rounded-xl">
                            Start New Chat
                        </button>
                    </div>
                    </Link>
                </div>
            </div>

        </>
    )
}
