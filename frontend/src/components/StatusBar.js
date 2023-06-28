import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { useState } from "react";
import stagearrow from "../assets/icon_stagearrow.png";

export default function StatusBar() {
    const [isPrevCompleted, setIsPrevCompleted] = useState(false);
    const [isCurrInProgress, setIsCurrInProgress] = useState(false);
    
    const stageTransfer = () => {
        setIsPrevCompleted(true);
        setIsCurrInProgress(true);
    };


    return (
        <>
        <div className="absolute w-4/5 h-20 bg-[#242424] flex right-0 top-0">
            <div className="absolute w-4 h-4 top-8 left-20 bg-white opacity-50 rounded-full"> 
                <span className="absolute inset-x-0 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 text-black">
                    1
                </span>
                <span className="absolute left-8 -top-2 font-normal text-lg leading-22 text-white font-calibri">
                    Invitation
                </span>
                <img src={stagearrow} className="absolute left-40 top-1 rounded-full" /> 
            </div>

            <div className="absolute w-4 h-4 top-8 left-80 bg-white opacity-50 rounded-full"> 
                <span className="absolute inset-x-0 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 text-black">
                    2
                </span>
                <span className="absolute left-8 -top-2 font-normal text-lg leading-22 text-white font-calibri">
                    Connection
                </span>
                <img src={stagearrow} className="absolute left-44 top-1 rounded-full" />
            </div>

            <span style={{ left: '560px' }}
                  className="absolute w-4 h-4 top-8 bg-white opacity-50 rounded-full">
                  <span className="absolute inset-x-0 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 text-black">
                    3
                    </span>
                    <span className="absolute left-8 -top-2 font-normal text-lg leading-22 text-white font-calibri">
                        Exchange
                    </span>
                    <img src={stagearrow} className="absolute left-44 top-1 rounded-full" />
            </span>

            <span style={{ left: '800px' }}
                  className="absolute w-4 h-4 top-8 bg-white opacity-50 rounded-full">
                  <span className="absolute inset-x-0 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 text-black">
                    4
                    </span>
                    <span className="absolute left-8 -top-2 font-normal text-lg leading-22 text-white font-calibri">
                        Agreement
                    </span>
                    <img src={stagearrow} className="absolute left-44 top-1 rounded-full" />
            </span>

            <span style={{ left: '1040px' }}
                  className="absolute w-4 h-4 top-8 bg-white opacity-50 rounded-full">
                  <span className="absolute inset-x-0 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 text-black">
                    5
                    </span>
                    <span className="absolute left-8 -top-2 font-normal text-lg leading-22 text-white font-calibri">
                        Reflection
                    </span>
            </span>


            {/* 

            <img src={stagearrow} className="absolute left-52 top-9 rounded-full" /> 

            <div className="absolute w-4 h-4 top-8 left-64 bg-white opacity-50 rounded-full"> 
                <span className="absolute inset-x-0 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 text-black">
                    4
                </span>
            </div>
            <div className="absolute left-72 top-6 font-normal text-lg leading-22 text-white text-opacity-50 font-calibri">
                Agreement
            </div>

            <img src={stagearrow} className="absolute left-52 top-9 rounded-full" /> 

            <div className="absolute w-4 h-4 top-8 left-64 bg-white opacity-50 rounded-full"> 
                <span className="absolute inset-x-0 flex items-center justify-center -top-1 font-calibri font-normal text-14 leading-17 text-black">
                    5
                </span>
            </div>
            <div className="absolute left-72 top-6 font-normal text-lg leading-22 text-white text-opacity-50 font-calibri">
                Relection
            </div> */}

        </div>
        </>
    )
}