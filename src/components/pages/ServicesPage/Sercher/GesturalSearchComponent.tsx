import styles from './searcher.module.css'
import recordSVG from "../../../../assets/img/record.svg";
import { Button } from '@mui/material';

const GesturalSearchComponent = ({onClick} : {onClick: ()=> void})  => {
    const recordImg = recordSVG//`${process.env.PUBLIC_URL}img/record.svg`;
    return (
        <Button 
        onClick={onClick}
        id="showPopup" 
        className={`${styles["showPopup"]}`} 
        type="button" 
        sx={{ 
            textTransform: 'none',
            fontWeight: "400",
            fontSize: "0.875rem",
            lineHeight: "normal",
            display:"inline-block"
        }}
        >
            <span className={"button-title"}>Поиск по РЖЯ</span>
            <img src={recordImg} alt="Кнопка поиска жестами" />
        </Button>
    );
}
export default GesturalSearchComponent;