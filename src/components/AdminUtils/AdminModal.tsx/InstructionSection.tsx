import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface InstructionSectionProps {
    showInstruction: boolean;
    onBackClick: () => void;
}

const InstructionSection = React.memo(({ showInstruction, onBackClick }:InstructionSectionProps) => {
    return (
        <Box display={showInstruction ? 'block' : 'none'} p={2} border={1} borderColor="grey.300">
            <Typography variant="h5" gutterBottom>
                Инструкция
            </Typography>
            <Typography variant="body1">
                {/* Здесь можно добавить текст инструкции */}
                Это текст инструкции. Заполните поля и нажмите "Изменить карточку".
            </Typography>
            <Button variant="contained" color="secondary" onClick={onBackClick} sx={{ mt: 2 }}>
                Назад
            </Button>
        </Box>
    );
});

export default InstructionSection;
