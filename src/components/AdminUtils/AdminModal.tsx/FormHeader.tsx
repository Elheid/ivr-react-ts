import { IconButton, Typography } from '@mui/material';
import React from 'react';
import { CardType, FormType } from '../../../contextProviders/formTypeProvider';

interface FormHeaderProps {
    onInstructionClick: () => void;
    formType:FormType;
    cardInFormType:CardType;
}

const FormHeader = ({ onInstructionClick, formType, cardInFormType }:FormHeaderProps) => {
    const titleTypePart = formType === FormType.EDIT ? "Редактирование ":  "Создание ";
    const titleCardPart = cardInFormType === CardType.SERVICE ? "услуги ":  
        cardInFormType === CardType.CATEGORY ? "категории" : 
        cardInFormType === CardType.SUB_CATEGORY ? "под категории" : "доп. инфы";

    return (
        <div className="form-header">
            <Typography variant='h3' className="form-title">{titleTypePart + titleCardPart}</Typography>
            <div className="instruction-button" onClick={onInstructionClick}>
                <IconButton >
                &#10068;
                </IconButton>
            </div>
        </div>
    );
};

export default FormHeader;
