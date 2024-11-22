import React, { createContext, useContext, useState, ReactNode } from 'react';

enum CardType {
    CATEGORY = 'category',
    SERVICE = 'service',
    SUB_CATEGORY = 'subCategory',
    ADDITIONAL_INFO = 'additional-info',
}

enum FormType {
    EDIT = 'edit',
    CREATE = 'create',
    VIDEO = 'video',
    TITLE = 'title',
    TEXT = 'text',
}

interface CardAndFromTypeContextProps {
    cardType: CardType | '';
    setCardType: (type: CardType | '') => void;
    formType: FormType | '';
    setformType: (type: FormType | '') => void;
}

const CardAndFormTypeContext = createContext<CardAndFromTypeContextProps | undefined>(undefined);

const CardAndFormTypeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cardType, setCardType] = useState<CardType | ''>('');
    const [formType, setformType] = useState<FormType | ''>('');

    return (
        <CardAndFormTypeContext.Provider value={{ cardType, setCardType, formType, setformType }}>
            {children}
        </CardAndFormTypeContext.Provider>
    );
};

// Хук для использования контекста
const useCardAndFormType = (): CardAndFromTypeContextProps => {
    const context = useContext(CardAndFormTypeContext);
    if (!context) {
        throw new Error('useCardAndFormType must be used within a CardAndFormTypeProvider');
    }
    return context;
};

export { CardAndFormTypeProvider, useCardAndFormType, CardType, FormType };

