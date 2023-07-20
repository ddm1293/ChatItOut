import { useState } from 'react';

const usePageState = () => {
    const [currentPage, setCurrentPage] = useState('home');

    const handlePageChange = (pageName) => {
        if (currentPage !== pageName) {
            setCurrentPage(pageName);
        }
    };

    return { currentPage, setCurrentPage, handlePageChange };
};




export default usePageState;