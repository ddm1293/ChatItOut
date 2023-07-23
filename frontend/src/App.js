
import React, { useEffect } from 'react'
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import TitlePage from './pages/TitlePage.js';
import HomePage from './pages/HomePage.js';
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
    async function createDB() { // TODO: CHECK IF BROWSER SUPPORTS INDEXEDDB

      // const dbRequest = indexedDB.open('chathistory', 1);

      // dbRequest.onsuccess = () => {
      //   let db = dbRequest.result;
      //   if (!db.objectStoreNames.contains('chats')) {
      //     console.log('in succesful');
      //     indexedDB.deleteDatabase('chathistory');
      //     createDB();
      //   }
      // }

      // dbRequest.onupgradeneeded = () => {
      //   let db = dbRequest.result;
      //   const currStore = db.createObjectStore('chats', {
      //         // The `time` property of the object will be the key, and be incremented automatically
      //     autoIncrement: true,
      //     keyPath: 'time'
      //     });
      //   const doneStore = db.createObjectStore('completed', {
      //       autoIncrement: true,
      //       keyPath: 'time'
      //   });
      // }

      // Using https://github.com/jakearchibald/idb
      return await openDB('chathistory', undefined, {
          upgrade(db, oldVersion, newVersion, transaction) {
              // Switch over the oldVersion, *without breaks*, to allow the database to be incrementally upgraded.
              switch(oldVersion) {
                  // case 0:
                  //     // Placeholder to execute when database is created (oldVersion is 0)
                  //     break;
                  default:
                    // Create a store of objects
                    const chatStore = db.createObjectStore('chats', {
                      // The `time` property of the object will be the key, and be incremented automatically
                      autoIncrement: true,
                      keyPath: 'time'
                  });
                  // case 1:
                  //     // Create a store of objects
                  //     const chatStore = db.createObjectStore('chats', {
                  //         // The `time` property of the object will be the key, and be incremented automatically
                  //         autoIncrement: true,
                  //         keyPath: 'time'
                  //     });
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
      <Route exact path={"/home"} element={<HomePage/>}/>
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

