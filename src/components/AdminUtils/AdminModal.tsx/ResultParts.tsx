import { useEffect, useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import ImageField from './ImageField';

interface DescriptionPart {
    text: string;
    icon?: string;
}

const DescriptionPartComponent = ({ text, index }: { text: string; icon: string; index: number }) => {
    const { register } = useFormContext();

    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/g;

    // Пытаемся извлечь ссылку из тега <img>
    const match = imgRegex.exec(text);
    const imgSrc = match ? match[1] : null;

    const parts =  text.split(imgRegex)[0];

    return (
        <>
            <TextField
                {...register(`descriptionParts.${index}`)} // Используем индексы для уникальности
                label={`Описание ${index + 1}`} // Можно изменить метку для каждого поля
                variant="outlined"
                fullWidth
                margin="normal"
                defaultValue={parts || text} // Используем defaultValue вместо value
            />
            {<ImageField registerName={`iconLinks.${index}`} img={imgSrc}/>}
        </>
    );
};

const ResultParts = ({ descriptionParts, iconLinks }: { descriptionParts: string[] | undefined, iconLinks: string[] | undefined }) => {

    const [descriptionPartsNode, setDescriptionParts] = useState<DescriptionPart[]>([]);
    const icons = iconLinks ? iconLinks : []
    const parts = descriptionParts ? descriptionParts : []

    useEffect(() => {
        // Установите значения для descriptionParts
        const resParts: DescriptionPart[] = parts.map((text, index) => {
            const icon = icons[index];
            return ({ text, icon })
        }
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
                <DescriptionPartComponent key={index} text={part.text} index={index} />
            ))}
        </Box>
    );
};

export default ResultParts;

