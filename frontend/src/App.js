
import React, { useEffect } from 'react'
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useState } from 'react';
import HomePage from './pages/HomePage.js';
import WelcomePage from './pages/WelcomePage.js';
import StageExp from './pages/StageExp.js';
import UserAgreement from './pages/UserAgreement.js';

function App() {

  // make chat history persistent
  useEffect (() => {
    async function persistData() {
      if (navigator.storage && navigator.storage.persist) {
        const result = await navigator.storage.persist();
        console.log(`Data persisted: ${result}`);
      }
    }
    persistData();
  }, []);


  return (
    <BrowserRouter>
    <Routes>
      <Route exact path={"/"} element={<WelcomePage/>}/>
      <Route exact path={"/useragreement"} element={<UserAgreement/>}/>
      <Route exact path={"/home"} element={<HomePage/>}/>
      <Route exact path={"/stageexp"} element={<StageExp/>}/>
      <Route exact path={"*"} element={
            <>
                <main>This page does not exist!</main>
            </>
        }/>
    </Routes>
   </BrowserRouter>
  );
}

export default App;

