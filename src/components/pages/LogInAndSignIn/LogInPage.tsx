import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import UsernameField from './UsernameField';
import PasswordField from './PasswordField';
import RememberMeCheckbox from './RememberMe';
import ExtendedButtons from './ExtendedButtons';
import LoginFormInputs from '../../../interfaces/LogInInterface';
import { logIn } from '../../../api/backendApi';
import authBoxStyle from '../../../styles/authBox';

const LoginPage = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const onSubmit: SubmitHandler<LoginFormInputs> = async(data) => {
        console.log('Login successful', data);
        await logIn(data.username, data.password)
        navigate(-1);
        window.location.reload();
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={authBoxStyle}
        >
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                Авторизация
            </Typography>
            <UsernameField register={register} errors={errors} />


            <PasswordField
                name="password"
                label="Password"
                register={register}
                errors={errors}
                validationRules={{
                required: 'Пароль обязателен',
                pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message:
                    'В пароле должно быть как минимум 8 символов, вреди них, как минимум одна большая буква, одна маленькая и одна цифра',
                },
                }}
            />

            {/*<PasswordField register={register} errors={errors} />*/}
            <RememberMeCheckbox register={register} />
            <ExtendedButtons />
        </Box>
    );
};

export default LoginPage;
