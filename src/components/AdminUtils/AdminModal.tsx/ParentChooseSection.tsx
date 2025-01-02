import React, { useEffect, useState } from 'react';
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography, Select, MenuItem, InputLabel, SelectChangeEvent } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { FormType } from '../../../contextProviders/formTypeProvider';
import { getCategoriesTitles, TitlesMap } from '../../../utill';

interface ParentChooseSectionProps {
    myOnChange: (type: string) => void;
    formType: FormType;
    parentId: number;
}


interface Parent {
    key: number;
    label: string;
    isSelected?: boolean
}


const ParentChooseSection = ({ myOnChange, formType, parentId }: ParentChooseSectionProps) => {
    const DEFAULT_SELECT_VALUE = 0;
    const { register, watch, setValue } = useFormContext();
    const [parentOptions, setParentOptions] = useState<Parent[]>([]);

    const [selectValue, setSelectValue] = useState<number>(DEFAULT_SELECT_VALUE);

    const switchToTransferValue = watch("switchToTransfer", -1); // по умолчанию -1
    //const parentName = getCategoryTitleById(parentId) || "Error";

    //const parentName = getEveryTitle[parentId]

    // Функция для преобразования TitlesMap в массив Category

    const transformTitlesMapToArray = (titlesMap: TitlesMap): Parent[] => {
        const withNoSub = Object.entries(titlesMap).filter(([_, label]) => !label.isSubCategory);
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

    useEffect(() => {
        if (parentName && parentName.title ) {
            const parent: Parent = { key: 0, label: parentName.title, isSelected: true };
            setParentOptions([
                parent,
                ...titlesMap
            ]);
        }
    }, [switchToTransferValue]);

    const handleSetDefault = () => {
        /*const updateSelection = (arr: Parent[], parentName: { title: string }): Parent[] => {
            return arr.map(item => ({
                ...item,
                isSelected: item.label === parentName.title
            }));
        }
        const updatedArray = updateSelection(parentOptions, parentName);
        setParentOptions(updatedArray);*/
        //const parent: Parent = { key: 0, label: parentName.title, isSelected: true };
        //setParentOptions([parent]);
        setSelectValue(0)
    }

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value === 'true'; // Преобразуем строку в булево значение
        myOnChange(value ? 'true' : 'false'); // Вызываем onChange с соответствующим значением
    };

    const handleChange = (event: SelectChangeEvent<typeof selectValue>) => {
        const id = Number(event.target.value);
        setSelectValue(id);
        setValue("switchToTransfer", id)
    };
    const isSubCat =  typeof parentNameCategory == "undefined" && !parentNameCategory;
    const showTransfer = formType === FormType.CREATE || isSubCat;
    return (
        <Box>
            <div className={showTransfer ? 'hidden' : ''}>
                <Typography variant="subtitle1">Переместить карточку</Typography>
                <FormControl component="fieldset">
                    <RadioGroup
                        row
                        onChange={handleTypeChange}
                    >
                        <FormControlLabel
                            value={true}
                            control={<Radio   />}
                            label="Да"
                            disabled={formType === FormType.CREATE}
                            onClick={()=>  setValue("switchToTransfer", -2)}
                        />
                        <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label="Нет"
                            onClick={handleSetDefault}
                            disabled={formType === FormType.CREATE}
                        />
                    </RadioGroup>
                </FormControl>
            </div>

            <FormControl fullWidth margin="normal">
                <InputLabel id="parent-select-label">Родительская карточка</InputLabel>
                <Select
                    value={selectValue}
                    defaultValue={DEFAULT_SELECT_VALUE}
                    labelId="parent-select-label"
                    {...register('parentId')}
                    onChange={handleChange}
                    disabled={switchToTransferValue === -1}
                >
                    {parentOptions.map((option) => (
                        <MenuItem
                            selected={option.isSelected}
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

