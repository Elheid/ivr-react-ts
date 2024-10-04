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
        logIn(data.username, data.password).then(()=> navigate(-1))
        
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
            <PasswordField register={register} errors={errors} />
            <RememberMeCheckbox register={register} />
            <ExtendedButtons />
        </Box>
    );
};

export default LoginPage;
