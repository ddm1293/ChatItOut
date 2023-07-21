import { createContext  } from 'react';

export const SideBarContext = createContext({
    currentPage: 'home',
    setCurrentPage: () => {}
});