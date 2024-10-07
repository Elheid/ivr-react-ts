import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';

const BasePart = () => {
    const { register } = useFormContext();

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Базовые поля</Typography>
            <TextField
                {...register('previewTitle')}
                label="Заголовок превью"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                    readOnly: true, // Запрет изменения
                }}
            />
            <TextField
                {...register('imagePreview')}
                label="Ссылка на изображение"
                variant="outlined"
                fullWidth
                margin="normal"
            />
            <TextField
                {...register('videoPreview')}
                label="Ссылка на видео"
                variant="outlined"
                fullWidth
                margin="normal"
            />
        </Box>
    );
};

export default BasePart;
