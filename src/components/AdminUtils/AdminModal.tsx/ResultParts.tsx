import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';

const ResultParts= () => {
    const { register } = useFormContext();

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Результаты</Typography>
            <TextField
                {...register('resultField1')}
                label="Поле результата 1"
                variant="outlined"
                fullWidth
                margin="normal"
            />
            <TextField
                {...register('resultField2')}
                label="Поле результата 2"
                variant="outlined"
                fullWidth
                margin="normal"
            />
        </Box>
    );
};

export default ResultParts;
