import React, { createContext, useContext, useState, ReactNode } from "react";

// Определение типов состояния
type PageState = "categories" | "sub-categories" | "services" | "info" | undefined;

// Определение интерфейса контекста
interface PageContextType {
    state: PageState;
    setState: (newState: PageState) => void;
}

// Создание контекста
const PageContext = createContext<PageContextType | undefined>(undefined);

// Провайдер контекста
const PageStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<PageState>();

    return (
        <PageContext.Provider value={{ state, setState }}>
            {children}
        </PageContext.Provider>
    );
};

// Хук для использования контекста
const usePageStateContext = (): PageContextType => {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error("usePageContext must be used within a PageProvider");
    }
    return context;
};

export { PageStateProvider, usePageStateContext };