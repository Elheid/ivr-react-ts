import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category, Service } from '../interfaces/CardsInterfaces';

interface CardContextProps {
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    services: Service[];
    setServices: React.Dispatch<React.SetStateAction<Service[]>>;
}


const CardContext = createContext<CardContextProps | undefined>({
    categories: [],
    setCategories: () => {},
    services: [],
    setServices: () => {},
});



export const CardProvider:  React.FC<{ children: ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<Category[] >([]);
    const [services, setServices] = useState<Service[]>([]);

    return (
        <CardContext.Provider value={{ categories, setCategories, services, setServices}}>
            {children}
        </CardContext.Provider>
    );
};
export const useCards = (): CardContextProps => {
    const context = useContext(CardContext);
    if (context === undefined) {
        throw new Error('useCardmust be used within a CardProvider');
    }
    return context;
};
