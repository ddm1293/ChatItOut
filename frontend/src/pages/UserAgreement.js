import { React, useState} from 'react';
import SideBar from '../components/SideBar';
import ham from '../assets/icon_hamburgermenu.png';
import close from '../assets/icon_close.png'
import { Link } from 'react-router-dom';

// TODO: Make a page that shows privacy policy and user agreement, goes to home page upon user's agreement
export default function UserAgreement() {

    const [hamOpen, setHamOpen] = useState(false);
    const [positionBar, setpositionBar] = useState("left");
    
    const handleButtonOpen= () => {
        setHamOpen(true);
    };

    const handleButtonClose = () => {
        setHamOpen(close);
    };

    return (
        <>
            <div class="bg-[#0E0E10] flex h-screen">
            <div className="w-1/5 absolute top-0 left-0 hidden sm:block">
                    <SideBar />
                </div>

                <div className="sm:hidden">
                <Link to={"/welcome"}>
                    <p className="z-10 absolute top-0 left-0 m-4 text-white font-calibri font-medium text-2xl">
                        Chat IT Out
                    </p>   
                </Link>
                </div>
                    
                <button onClick={handleButtonOpen} className="sm:hidden">
                    <img src={ham} className="z-10 absolute top-0 right-0 mt-6 mr-10" alt="Hamburger menu bar"/>
                </button>

                <div className={`absolute right-0 top-0 z-50 w-4/5 ${hamOpen === true? "block": "hidden"}`}>
                    <SideBar />                                   
                    <button onClick={handleButtonClose}>
                        <img src={close} className="absolute right-0 top-0 m-8"/>
                    </button>
                </div>

            {/* <div className="sm:hidden absolute top-0 w-full h-16 z-10 bg-black">
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
            </div> */}

            <div className= "grid grid-rows-10 fixed h-screen top-8 right-0 w-full sm:w-4/5 justify-center overflow-y-scroll">
                <div className="text-center mt-12 text-3xl text-white font-calibri font-medium">
                    Terms of use
                </div>

                <div className="mt-12 mx-12 sm:mx-28 md:mx-36 lg:mx-48 text-medium text-white font-calibri whitespace-pre-line">
                    These Terms of Use ("Terms") govern your use of the Conflict Resolver app ("App") developed to provide conflict resolution guidance and support. By accessing or using the App, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please refrain from using the App. <br /> <br />
                </div>

                <div className="mx-12 sm:mx-28 md:mx-36 lg:mx-48 text-xl text-white font-calibri whitespace-pre-line">
                    1. Use of the App <br /> <br />
                </div>

                <div className="mx-12 sm:mx-28 md:mx-36 lg:mx-48 text-medium text-white font-calibri whitespace-pre-line">
                    1.1 The App is intended for informational purposes only and does not constitute professional advice or counseling. The guidance and suggestions provided by the App are not a substitute for personalized assistance from qualified professionals. <br /> <br />
                    1.2 You acknowledge that the App's suggestions and advice are based on general knowledge and may not be suitable for all situations. You should exercise your own judgment and discretion when applying the information provided by the App. <br /> <br />
                    1.3 The App does not guarantee the accuracy, completeness, or reliability of the information presented. The developers of the App are not responsible for any actions or decisions made based on the App's content.<br /> <br />
                </div>

                <div className="mx-12 sm:mx-28 md:mx-36 lg:mx-48 text-xl text-white font-calibri whitespace-pre-line">
                    2. User Responsibilities  <br /> <br />
                </div>

                <div className="mx-12 sm:mx-28 md:mx-36 lg:mx-48 text-medium text-white font-calibri whitespace-pre-line">
                    2.1 You agree to use the App responsibly and in compliance with applicable laws and regulations. 
                    2.2 You are solely responsible for any content you submit or share through the App, including but not limited to text, images, or audio. You must ensure that you have the necessary rights and permissions to share such content. 2.3 You shall not use the App to engage in any illegal, abusive, or harmful activities, including but not limited to harassment, defamation, or infringement of intellectual property rights. 2.4 You understand and acknowledge that the App may collect and store certain personal information as outlined in the Privacy Policy. <br /> <br />
                </div>

                <div className="mx-12 sm:mx-28 md:mx-36 lg:mx-48 text-xl text-white font-calibri whitespace-pre-line">
                    1. Use of the App <br /> <br />
                </div>

                <div className="mx-12 sm:mx-28 md:mx-36 lg:mx-48 text-medium text-white font-calibri whitespace-pre-line">
                    1.1 The App is intended for informational purposes only and does not constitute professional advice or counseling. The guidance and suggestions provided by the App are not a substitute for personalized assistance from qualified professionals. <br /> <br />
                    1.2 You acknowledge that the App's suggestions and advice are based on general knowledge and may not be suitable for all situations. You should exercise your own judgment and discretion when applying the information provided by the App. <br /> <br />
                    1.3 The App does not guarantee the accuracy, completeness, or reliability of the information presented. The developers of the App are not responsible for any actions or decisions made based on the App's content.<br /> <br />
                </div>

                <div className="mx-12 sm:mx-28 md:mx-36 lg:mx-48 text-xl text-white font-calibri whitespace-pre-line">
                    2. User Responsibilities  <br /> <br />
                </div>

                <div className="mx-12 sm:mx-28 md:mx-36 lg:mx-48 text-medium text-white font-calibri whitespace-pre-line">
                    2.1 You agree to use the App responsibly and in compliance with applicable laws and regulations. 
                    2.2 You are solely responsible for any content you submit or share through the App, including but not limited to text, images, or audio. You must ensure that you have the necessary rights and permissions to share such content. 2.3 You shall not use the App to engage in any illegal, abusive, or harmful activities, including but not limited to harassment, defamation, or infringement of intellectual property rights. 2.4 You understand and acknowledge that the App may collect and store certain personal information as outlined in the Privacy Policy. <br /> <br />
                </div>
                </div>
            </div>

        </>
    )
}