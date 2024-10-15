import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';

interface DescriptionPart {
    text: string;
    icon?: string;
}

const DescriptionPartComponent = ({ text, icon, index }: { text: string; icon: string; index: number }) => {
    const { register } = useFormContext();
    console.log(icon);
    return (
        <>
            <TextField
            {...register(`descriptionParts.${index}`)} // Используем индексы для уникальности
            label={`Описание ${index + 1}`} // Можно изменить метку для каждого поля
            variant="outlined"
            fullWidth
            margin="normal"
            defaultValue={text} // Используем defaultValue вместо value
        />
        </>
    );
};

const ResultParts = ({descriptionParts, iconLinks}:{descriptionParts:string[] | undefined, iconLinks:string[] | undefined}) => {

    const [descriptionPartsNode, setDescriptionParts] = useState<DescriptionPart[]>([]);
        const icons = iconLinks ? iconLinks :[]
        const parts = descriptionParts ? descriptionParts :[]

        useEffect(() => {
        // Установите значения для descriptionParts
        const resParts: DescriptionPart[] = parts.map((text, index) => {
            const icon =icons[index];
            return ({ text, icon })}
        );
        setDescriptionParts(resParts);
        /*setDescriptionParts([
            { text: '' },
            { text: '' },
            // Добавьте другие части описания по необходимости
        ]);*/
    }, [iconLinks, descriptionParts]);

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Описание</Typography>
            {descriptionPartsNode.map((part, index) => (
                <DescriptionPartComponent key={index} text={part.text} icon={part.icon ? part.icon: "-1"} index={index} />
            ))}
        </Box>
    );
};

export default ResultParts;

