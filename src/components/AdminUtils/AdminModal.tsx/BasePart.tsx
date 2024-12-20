import { Box, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { CardType, FormType } from '../../../contextProviders/formTypeProvider';
import ImageField from './ImageField';

const BasePart = ({ formType, cardType }: { formType: FormType, cardType: "" | CardType, }) => {
    const { register } = useFormContext();
    const isReadOnly = formType === FormType.EDIT && true;

    const isText = formType === FormType.TEXT;
    const isTitle = formType === FormType.TITLE;
    const isResVideo = formType === FormType.VIDEO;
    if (isText){
        return false;
    }
    if (isTitle){
        return (
            <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Базовые поля</Typography>
            <TextField
                required
                {...register('title')}
                label="Заголовок превью"
                variant="outlined"
                fullWidth
                margin="normal"
                slotProps={{
                    input: {
                        readOnly: isReadOnly,
                    },
                }}
            />
            </Box>
        )
    }
    if (isResVideo){
            return (
                <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Базовые поля</Typography>
                <TextField
                required
                {...register('resVideo')}
                label="Ссылка на видео объяснение"
                variant="outlined"
                fullWidth
                margin="normal"
                />
                </Box>
            )
    }
    
    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Базовые поля</Typography>
            <TextField
                required
                {...register('title')}
                label="Заголовок превью"
                variant="outlined"
                fullWidth
                margin="normal"
                slotProps={{
                    input: {
                        readOnly: isReadOnly,
                    },
                }}
            />
            {/*<TextField
                {...register('imagePreview')}
                label="Ссылка на изображение"
                variant="outlined"
                fullWidth
                margin="normal"
            />*/}
            {
                <>
                <ImageField required registerName={'mainIconLink'} />
                <TextField
                    required
                    {...register('gifPreview')}
                    label="Ссылка на видео превью"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                </>
            }
            
            {(cardType == CardType.ADDITIONAL_INFO || cardType == CardType.SERVICE) &&
            <TextField
                required
                {...register('resVideo')}
                label="Ссылка на видео объяснение"
                variant="outlined"
                fullWidth
                margin="normal"
            />}
        </Box>
    );
};

export default BasePart;
