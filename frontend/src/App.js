
import React, { useEffect } from 'react'
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import TitlePage from './pages/TitlePage.js';
import HomePage from './pages/HomePage.js';
import { openDB } from 'idb';
import { indexedDBVersion } from './common/indexedDBVersion.js'

function App() {

  useEffect(() => {
    // Make chat history persistent
    async function persistData() {
      if (navigator.storage && navigator.storage.persist) {
        const result = await navigator.storage.persist();
        // console.log(`see navigator storage persist: ${result}`);
      }
    }

    // Open and setup DB
    async function createDB() {
      try {
          // Using https://github.com/jakearchibald/idb
          const db = await openDB("chathistory", indexedDBVersion, { 
            upgrade(db, oldVersion, newVersion, transaction) {
              
              if(!db.objectStoreNames.contains('chats')) {
                  console.log("Creating 'chats' object store");
                  db.createObjectStore('chats', {
                    keyPath: 'sessionId'
                  });
              } else {
                  console.log("'chats' object store already exists");
              }
            },
            blocked() {
              console.log("The database opening is blocked");
            },
            blocking() {
              console.log("The database opening is blocking");
            },
            terminated() {
              console.log("The database connection is terminated");
            }
          });
          console.log('Database opened successfully:', db);
      } catch (error) {
          console.error('Error occurred while opening or upgrading the database:', error);
      }
    }
    persistData();
    createDB();
  }, []);


  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<TitlePage />} />
        <Route path={"/home"} element={<HomePage />} />
        <Route path={"*"} element={
          <>
            <main>This page does not exist!</main>
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

