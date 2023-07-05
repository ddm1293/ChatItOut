import { createContext, useMemo, useState } from "react";
import Stage from './Stage';

// const [currChatHist, setCurrChatHist] = useState({})

// const HistoryContext = createContext({currChatHist, setCurrChatHist});

// const HistoryContextProvider = ({ children }) => {
//     return (
//         <HistoryContext.Provider value={{ currChatHist, setCurrChatHist }}>
//             ...children
//         </HistoryContext.Provider>
//     )
// }

// export { HistoryContext, HistoryContextProvider };

// const HistoryContext = createContext();

// const HistoryContextProvider = ({ children }) => {
//     // the value that will be given to the context
//     const [currChatHist, setCurrChatHist] = useState({messages: {invitation: [], connection: [], exchange: [], agreement: [], reflection: []}, stage: Stage.Invitation});

//     const contextValue = useMemo(() => ({
//         currChatHist
//     }), [currChatHist])
  
//     return (
//       // the Provider gives access to the context to its children
//       <HistoryContext.Provider value={{contextValue, setCurrChatHist}}>
//         {children}
//       </HistoryContext.Provider>
//     );
//   };
  
//   export { HistoryContext, HistoryContextProvider };

const HistoryContext = createContext({
  currChatHist: {messages: {invitation: [], connection: [], exchange: [], agreement: [], reflection: []}, stage: Stage.Invitation},
  setCurrChatHist: () => {}
});

export { HistoryContext };