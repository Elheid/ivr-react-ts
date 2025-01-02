import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoaderContextProps {
    loader: boolean;
    setLoader: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoaderContext = createContext<LoaderContextProps | undefined>(undefined);

export const LoaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loader, setLoader] = useState<boolean>(false);

    return (
        <LoaderContext.Provider value={{ loader, setLoader }}>
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = (): LoaderContextProps => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader must be used within a LoaderProvider');
    }
    return context;
};
