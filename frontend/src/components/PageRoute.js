import { useState, createContext, useContext } from 'react';

export const SideBarContext = createContext({
    currentPage: 'home',
    setCurrentPage: () => {}
});

// export function SideBarProvider({ children }) {
//     const [currentPage, setCurrentPage] = useState('home');

//     const handlePageChange = (pageName) => {
//         if (currentPage !== pageName) {
//             setCurrentPage(pageName);
//         }
//     };

//     return (
//         <SideBarContext.Provider value={{ currentPage, handlePageChange }}>
//           {children}
//         </SideBarContext.Provider>
//       );
// }