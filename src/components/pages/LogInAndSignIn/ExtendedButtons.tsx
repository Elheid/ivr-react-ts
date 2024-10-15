import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

const ExtendedButtons = () => (
    <>
        <Button className={"login-button"} type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Войти
        </Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link  className={"login-link"} href="#" variant="body2">
                Забыли пароль?
            </Link>
            <Box mt={1}>
                <Link className={"login-link"} href="/registration" variant="body2">
                    Зарегистрироваться
                </Link>
            </Box>
        </Box>
    </>
);

export default ExtendedButtons;
