import eyeSVG from "../../../assets/img/eye.svg"
import eyeCrossedSVG from "../../../assets/img/eye-crossed.svg"
/*import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { FieldErrors, UseFormRegister } from 'react-hook-form';
import LoginFormInputs from '../../../interfaces/LogInInterface';



// Пропсы для компонента PasswordField
interface PasswordFieldProps {
    register: UseFormRegister<LoginFormInputs>;
    errors: FieldErrors<LoginFormInputs>;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ register, errors }) => {
    const [showPassword, setShowPassword] = useState(false);

    // Функция для переключения видимости пароля
    const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

    return (
        <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Пароль"
            {...register('password', {
                required: 'Пароль обязателен',
                pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message:
                        'В пароле должно быть как минимум 8 символов, вреди них, как минимум одна большая буква, одна маленькая и одна цифра',
                },
            })}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            margin="normal"
            sx={{ mt: 2 }}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={showPassword ? 'Спрятать пароль' : 'Показать паролль'}
                                onClick={handleTogglePasswordVisibility}
                                edge="end"
                            >
                                {showPassword
                                    ? <img style={{ width: "1.3vw" }} src={eyeSVG} alt="Показать пароль" />
                                    : <img style={{ width: "1.3vw" }} src={eyeCrossedSVG} alt="Спрятать пароль" />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }
            }}
        />
    );
};

export default PasswordField;*/

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

// Пропсы для компонента PasswordField
interface PasswordFieldProps<T> {
  name: keyof T;
  label: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  validationRules?: object; // Правила валидации для пароля
}

const PasswordField = <T,>({ name, label, register, errors, validationRules }: PasswordFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <TextField
      fullWidth
      type={showPassword ? 'text' : 'password'}
      label={label}
      {...register(name, validationRules)}
      error={Boolean(errors[name])}
      helperText={errors[name]?.message as string}
      margin="normal"
      sx={{ mt: 2 }}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={handleTogglePasswordVisibility}
                edge="end"
              >
                 {showPassword
                                    ? <img style={{ width: "1.3vw" }} src={eyeSVG} alt="Показать пароль" />
                                    : <img style={{ width: "1.3vw" }} src={eyeCrossedSVG} alt="Спрятать пароль" />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default PasswordField;

