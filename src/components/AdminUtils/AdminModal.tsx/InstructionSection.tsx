import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import replaceWordsWithSpan from '../../../utill';

import instructions from "../../../assets/instruction.json"
import { CardType } from '../../../contextProviders/formTypeProvider';
interface InstructionSectionProps {
    showInstruction: boolean;
    onBackClick: () => void;
    cardInFormType: CardType;
}

const InstructionSection = React.memo(({ showInstruction, onBackClick, cardInFormType }:InstructionSectionProps) => {
    const insructionKey = cardInFormType === CardType.ADDITIONAL_INFO ? "info" : cardInFormType;
    const instruction = instructions[`${insructionKey}`];
    const instructionContent = instruction[1];
    const title = instruction[0];
    const res = replaceWordsWithSpan(instructionContent)
    console.log(res)
    return (
        <Box sx={{maxWidth:"30vw"}} display={showInstruction ? 'block' : 'none'} p={2} border={1} borderColor="grey.300">
            <Typography variant="h5" gutterBottom>
                {title}
            </Typography>
            <pre style={{textWrap:"wrap"}} dangerouslySetInnerHTML={{ __html: res }} />
            <Button variant="contained" color="secondary" onClick={onBackClick} sx={{ mt: 2 }}>
                Назад
            </Button>
        </Box>
    );
});

export default InstructionSection;
