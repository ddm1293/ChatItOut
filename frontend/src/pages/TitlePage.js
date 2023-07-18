import React, { useEffect } from 'react';
import logo from '../assets/icon_logo.png';
import collab from '../assets/icon_collab.png';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {

    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            navigate('/welcome')
        }, 2000)
    }, [])

    return (
        <>

            <div class="flex h-screen bg-[#024DA1] justify-center">

                <img className= "absolute top-[28%] h-60 w-56" src={logo} alt="logo" />

                <div className="absolute top-[55%] text-5xl font-medium text-[#9adbff]">
                    Chat IT Out
                </div>

                <img className= "absolute bottom-20 h-12 w-72" src={collab} alt="JIBC x Center for Digital Media" />
            </div>

        </>
    )
}