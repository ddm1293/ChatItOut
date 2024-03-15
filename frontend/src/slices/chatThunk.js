import { createAsyncThunk } from '@reduxjs/toolkit'
import { setCurrPage } from './sideBarSlice'
import { indexedDBVersion } from '../common/indexedDBVersion'
import axios from 'axios'
import { 
    setChat, 
    pushCurrChatMessage, 
    pushCurrChatMessageCount,
    setZeroCurrChatMessageCount,
    incrementCurrChatRefusalCount,
    advanceCurrChatStage,
    setCurrChatAtStartRef,
    setZeroCurrChatRefusalCount,
 } from './chatSlice'
import { 
    pushMessage, 
    addMessageCount,
    setZeroMessageCount,
    incrementRefusalCount,
    advanceStage,
    setAtStartRef,
    setZeroRefusalCount,
 } from './currChatSlice'

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

export const loadChatFromDB = createAsyncThunk('chat/loadChatFromDB', async (_, { dispatch }) => {
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
        const dbChats = dbChatsObj.result;
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

// export const serverURL = "https://chatitout-server-26d52a60d625.herokuapp.com";
export const serverURL = "http://127.0.0.1:5000";

const stages = [
    { key: 1, name: "invitation", status: "inProgress" },
    { key: 2, name: "connection", status: "notStarted" },
    { key: 3, name: "exchange", status: "notStarted" },
    { key: 4, name: "agreement", status: "notStarted" },
    { key: 5, name: "reflection", status: "notStarted" },
    { key: 6, name: "complete", status: "notStarted" }
]

const getStageNum = (currStage) => {
    const stage = stages.find(stage => stage.name === currStage);
        if (!stage) {
            console.error("something wrong with the getStageNum");
        }
        return stage ? stage.key : -1;
}

export const getAIResponse = createAsyncThunk('chat/getAIResponse', async (userInput, { getState, rejectWithValue }) => {
    const currChatMessages = getState().currChat.messages
    const sessionId = getState().currChat.sessionId
    const currChatStage = getState().currChat.stage
    const context = Object.values(currChatMessages).flat()
    let input = { sessionId: sessionId, context: context, newMsg: userInput, stage: getStageNum(currChatStage) };

    try {
        const resp = await axios.post(`${serverURL}/home/chat`, input, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return resp.data;
    } catch (err) {
        console.log(err);
        return rejectWithValue("getAIResponse encountered error")
    }
})

export const pushMessagesSync = createAsyncThunk('chat/pushMessagesSync', async (content, { dispatch, getState }) => {
    const currChatStage = getState().currChat.stage
    const sessionId = getState().currChat.sessionId
    dispatch(pushMessage({ stage: currChatStage, content }))
    dispatch(pushCurrChatMessage({ sessionId, stage: currChatStage, content }))
    dispatch(saveCurrChatToDB())
})

export const incrementMessageCountSync = createAsyncThunk('chat/incrementMessageCountSync', async (_, { dispatch, getState }) => {
    const stage = getState().currChat.stage
    const sessionId =  getState().currChat.sessionId
    dispatch(addMessageCount(stage))
    dispatch(pushCurrChatMessageCount({ sessionId, stage }))
    dispatch(saveCurrChatToDB())
})

export const setZeroMessageCountSync = createAsyncThunk('chat/setZeroMessageCountSync', async (_, { dispatch, getState }) => {
    const stage = getState().currChat.stage
    const sessionId =  getState().currChat.sessionId
    dispatch(setZeroMessageCount(stage))
    dispatch(setZeroCurrChatMessageCount({ sessionId, stage }))
    dispatch(saveCurrChatToDB())
})

export const incrementRefusalCountSync = createAsyncThunk('chat/incrementRefusalCountSync', async (_, { dispatch, getState }) => {
    const sessionId =  getState().currChat.sessionId
    dispatch(incrementRefusalCount())
    dispatch(incrementCurrChatRefusalCount(sessionId))
    dispatch(saveCurrChatToDB())
})

export const setZeroRefusalCountSync = createAsyncThunk('chat/setZeroRefusalCountSync', async (_, { dispatch, getState }) => {
    const sessionId =  getState().currChat.sessionId
    dispatch(setZeroRefusalCount())
    dispatch(setZeroCurrChatRefusalCount(sessionId))
    dispatch(saveCurrChatToDB())
})

export const advanceStageSync = createAsyncThunk('chat/advanceStageSync', async(_, { dispatch, getState }) => {
    const sessionId = getState().currChat.sessionId
    dispatch(advanceStage())
    dispatch(advanceCurrChatStage(sessionId))
    dispatch(saveCurrChatToDB())
})

export const setAtStartRefSync = createAsyncThunk('chat/setAtStartRefSync', async(bool, { dispatch, getState }) => {
    const sessionId = getState().currChat.sessionId
    dispatch(setAtStartRef(bool))
    dispatch(setCurrChatAtStartRef({ sessionId, bool }))
    dispatch(saveCurrChatToDB())
})

export const saveCurrChatToDB = createAsyncThunk('chat/saveToDB', async (_, { getState }) => {
    const dbReq = indexedDB.open("chathistory", indexedDBVersion);
    const currChat = getState().currChat
    dbReq.onsuccess = function (evt) {
        let db = dbReq.result;
        if (!db.objectStoreNames.contains('chats')) {
            return;
        }
        const tx = db.transaction('chats', 'readwrite');
        const store = tx.objectStore('chats');
        store.put(currChat);
    }
})