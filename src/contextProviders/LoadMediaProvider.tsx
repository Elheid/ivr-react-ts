import { createContext, useState, ReactNode, useContext } from 'react';

// Определяем типы для контекста
interface LoadContextProps {
    iconLoaded: boolean;
    videoLoaded: boolean;
    setIconLoaded: (loaded: boolean) => void;
    setVideoLoaded: (loaded: boolean) => void;
}

// Создаем контекст с начальными значениями
const LoadContext = createContext<LoadContextProps | undefined>(undefined);

export const LoadMediaProvider = ({ children }: { children: ReactNode }) => {
    const [iconLoaded, setIconLoaded] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);

    return (
        <LoadContext.Provider
            value={{
                iconLoaded,
                videoLoaded,
                setIconLoaded,
                setVideoLoaded,
            }}
        >
            {children}
        </LoadContext.Provider>
    );
};

export const useLoadContext = (): LoadContextProps => {
    const context = useContext(LoadContext);
    if (context === undefined) {
        throw new Error('useLoadContext must be used within a LoadProvider');
    }
    return context;
};

