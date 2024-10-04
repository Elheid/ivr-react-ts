
import TextField from '@mui/material/TextField';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import LoginFormInputs from '../../../interfaces/LogInInterface';

interface UsernameFieldProps {
    register: UseFormRegister<LoginFormInputs>;
    errors: FieldErrors<LoginFormInputs>;
}

const UsernameField= ({ register, errors }:UsernameFieldProps) => (
    <TextField
        fullWidth
        label="Имя пользователя"
        {...register('username', {
            required: 'Имя пользователя обязательно',
            minLength: {
                value: 3,
                message: 'Имя пользователя должно состоять как минимум из 3 букв',
            },
        })}
        error={Boolean(errors.username)}
        helperText={errors.username?.message}
        margin="normal"
    />
);

export default UsernameField;
