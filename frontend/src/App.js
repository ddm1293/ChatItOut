
import React, { useEffect } from 'react'
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useState } from 'react';
import TitlePage from './pages/TitlePage.js';
import HomePage from './pages/HomePage.js';
import WelcomePage from './pages/WelcomePage.js';
import StageExp from './pages/StageExp.js';
import UserAgreement from './pages/UserAgreement.js';
import { openDB } from 'idb';

function App() {

  useEffect (() => {
    // make chat history persistent
    async function persistData() {
      if (navigator.storage && navigator.storage.persist) {
        const result = await navigator.storage.persist();
        console.log(`Data persisted: ${result}`);
      }
    }

    // Open DB
    async function createDB() {
      // Using https://github.com/jakearchibald/idb
      return await openDB('chathistory', 1, {
          upgrade(db, oldVersion, newVersion, transaction) {
              console.log("here");
              // Switch over the oldVersion, *without breaks*, to allow the database to be incrementally upgraded.
              switch(oldVersion) {
                  case 0:
                      // Placeholder to execute when database is created (oldVersion is 0)
                  case 1:
                      // Create a store of objects
                      const currStore = db.createObjectStore('current', {
                          // The `time` property of the object will be the key, and be incremented automatically
                          autoIncrement: true,
                          keyPath: 'time'
                      });
                      const doneStore = db.createObjectStore('completed', {
                          autoIncrement: true,
                          keyPath: 'time'
                      });
              }
          }
      });
  }
    persistData();
    createDB();
  }, []);


  return (
    <BrowserRouter>
    <Routes>
      <Route exact path={"/"} element={<TitlePage/>}/>
      <Route exact path={"/welcome"} element={<WelcomePage/>}/>
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

