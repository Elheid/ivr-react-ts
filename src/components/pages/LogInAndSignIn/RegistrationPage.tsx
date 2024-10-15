import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import TextFieldForLogin from './TextFieldForLogin';
import PasswordField from './PasswordField';

// Интерфейс формы регистрации
interface RegistrationFormInputs {
  username: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
}

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegistrationFormInputs>();

  // Валидация на совпадение пароля и подтверждения
  const password = watch('password');

  const onSubmit: SubmitHandler<RegistrationFormInputs> = (data) => {
    console.log('Registration successful', data);
    localStorage.setItem('user', JSON.stringify(data));
    navigate('/login');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: '600px',
        margin: 'auto',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: 'white',
      }}
    >
      <Typography variant="h5" component="div" sx={{ mb: 2 }}>
        Регистрация
      </Typography>

      <TextFieldForLogin
        name="username"
        label="Логин"
        register={register}
        errors={errors}
        validationRules={{
          required: 'Username is required',
          minLength: { value: 3, message: 'Username must be at least 3 characters' },
        }}
      />

      <TextFieldForLogin
        name="firstName"
        label="Имя"
        register={register}
        errors={errors}
        validationRules={{ required: 'First name is required' }}
      />

      <TextFieldForLogin
        name="lastName"
        label="Фамилия"
        register={register}
        errors={errors}
        validationRules={{ required: 'Last name is required' }}
      />

      <PasswordField
        name="password"
        label="Пароль"
        register={register}
        errors={errors}
        validationRules={{
          required: 'Password is required',
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            message:
              'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one number',
          },
        }}
      />

      <PasswordField
        name="passwordConfirm"
        label="Подтверждение пароля"
        register={register}
        errors={errors}
        validationRules={{
          required: 'Please confirm your password',
          validate: (value: string) => value === password || 'Passwords do not match',
        }}
      />

      <Button className={"login-button"} type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Зарегистрироваться
      </Button>
    </Box>
  );
};

export default RegistrationPage;
