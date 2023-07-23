<<<<<<< HEAD
import { createContext  } from 'react';
=======
import { useState, createContext, useContext } from 'react';
>>>>>>> a95eade76d20cfff2d76ec312ebbe1d08e22a134

export const SideBarContext = createContext({
    currentPage: 'home',
    setCurrentPage: () => {}
<<<<<<< HEAD
});
=======
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
>>>>>>> a95eade76d20cfff2d76ec312ebbe1d08e22a134
