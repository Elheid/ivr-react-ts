import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

const ExtendedButtons = () => (
    <>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Войти
        </Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link href="#" variant="body2">
                Забыли пароль?
            </Link>
            <Box mt={1}>
                <Link href="#" variant="body2">
                    Зарегистрироваться
                </Link>
            </Box>
        </Box>
    </>
);

export default ExtendedButtons;
