import { React, useState} from 'react';
import SideBar from '../components/SideBar';
import { Link } from "react-router-dom";
import pic from '../assets/icon_welcomepage.png';
import ham from '../assets/icon_hamburgermenu.png';
import close from '../assets/icon_close.png'

export default function WelcomePage() {
    const [hamOpen, setHamOpen] = useState(false);
    
    const handleButtonOpen= () => {
        setHamOpen(true);
    };

    const handleButtonClose = () => {
        setHamOpen(close);
    };

    return (
        <>

            <div class="bg-[#1e1e1e] flex h-screen">
            <div className="z-10 absolute top-0 left-0 w-1/5 hidden sm:block">
                    <SideBar />
                </div>

                <div className= "bg-[#0E0E10] grid grid-rows-8 fixed h-screen lg:w-4/5 sm:w-full top-0 right-0 justify-center">
                    <div className="sm:hidden absolute top-0 w-full h-16 z-10 bg-black">
                        <button onClick={handleButtonOpen} className="sm:hidden">
                            <img src={ham} className="z-10 absolute top-0 right-0 mt-6 mr-10" alt="Hamburger menu bar"/>
                        </button>

                        <Link to={"/welcome"}>
                            <button className="absolute top-0 left-0 m-4 text-white font-calibri font-medium text-2xl">
                            Chat IT Out
                            </button>   
                        </Link>
                    </div>

                    <div className={`absolute right-0 top-0 z-50 w-4/5 ${hamOpen === true? "block": "hidden"}`}>
                        <SideBar />
                                    
                        <button onClick={handleButtonClose}>
                            <img src={close} className="absolute right-0 top-0 m-8"/>
                        </button>
                    </div>

                    <div className="row-start-1 mt-28 text-center text-3xl lg:text-4xl font-medium text-[#9adbff] font-calibri">
                            Welcome to Chat IT Out
                        <div className="mt-6 mx-16 text-center text-lg lg:text-xl font-normal text-white font-calibri">
                            Unlock Productive Conversations with Your Virtual Conflict Coach
                        </div>
                    </div>

                    <img className="row-span-2 sm:px-36 md:px-24" src={pic} alt="Welcome page picture" />

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
