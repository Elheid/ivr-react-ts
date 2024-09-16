import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SizeCardContextType {
    size: number;
    setSize: (size: number) => void;
}

const CardSizeContext = createContext<SizeCardContextType | undefined>(undefined);

interface CardSizeProviderProps {
    children: ReactNode;
}

export const CardSizeProvider: React.FC<CardSizeProviderProps> = ({ children }) => {
    const [size, setSize] = useState<number>(6); // Начальное значение

    return (
        <CardSizeContext.Provider value={{ size, setSize }}>
            {children}
        </CardSizeContext.Provider>
    );
};

export const useCardSize = (): SizeCardContextType => {
    const context = useContext(CardSizeContext);
    if (!context) {
        throw new Error('useSize must be used within a SizeProvider');
    }
    return context;
};