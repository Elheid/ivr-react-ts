import React, { useEffect, useState } from 'react';
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography, Select, MenuItem, InputLabel } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { FormType } from '../../../contextProviders/formTypeProvider';
import { getCategoriesTitles, TitlesMap } from '../../../utill';

interface ParentChooseSectionProps {
    onChange: (type: string) => void;
    formType: FormType;
    parentId: number;
}


interface Parent {
    key: number;
    label: string;
    isSelected?: boolean
}


const ParentChooseSection = ({ onChange, formType, parentId }: ParentChooseSectionProps) => {
    const { register, watch, setValue } = useFormContext();
    const [parentOptions, setParentOptions] = useState<Parent[]>([]);

    const switchToTransferValue = watch("switchToTransfer", false); // по умолчанию false
    //const parentName = getCategoryTitleById(parentId) || "Error";
    
    //const parentName = getEveryTitle[parentId]

    // Функция для преобразования TitlesMap в массив Category
    const transformTitlesMapToArray = (titlesMap: TitlesMap): Parent[] => {
        const withNoSub = Object.entries(titlesMap).filter(([_, label])=> !label.isSubCategory);
        return withNoSub.map(([key, label]) => ({
            key: parseInt(key, 10), // Преобразуем ключ из строки в число
            label: label.title,
        }));
    }

    const getEveryTitleMap = getCategoriesTitles();
    const getEveryTitle: Parent[] = transformTitlesMapToArray(getEveryTitleMap);
    const parentName = getEveryTitleMap[parentId]
    const parentNameCategory: Parent | undefined = getEveryTitle.find(item => item.key === parentId)
    const titlesMap = getEveryTitle
        .filter((item) => parentNameCategory ? item.key !== parentNameCategory.key : true)
        .map((item) => {
            return { key: item.key, label: item.label, isSelected: false };
        });


    //const titlesMap = getEveryTitle.filter((item) => item !== parentName).map((item) => { return { key: item.key, label: item.value, isSelected: false } })
    /*const titlesMap = getCategoriesTitles();
    const allCategoriesNames =  titlesMap.filter((el)=> el.title !== parentName);
    const parentOptionsMap = allCategoriesNames.map((el) => ({ value: el.id, label: el.title }));*/
    useEffect(() => {
        const parent:Parent = { key: 0, label: parentName.title, isSelected: true };
        setParentOptions([
            parent,
            ...titlesMap
        ]);
    }, [parentName.title]); 

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

            <FormControl  fullWidth margin="normal">
                <InputLabel  id="parent-select-label">Родительская карточка</InputLabel>
                <Select



                    defaultValue={0}
                    labelId="parent-select-label"
                    {...register('parentId')}
                    disabled={!switchToTransferValue}
                >
                    {parentOptions.map((option) => (
                        <MenuItem
                     

                        selected={true} 
                        key={option.key} 
                        value={option.key}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default ParentChooseSection;

