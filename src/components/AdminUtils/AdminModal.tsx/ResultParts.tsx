import { useEffect, useState } from 'react';
import { Box, Container, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import ImageField from './ImageField';

interface DescriptionPart {
    text: string;
    icon?: string;
}

const DescriptionPartComponent = ({ text, index }: { text: string; index: number }) => {
    const { register } = useFormContext();
    const [value, setValue] = useState<string>("")

    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/g;
    const match = imgRegex.exec(text);
    const imgSrc = match ? match[1] : null;
    useEffect(()=>{
    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/g;
    const parts =  text.split(imgRegex)[0];
    setValue(parts);

    },[text])

    return (
        <Container>
            <TextField
                
                {...register(`descriptionParts.${index}`)}
                label={`Описание ${index + 1}`} 
                variant="outlined"
                fullWidth
                margin="normal"
                value={value} 
                onChange={(e) => setValue(e.target.value)}
            />
            {<ImageField registerName={`iconLinks.${index}`} img={imgSrc}/>}
        </Container>
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

