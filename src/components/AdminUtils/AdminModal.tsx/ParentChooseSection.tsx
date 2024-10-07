import React, { useEffect, useState } from 'react';
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography, Select, MenuItem, InputLabel } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { FormType } from '../../../contextProviders/formTypeProvider';

interface ParentChooseSectionProps {
    onChange: (type: string) => void;
    formType: FormType;
}

const ParentChooseSection = ({ onChange, formType }: ParentChooseSectionProps) => {
    const { register, watch, setValue } = useFormContext();
    const [parentOptions, setParentOptions] = useState<{ value: string; label: string }[]>([]);

    const switchToTransferValue = watch("switchToTransfer", false); // по умолчанию false

    useEffect(() => {
        setParentOptions([
            { value: '0', label: 'Card Title 1' },
            { value: '1', label: 'Card Title 2' },
            { value: '2', label: 'Card Title 3' },
        ]);
    }, []);

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value === 'true'; // Преобразуем строку в булево значение
        onChange(value ? 'true' : 'false'); // Вызываем onChange с соответствующим значением
        setValue("switchToTransfer", value); // Устанавливаем значение в форму
    };


    return (
        <Box>
                <div className={formType === FormType.CREATE ? 'hidden' : ''}>
                <Typography variant="subtitle1">Переместить карточку</Typography>
                <FormControl component="fieldset">
                    <RadioGroup 
                    row 
                    onChange={handleTypeChange}
                    >
                        <FormControlLabel
                            value={true}
                            control={<Radio {...register("switchToTransfer")} />}
                            label="Да"
                            disabled={formType === FormType.CREATE}
                        />
                        <FormControlLabel
                            value={false}
                            control={<Radio {...register("switchToTransfer")} />}
                            label="Нет"
                            disabled={formType === FormType.CREATE}
                        />
                    </RadioGroup>
                </FormControl>
                </div>

            <FormControl fullWidth margin="normal">
                <InputLabel id="parent-select-label">Родительская карточка</InputLabel>
                <Select 
                defaultValue={0} 
                labelId="parent-select-label" 
                {...register('parentId')}
                disabled={!switchToTransferValue}
                >
                    {parentOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default ParentChooseSection;

