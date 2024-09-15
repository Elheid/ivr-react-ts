import { styled } from '@mui/material/styles';
import { IconButton } from "@mui/material";

// Создайте стилизованный компонент для кнопки с изображением
const ImageButton = styled(IconButton)({
    padding: 0, // Уберите отступы
    margin: "10px",
    marginBottom:0,
    marginTop:0,
    '& img': {

    }
});

export default ImageButton;