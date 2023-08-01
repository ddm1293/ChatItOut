
import React, { useEffect } from 'react'
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import TitlePage from './pages/TitlePage.js';
import HomePage from './pages/HomePage.js';
import { openDB } from 'idb';

function App() {

  useEffect(() => {
    // Make chat history persistent
    async function persistData() {
      if (navigator.storage && navigator.storage.persist) {
        const result = await navigator.storage.persist();
        console.log(`Data persisted: ${result}`);
      }
    }

    // Open and setup DB
    async function createDB() {
      // Using https://github.com/jakearchibald/idb
      return await openDB('chathistory', 2, {
        upgrade(db, oldVersion, newVersion, transaction) {
          // Create a store of objects
          const chatStore = db.createObjectStore('chats', {
            // The `time` property of the object will be the key, and be incremented automatically
            autoIncrement: true,
            keyPath: 'time'
          });
        }
      }
      );
    }
    persistData();
    createDB();
  }, []);


  return (
    <BrowserRouter>
      <Routes>
        <Route exact path={"/"} element={<TitlePage />} />
        <Route exact path={"/home"} element={<HomePage />} />
        <Route exact path={"*"} element={
          <>
            <main>This page does not exist!</main>
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

