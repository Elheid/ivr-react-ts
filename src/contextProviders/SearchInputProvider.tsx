import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchInputContextType {
    inputValue: string;
    setInputValue: (size: string) => void;
}

const SearchInputContext = createContext<SearchInputContextType | undefined>(undefined);

interface SearchInputProviderProps {
    children: ReactNode;
}

export const SearchInputProvider: React.FC<SearchInputProviderProps> = ({ children }) => {
    const [inputValue, setInputValue] = useState(''); // Начальное значение

    return (
        <SearchInputContext.Provider value={{ inputValue, setInputValue }}>
            {children}
        </SearchInputContext.Provider>
    );
};

export const useSearchInput = (): SearchInputContextType => {
    const context = useContext(SearchInputContext);
    if (!context) {
        throw new Error('useSearchInput must be used within a SearchInputProvider');
    }
    return context;
};