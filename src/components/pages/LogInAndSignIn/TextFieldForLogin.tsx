import TextField from '@mui/material/TextField';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface CustomTextFieldProps<T  extends FieldValues> {
    name:  Path<T>;
    label: string;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    validationRules?: object; // Правила валидации
    type?: string; // Тип текстового поля (text, password и т.д.)
}

const CustomTextField = <T extends FieldValues,>({
    name,
    label,
    register,
    errors,
    validationRules,
    type = 'text',
}: CustomTextFieldProps<T>) => {
    return (
        <TextField
            fullWidth
            type={type}
            label={label}
            {...register(name, validationRules)}
            error={Boolean(errors[name])}
            helperText={errors[name]?.message as string}
            margin="normal"
        />
    );
};

export default CustomTextField;
