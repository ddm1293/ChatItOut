import { React, useState} from 'react';
import { Link } from "react-router-dom";
import pic from '../assets/icon_welcomepage.png';

export default function Welcome() {
    return (
        <>
                <div className= "bg-[#0E0E10] grid grid-rows-8 fixed h-screen lg:w-4/5 sm:w-full top-0 right-0 justify-center">
                    <div className="row-start-1 mt-28 text-center text-3xl lg:text-4xl font-medium text-[#9adbff] font-calibri">
                            Welcome to Chat IT Out
                        <div className="mt-6 mx-16 text-center text-lg lg:text-xl font-normal text-white font-calibri">
                            Unlock Productive Conversations with Your Virtual Conflict Coach
                        </div>
                    </div>

                    <div className="row-span-2 sm:px-36 md:px-24 flex justify-center">
                        <img className="w-4/5 h-full" src={pic} alt="Welcome page picture" />
                    </div>

                    <div className="row-span-1" />

                    <Link to={"/home"}>
                    <div className="flex row-span-1 align-top justify-center">
                        <button className="text-center text-lg font-calibri font-medium text-white bg-[#1993D6] px-24 py-2 rounded-xl hover:bg-[#4EB7F0]">
                            Start New Chat
                        </button>
                    </div>
                    </Link>
                </div>
        </>
    )
}
