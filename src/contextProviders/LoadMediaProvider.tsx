import { createContext, useState, ReactNode, useContext, useCallback } from 'react';
/*
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

*/








interface LoadContextProps {
    allIconsStatus: Record<string, boolean>; // Объект для состояния загрузки каждой иконки
    allVideosStatus: Record<string, boolean>; // Объект для состояния загрузки каждого видео
    areAllIconsLoaded: boolean; // Все иконки загружены
    areAllVideosLoaded: boolean; // Все видео загружены
    registerIcon: (id: string) => void; // Регистрация новой иконки
    registerVideo: (id: string) => void; // Регистрация нового видео
    setIconLoaded: (id: string) => void; // Установить статус загрузки иконки
    setVideoLoaded: (id: string) => void; // Установить статус загрузки видео
}

const LoadContext = createContext<LoadContextProps | undefined>(undefined);

export const LoadMediaProvider = ({ children }: { children: ReactNode }) => {
    const [allIconsStatus, setAllIconsStatus] = useState<Record<string, boolean>>({});
    const [allVideosStatus, setAllVideosStatus] = useState<Record<string, boolean>>({});

    const areAllIconsLoaded = Object.values(allIconsStatus).every((status) => status);
    const areAllVideosLoaded = Object.values(allVideosStatus).every((status) => status);


    /*
    //Для отладки просмотр, сколько загружено
    const totalIcons = Object.keys(allIconsStatus).length;
    const totalVideos = Object.keys(allVideosStatus).length;

    const loadedIcons = Object.values(allIconsStatus).filter((status) => status).length;
    const loadedVideos = Object.values(allVideosStatus).filter((status) => status).length;

    const iconsProgress = totalIcons > 0 ? Math.round((loadedIcons / totalIcons) * 100) : 0;
    const videosProgress = totalVideos > 0 ? Math.round((loadedVideos / totalVideos) * 100) : 0;

    useEffect(() => {
        console.log(`Icons progress: ${iconsProgress}% (${loadedIcons}/${totalIcons})`);
        console.log(`Videos progress: ${videosProgress}% (${loadedVideos}/${totalVideos})`);
    }, [iconsProgress, videosProgress]);*/

    const registerIcon = useCallback((id: string) => {
        setAllIconsStatus((prev) => ({ ...prev, [id]: false }));
    }, []);

    const registerVideo = useCallback((id: string) => {
        setAllVideosStatus((prev) => ({ ...prev, [id]: false }));
    }, []);

    const setIconLoaded = useCallback((id: string) => {
        setAllIconsStatus((prev) => ({ ...prev, [id]: true }));
    }, []);

    const setVideoLoaded = useCallback((id: string) => {
        setAllVideosStatus((prev) => ({ ...prev, [id]: true }));
    }, []);


    return (
        <LoadContext.Provider
            value={{
                allIconsStatus,
                allVideosStatus,
                areAllIconsLoaded,
                areAllVideosLoaded,
                registerIcon,
                registerVideo,
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
    if (!context) {
        throw new Error("useLoadContext must be used within a MediaLoadingProvider");
    }
    return context;
};

