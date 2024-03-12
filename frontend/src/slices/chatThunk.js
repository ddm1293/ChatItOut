import { createAsyncThunk } from '@reduxjs/toolkit'
import { ChatSession} from '../models/ChatSession'
import { setChat } from './chatSlice'
import { setCurrPage } from './sideBarSlice'
import ChatStage from '../ChatStage'
import { produce } from 'immer'
import { indexedDBVersion } from '../common/indexedDBVersion'

export const addChatToDB = createAsyncThunk('chat/addChatToDB', async (arg, { dispatch, getState }) => {
  const emptyStart = arg;
  dispatch(setChat(emptyStart))

  // update the DB
  let dbReq = indexedDB.open("chathistory", indexedDBVersion);

  dbReq.onsuccess = function (evt) {
      let db = dbReq.result;
      if (!db.objectStoreNames.contains('chats')) {
          return;
      }
      const tx = db.transaction('chats', 'readwrite');
      const store = tx.objectStore('chats');
      store.add(emptyStart);
  }

  const currPage = getState().sideBar.currentPage
  if (currPage !== 'home') {
      dispatch(setCurrPage('home'));
  }
})

export const loadChatFromDB = createAsyncThunk('chat/loadChatFromDB', async (arg, { dispatch }) => {
  const loadDbReq = indexedDB.open("chathistory", indexedDBVersion);
  loadDbReq.onsuccess = async function (evt) {
    const db = loadDbReq.result;
    if (!db.objectStoreNames.contains('chats')) {
        return;
    }

    const tx = await db.transaction('chats', 'readonly');
    const store = tx.objectStore('chats');
    const dbChatsObj = await store.getAll();
    dbChatsObj.onsuccess = () => {
        let dbChats = dbChatsObj.result;
        console.log("see dbChats: ", dbChats)
        for (const dbChat of dbChats) {
            dispatch(setChat(dbChat));
        }
    }
    tx.oncomplete = () => {
        db.close();
    }
}
    loadDbReq.onerror = (err) => {
        console.log(err);
    }
})

export const deteleChatInDB = createAsyncThunk('chat/deleteChatInDB', async (arg) => {
    const delDbReq = indexedDB.open("chathistory", indexedDBVersion);
    delDbReq.onsuccess = async function (evt) {
        let db = delDbReq.result;
        if (!db.objectStoreNames.contains('chats')) {
            return;
        }
        const tx = await db.transaction('chats', 'readwrite');
        const store = tx.objectStore('chats');
        store.delete(arg);
    }
})