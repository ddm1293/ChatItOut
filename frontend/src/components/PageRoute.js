import { createContext  } from 'react';

// use context hook for updating side bar
export const SideBarContext = createContext({
    currentPage: 'home',
    setCurrentPage: () => {}
});
