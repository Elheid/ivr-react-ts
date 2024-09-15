import styles from './searcher.module.css'
import { useCardSize } from "../../../contextProviders/CardSizeProvider";
import twoInRowSVG from "../../../assets/img/twoInRow.svg";
import oneInRowSVG from "../../../assets/img/oneInRow.svg";
import ImageButton from '../../ImageButtonComponent';


const NORMAL_CARD_SIZE = 6;
const LARGE_CARD_SIEZE = 12;


const TypeViewButtons = () => {
    const oneInRowImg = oneInRowSVG//`${process.env.PUBLIC_URL}img/twoInRow.svg`;
    const twoInRowImg = twoInRowSVG//`${process.env.PUBLIC_URL}img/oneInRow.svg`;

    const { setSize } = useCardSize();

    return (
        <div className={styles["view-buttons"]}>
            <ImageButton className="two-in-row" type="button" onClick={() => setSize(NORMAL_CARD_SIZE)}>
                <img src={twoInRowImg} alt="Кнопка 2 в ряд" />
            </ImageButton>
            <ImageButton className={styles["one-in-row"]} type="button" onClick={() => setSize(LARGE_CARD_SIEZE)} >
                <img src={oneInRowImg} alt="Кнопка 1 в ряд" />
            </ImageButton>
        </div>
    );
}

export default TypeViewButtons;