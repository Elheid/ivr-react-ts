import { useEffect, useState } from 'react';
import { Box, Container, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import ImageField from './CustomFields/ImageField';
import ImageButton from '../../ImageButtonComponent';
import Scrollbar from '../../ScrollBar/ScrollBar';

interface DescriptionPart {
    text: string;
    icon?: string;
}

const DescriptionPartComponent = ({ text, index }: { text: string; index: number }) => {
    const { register, setValue } = useFormContext();
    const [value, setTextValue] = useState<string>("")


    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/g;
    const match = imgRegex.exec(text);
    const imgSrc = match ? match[1] : null;


    useEffect(() => {
        const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/g;
        const parts = text.split(imgRegex)[0];
        setTextValue(parts);
        if (imgSrc && imgSrc !== "") setValue(`iconLinks.${index}`, imgSrc);

    }, [text])

    return (
        <Container>
            <TextField
                InputLabelProps={{ shrink: true }}
                {...register(`descriptionParts.${index}`)}
                label={`Описание ${index + 1}`}
                variant="outlined"
                fullWidth
                margin="normal"
                value={value}
                onChange={(e) => setTextValue(e.target.value)}
            />
            {<ImageField registerName={`iconLinks.${index}`} img={imgSrc} />}
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
        if (resParts.length === 0) {
            setDescriptionParts([{ text: '', icon: '' }]);
        }
        else
            setDescriptionParts(resParts);
        /*setDescriptionParts([
            { text: '' },
            { text: '' },
            // Добавьте другие части описания по необходимости
        ]);*/
    }, [iconLinks, descriptionParts]);

    return (
        <Box sx={{ mt: 2 }}>
            <Scrollbar alginRight={true} height="60vh" addArrowsButtons={false}>
                <Typography variant="h6">Описание</Typography>
                {descriptionPartsNode.map((part, index) => (
                    <DescriptionPartComponent key={index} text={part.text} index={index} />
                ))}
                <ImageButton sx={{ fontSize: "2vw", mb: "60px" }} onClick={() => setDescriptionParts((prevParts) => [...prevParts, { text: '', icon: '' }])}>
                    +
                </ImageButton>
            </Scrollbar>
        </Box>
    );
};

export default ResultParts;

