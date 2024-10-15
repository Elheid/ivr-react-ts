import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ShowAdminButtonsContextType {
    showAdminButtons: boolean;
    setShowAdminButtons: (showAdminButtons: boolean) => void;
}

const  ShowAdminButtonsContext = createContext<ShowAdminButtonsContextType | undefined>(undefined);

interface  ShowAdminButtonsProps {
    children: ReactNode;
}

export const  ShowAdminButtonsProvider: React.FC<ShowAdminButtonsProps> = ({ children }) => {
    const [showAdminButtons, setShowAdminButtons] = useState<boolean>(false); // Начальное значение

    return (
        <ShowAdminButtonsContext.Provider value={{ showAdminButtons, setShowAdminButtons }}>
            {children}
        </ShowAdminButtonsContext.Provider>
    );
};

export const useShowAdminButtons = (): ShowAdminButtonsContextType => {
    const context = useContext(ShowAdminButtonsContext);
    if (!context) {
        throw new Error('useShowAdminButtons must be used within a ShowAdminButtonsProvider');
    }
    return context;
};