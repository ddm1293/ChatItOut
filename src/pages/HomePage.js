import React, { useState } from 'react';
import LeftSideBar from "../components/LeftSideBar"
import StatusBar from "../components/StatusBar"

// TODO: Add chatbot component to implement all the features
export default function HomePage() {

    return (
        <>

            <div class="bg-[#1e1e1e] flex h-screen">

                <div>
                    <LeftSideBar/>
                    <StatusBar/>
                </div>

           

            </div>

        </>
    )
}